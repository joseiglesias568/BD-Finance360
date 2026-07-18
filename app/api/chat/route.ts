import { NextRequest } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { streamText, stepCountIs } from 'ai';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { aiTools } from '@/lib/ai/tools';
import { logger } from '@/lib/logger';
import { getModelForQuery } from '@/lib/ai/model-router';

export async function POST(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  try {
    const { messages: rawMessages } = await request.json();

    if (!rawMessages || !Array.isArray(rawMessages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Normalize messages: SDK v6 sends { parts: [...] } format, streamText expects { content: string }
    const messages = rawMessages.map((m: any) => {
      // Already has content string — pass through
      if (typeof m.content === 'string') return { role: m.role, content: m.content };
      // SDK v6 parts format — convert to content string
      if (Array.isArray(m.parts)) {
        const textContent = m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
        return { role: m.role, content: textContent };
      }
      // Content as array (multi-part) — pass through
      if (Array.isArray(m.content)) return { role: m.role, content: m.content };
      // Fallback: extract any text we can find
      return { role: m.role, content: String(m.content || '') };
    });
    logger.info('Normalized messages', { count: messages.length, sample: JSON.stringify(messages[0]).slice(0, 200) });

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      logger.warn('Chat request without ANTHROPIC_API_KEY configured', { ip });
      return new Response(JSON.stringify({
        error: 'AI Chat is not configured. Please set ANTHROPIC_API_KEY in your environment variables.',
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = await buildSystemPrompt();

    // Intelligent model routing based on query complexity
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    const userText = typeof lastUserMessage?.content === 'string'
      ? lastUserMessage.content
      : Array.isArray(lastUserMessage?.content)
        ? lastUserMessage.content.map((p: { text?: string }) => p.text || '').join(' ')
        : '';
    const { model, tier, modelId } = getModelForQuery(userText);

    logger.info('Chat request', { ip, messageCount: messages.length, modelTier: tier, modelId });

    const streamOptions: Record<string, unknown> = {
      model,
      system: systemPrompt,
      messages,
      tools: aiTools,
      stopWhen: stepCountIs(10),
      maxTokens: 8192,
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error('Stream error', { error: msg });
        console.error('[STREAM ERROR]', msg);
      },
      onStepFinish: (step: any) => {
        const toolResults = step.toolResults || [];
        const totalResultSize = JSON.stringify(toolResults).length;
        logger.info('Step finished', {
          stepType: step.stepType,
          toolCallCount: step.toolCalls?.length ?? 0,
          toolResultCount: toolResults.length,
          totalResultSizeChars: totalResultSize,
          hasText: !!step.text && step.text.length > 0,
          textLength: step.text?.length ?? 0,
          finishReason: step.finishReason,
        });
        console.log('[STEP]', {
          type: step.stepType,
          tools: step.toolCalls?.length ?? 0,
          resultSize: totalResultSize,
          text: step.text?.length ?? 0,
          finish: step.finishReason,
        });
      },
    };
    const result = streamText(streamOptions as Parameters<typeof streamText>[0]);

    return result.toUIMessageStreamResponse();
  } catch (error) {
    logger.error('Chat API error', { ip, error: error instanceof Error ? error.message : 'Unknown error' });
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
