import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getSupabase } from '@/lib/supabase';
import { getSessionParticipant } from '@/lib/session';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Concise, helpful clinical-reasoning assistant. Pilot feedback flagged the
// AI as too verbose (long exam lists, overlong after-visit summaries), so the
// prompt explicitly pushes for brevity and length-matching.
const AI_SYSTEM_PROMPT = `You are a clinical reasoning assistant helping an internal medicine resident work through a patient case during a learning exercise. Be smart, accurate, and very concise.

- Lead with the highest-yield points. Prefer short, focused lists over exhaustive ones.
- Match the length of your answer to the question: a brief question gets a brief answer.
- Do not pad with disclaimers, restated context, or generic caveats.
- When the resident shares their own reasoning, give targeted, specific feedback rather than rewriting everything.
- Ask a short clarifying question only when the request is genuinely ambiguous.`;

export async function POST(req: NextRequest) {
  try {
    // Authenticate via session cookie. Reject if not in AI arm.
    const session = await getSessionParticipant();
    if (!session || session.arm !== 'AI') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const participantId = session.participantId;

    const reqBody = await req.json();
    const messages = reqBody.messages;
    const taskNumber = reqBody.taskNumber;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Missing messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Log user message to Supabase
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg?.role === 'user') {
      await getSupabase().from('chat_logs').insert({
        participant_id: participantId,
        task_number: taskNumber || 0,
        role: 'user',
        content: lastUserMsg.content,
      });
    }

    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: AI_SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    let fullAssistantResponse = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const text = event.delta.text;
              fullAssistantResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          // Log assistant response
          if (fullAssistantResponse) {
            await getSupabase().from('chat_logs').insert({
              participant_id: participantId,
              task_number: taskNumber || 0,
              role: 'assistant',
              content: fullAssistantResponse,
            });
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: String(err) })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
