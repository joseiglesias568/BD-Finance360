import { NextRequest } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { MODEL_MAP } from '@/lib/ai/model-router';

export async function POST(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const { scenario, tabId, tabLabel, leverAdjustments, leverContext, calculatedImpact } = await request.json() as {
      scenario: string;
      tabId: string;
      tabLabel: string;
      leverAdjustments: Record<string, number>;
      leverContext: { id: string; name: string; unit: string; default: number }[];
      calculatedImpact?: Record<string, number | string>;
    };

    if (!scenario) {
      return Response.json({ error: 'Scenario description is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 });
    }

    // Build a description of what levers changed
    const leverChanges = Object.entries(leverAdjustments).map(([id, value]) => {
      const lever = leverContext.find(l => l.id === id);
      if (!lever) return null;
      const direction = value > lever.default ? 'increased' : value < lever.default ? 'decreased' : 'unchanged';
      return `${lever.name}: ${lever.default}${lever.unit} → ${value}${lever.unit} (${direction})`;
    }).filter(Boolean).join('\n');

    // Build impact context if available
    const impactContext = calculatedImpact
      ? `\nCalculated financial impact from the deterministic model:\n${Object.entries(calculatedImpact).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`
      : '';

    const systemPrompt = `You are a senior Becton, Dickinson and Company financial strategy advisor providing executive-level scenario analysis. Your analysis should combine quantitative reasoning with strategic health care, PBM, and pharmacy retail judgment.

Context:
- Becton, Dickinson and Company (NYSE: CVS) FY2026 adjusted EPS guidance $7.30–$7.50; Q1 FY26: Revenue $100.4B (+6.2% YoY), Adjusted Operating Income $5.15B, Adjusted EPS $2.57 (+14.2% YoY)
- Segments: Health Care Benefits / Aetna (medical membership 26.0M, Medical Benefit Ratio 84.6%); Health Services / Caremark PBM (90M+ lives managed, specialty Rx +18% YoY, Stelara biosimilar $450M+ annualized savings); Pharmacy & Consumer Wellness (9,000+ retail locations)
- CEO David Joyner and CFO Brian Newman priorities: MA MBR improvement via FY27 repricing (200–300 bps target); Oak Street Health 200+ clinic integration (value-based care); Caremark biosimilar program acceleration; Health100 SG&A $2B cumulative savings by FY27; net leverage <4.0x by FY27
- Key FY2026 facts: total revenue guidance ≥$405B; medical membership 26.0M (MA repricing cycle ongoing); specialty pharmacy +18% YoY; GLP-1 script growth +34% vs. +22% plan; net leverage ~4.2x
- Segment sensitivities: each 100bps HCB MBR shift ≈ ~$550M HCB AOI (~$0.42 EPS); each 100K GLP-1 scripts/month ≈ +$280M annualized specialty cost; each $550M Health100 savings ≈ +$0.42 EPS
- EPS sensitivities: +100bps MBR improvement ≈ +$0.42 EPS; +1M medical members ≈ +$200M HCB premium revenue; +$550M cost savings ≈ +$0.42 EPS
- Key risks: HCB MBR inpatient utilization trend adverse vs. plan; GLP-1 drug cost surge compressing Health Services specialty margin; CMS Star Ratings quality bonus risk; net leverage elevated post-Aetna/Oak Street acquisitions

You are analyzing the "${tabLabel}" scenario tab.`;

    const resultSchema = z.object({
      executiveSummary: z.string().describe('A 2-3 sentence executive summary of the scenario and its projected financial impact. Reference specific dollar amounts and basis points where possible.'),
      keyInsights: z.array(z.string()).describe('3-4 specific, actionable insights about this scenario. Each should be a single sentence with a quantitative element.'),
      risks: z.array(z.string()).describe('2-3 key risks or downside considerations. Be specific about what could go wrong and the magnitude.'),
      strategicImplication: z.string().describe('A 1-2 sentence strategic recommendation for leadership based on this scenario analysis.'),
      confidenceLevel: z.enum(['high', 'moderate', 'low']).describe('Confidence in the scenario projections based on the assumptions required'),
      confidenceRationale: z.string().describe('One sentence explaining why this confidence level was assigned'),
    });

    const result = await generateObject({
      model: anthropic(MODEL_MAP.sonnet),
      schema: resultSchema,
      prompt: `Analyze this scenario for Becton, Dickinson and Company leadership:

Scenario described by user: "${scenario}"

Lever adjustments made:
${leverChanges}
${impactContext}

Provide a comprehensive executive analysis combining the quantitative lever changes with strategic business context. Be specific with numbers and financial projections. Reference BD-specific dynamics (Medicare Advantage MCR management, Caremark specialty pharmacy growth, Oak Street value-based care integration, retail pharmacy optimization, free cash flow conversion, and leverage reduction).`,
      system: systemPrompt,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error('[SCENARIO-SUMMARY ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
