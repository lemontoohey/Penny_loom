import Anthropic from '@anthropic-ai/sdk';
import { STAGES } from '../data/stages';

let client: Anthropic | null = null;
let currentKey = '';

export function getClient(apiKey: string): Anthropic {
  if (!client || currentKey !== apiKey) {
    client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    currentKey = apiKey;
  }
  return client;
}

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
- Short answers by default (2-4 sentences), only expand when complexity demands it

Current user context:
- Current stage: ${stageName}
- Steps completed so far: ${stepsText}
- Loom type: 4-shaft table loom (assume this throughout)

If the user asks something outside weaving, gently redirect to their weaving journey. If they seem frustrated, empathise first, then troubleshoot.`;
}

export interface StreamCallbacks {
  onToken: (accumulatedText: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: string) => void;
}

export async function sendWrenMessage(
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    const anthropic = getClient(apiKey);

    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      stream: true,
    });

    let fullText = '';

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        fullText += event.delta.text;
        callbacks.onToken(fullText);
      }
    }

    callbacks.onDone(fullText);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred';
    callbacks.onError(message);
  }
}
