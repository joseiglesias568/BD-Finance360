import { NextRequest } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { MODEL_MAP } from '@/lib/ai/model-router';

interface LeverSpec {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
  category: string;
}

export async function POST(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const { scenario, tabId, tabLabel, tabDescription, levers } = await request.json() as {
      scenario: string;
      tabId: string;
      tabLabel: string;
      tabDescription: string;
      levers: LeverSpec[];
    };

    if (!scenario || !levers?.length) {
      return Response.json({ error: 'Scenario description and levers are required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 });
    }

    // Build lever descriptions for the prompt
    const leverDescriptions = levers.map(l =>
      `- "${l.id}" (${l.name}): ${l.description}. Range: ${l.min}${l.unit} to ${l.max}${l.unit}, default: ${l.default}${l.unit}, step: ${l.step}`
    ).join('\n');

    const systemPrompt = `You are a Becton, Dickinson and Company financial scenario modeling AI assistant. Your job is to interpret natural language scenario descriptions and map them to specific financial lever adjustments.

You are working in the "${tabLabel}" analysis tab: ${tabDescription}

Available levers you can adjust:
${leverDescriptions}

Rules:
1. Only adjust levers that are relevant to the user's scenario description.
2. Values MUST be within the specified min/max range for each lever.
3. Values MUST be aligned to the step size (e.g., if step is 5, use values like 0, 5, 10, not 3 or 7).
4. If the user mentions a specific number, try to use it (clamped to range).
5. If the user describes a directional change (e.g., "increase", "improve"), adjust from the default in that direction.
6. If the scenario implies multiple lever changes, adjust all relevant levers.
7. Provide a concise explanation of your reasoning.

Context for Becton, Dickinson and Company:
- FY2026 adjusted EPS guidance $7.30–$7.50; Q1 FY26: Revenue $100.4B (+6.2% YoY), Adjusted Operating Income $5.15B, Adjusted EPS $2.57 (+14.2% YoY)
- Segments: Health Care Benefits / Aetna (medical membership 26.0M, MBR 84.6%); Health Services / Caremark (90M+ PBM lives managed, specialty Rx +18% YoY); Pharmacy & Consumer Wellness (9,000+ stores)
- CEO David Joyner and CFO Brian Newman priorities: MA MBR improvement 200–300 bps by FY27 repricing; Oak Street Health 200+ clinic integration; Caremark biosimilar program and GLP-1 formulary management; Health100 SG&A $2B cumulative savings by FY27; net leverage <4.0x
- Segment sensitivities: +100bps HCB MBR shift ≈ ~$550M HCB AOI (~$0.42 EPS); +100K GLP-1 scripts/month ≈ +$280M annualized specialty cost; +$550M savings ≈ +$0.42 EPS
- EPS sensitivities: +100bps MBR improvement ≈ +$0.42 EPS; +1M medical members ≈ +$200M HCB premium revenue; +$550M Health100 cost savings ≈ +$0.42 EPS
- Q1 FY26 actuals: HCB MBR 84.6%, specialty pharmacy +18% YoY, GLP-1 scripts +34% vs. +22% plan, medical membership 26.0M, net leverage ~4.2x`;

    // Build the dynamic schema based on available levers
    // Note: Anthropic API does not support min/max on number types in JSON schema,
    // so we use plain z.number() and enforce bounds after parsing
    const leverSchema = z.object(
      Object.fromEntries(
        levers.map(l => [
          l.id,
          z.number()
            .optional()
            .describe(`${l.name}: ${l.description}. Range ${l.min}-${l.max}, default ${l.default}`)
        ])
      )
    );

    const resultSchema = z.object({
      explanation: z.string().describe('A concise 1-2 sentence explanation of what the scenario models and why these levers were adjusted'),
      leverAdjustments: leverSchema.describe('Only include levers that should change from their defaults'),
    });

    const result = await generateObject({
      model: anthropic(MODEL_MAP.sonnet),
      schema: resultSchema,
      prompt: `Scenario: "${scenario}"\n\nAnalyze this scenario and determine which levers to adjust and to what values. Only adjust levers relevant to the scenario.`,
      system: systemPrompt,
    });

    // Clamp values to lever bounds
    const clampedAdjustments: Record<string, number> = {};
    for (const [leverId, value] of Object.entries(result.object.leverAdjustments)) {
      if (value != null) {
        const lever = levers.find(l => l.id === leverId);
        if (lever) {
          clampedAdjustments[leverId] = Math.max(lever.min, Math.min(lever.max, value as number));
        }
      }
    }

    return Response.json({
      explanation: result.object.explanation,
      leverAdjustments: clampedAdjustments,
    });
  } catch (error) {
    console.error('[SCENARIO-AI ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
