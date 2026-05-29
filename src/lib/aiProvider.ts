import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { STAGES } from '../data/stages';

export type AIProvider = 'anthropic' | 'groq';

export interface ProviderConfig {
  provider: AIProvider;
  anthropicKey: string;
  groqKey: string;
  groqModel: string;
}

export interface StreamCallbacks {
  onToken: (accumulatedText: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: string) => void;
}

export const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', badge: 'Recommended' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', badge: 'Ultra-fast' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B', badge: 'Efficient' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8×7B', badge: '32k context' },
] as const;

export const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
export const ANTHROPIC_MODEL = 'claude-sonnet-4-5';

// ─── System prompt (same regardless of provider) ───────────────────────────

export function buildSystemPrompt(stageId: number, completedSteps: string[]): string {
  const stage = STAGES.find((s) => s.id === stageId);
  const stageName = stage ? `Stage ${stageId}: ${stage.name}` : 'Getting Started';
  const stepsText = completedSteps.length > 0 ? completedSteps.join(', ') : 'none yet';

  return `You are Wren, a warm, expert weaving teacher who specialises in 4-shaft table looms. The user is a complete beginner.

You speak like a brilliant friend who knows everything about weaving — never condescending, always practical and encouraging. You celebrate small wins genuinely. You give short, actionable answers unless a full explanation is needed. You always reference the 4-shaft table loom specifically.

When a user is stuck, diagnose the likely cause first, then give a fix. Use concrete, sensory language ("feel the tension", "listen for the click", "look for the shed to be clean and wide").

Key persona traits:
- Warm but not saccharine
- Precise and practical
- Celebrates progress with genuine enthusiasm, not hollow praise
- Never talks down to the user
- Uses weaving jargon naturally but always defines it on first use
- Short answers by default (2–4 sentences), only expand when complexity demands it

Current user context:
- Current stage: ${stageName}
- Steps completed so far: ${stepsText}
- Loom type: 4-shaft table loom (assume this throughout)

If the user asks something outside weaving, gently redirect to their weaving journey. If they seem frustrated, empathise first, then troubleshoot.`;
}

// ─── Client caches ──────────────────────────────────────────────────────────

let _anthropic: { client: Anthropic; key: string } | null = null;
let _groq: { client: Groq; key: string } | null = null;

function getAnthropic(apiKey: string): Anthropic {
  if (!_anthropic || _anthropic.key !== apiKey) {
    _anthropic = { client: new Anthropic({ apiKey, dangerouslyAllowBrowser: true }), key: apiKey };
  }
  return _anthropic.client;
}

function getGroq(apiKey: string): Groq {
  if (!_groq || _groq.key !== apiKey) {
    _groq = { client: new Groq({ apiKey, dangerouslyAllowBrowser: true }), key: apiKey };
  }
  return _groq.client;
}

// ─── Anthropic streaming ───────────────────────────────────────────────────

async function sendViaAnthropic(
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  callbacks: StreamCallbacks
): Promise<void> {
  const anthropic = getAnthropic(apiKey);

  const stream = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
    stream: true,
  });

  let fullText = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text;
      callbacks.onToken(fullText);
    }
  }
  callbacks.onDone(fullText);
}

// ─── Groq streaming ────────────────────────────────────────────────────────

async function sendViaGroq(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  callbacks: StreamCallbacks
): Promise<void> {
  const groq = getGroq(apiKey);

  const stream = await groq.chat.completions.create({
    model,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: true,
  });

  let fullText = '';
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      fullText += delta;
      callbacks.onToken(fullText);
    }
  }
  callbacks.onDone(fullText);
}

// ─── Unified entry point ───────────────────────────────────────────────────

export async function sendWrenMessage(
  config: ProviderConfig,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    if (config.provider === 'groq') {
      if (!config.groqKey) throw new Error('No Groq API key set.');
      await sendViaGroq(config.groqKey, config.groqModel || DEFAULT_GROQ_MODEL, systemPrompt, messages, callbacks);
    } else {
      if (!config.anthropicKey) throw new Error('No Anthropic API key set.');
      await sendViaAnthropic(config.anthropicKey, systemPrompt, messages, callbacks);
    }
  } catch (err: unknown) {
    callbacks.onError(err instanceof Error ? err.message : 'An unexpected error occurred.');
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

export function providerLabel(config: Pick<ProviderConfig, 'provider' | 'groqModel'>): string {
  if (config.provider === 'groq') {
    const model = GROQ_MODELS.find((m) => m.id === config.groqModel);
    return `Groq · ${model?.name ?? config.groqModel}`;
  }
  return 'Claude · Anthropic';
}

export function hasValidKey(config: ProviderConfig): boolean {
  if (config.provider === 'anthropic') return config.anthropicKey.startsWith('sk-ant-');
  if (config.provider === 'groq') return config.groqKey.startsWith('gsk_');
  return false;
}
