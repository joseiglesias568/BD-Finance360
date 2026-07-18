import { anthropic } from '@ai-sdk/anthropic';

export type ModelTier = 'haiku' | 'sonnet' | 'opus';

export const MODEL_MAP = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
} as const;

/**
 * Model routing strategy:
 * - Sonnet 4.6 is the default for ALL queries.
 *   It has the best balance of reasoning, tool use, and speed.
 * - Opus is reserved only for explicit deep investigation requests.
 * - Haiku is NOT used — even simple lookups benefit from Sonnet's
 *   ability to add context and use tools proactively.
 */

// L5: Root cause / deep investigation → Opus
const L5_PATTERNS = /\b(root cause|investigate|deep dive|what'?s really|explain the decline|decompose|multi.?factor|systemic|structural|underlying|comprehensive analysis)\b/i;

export function classifyQueryTier(message: string): ModelTier {
  const text = message.toLowerCase().trim();

  // L5 root cause analysis → Opus (most capable, deepest reasoning)
  if (L5_PATTERNS.test(text)) return 'opus';

  // Everything else → Sonnet 4.6 (smart enough for tool use + analysis)
  return 'sonnet';
}

export function getModelForQuery(message: string) {
  const tier = classifyQueryTier(message);
  const modelId = MODEL_MAP[tier];
  return {
    model: anthropic(modelId),
    tier,
    modelId,
  };
}
