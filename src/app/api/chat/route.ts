import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getSupabase } from '@/lib/supabase';
import { getSessionParticipant } from '@/lib/session';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

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
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
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
