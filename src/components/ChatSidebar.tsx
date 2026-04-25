'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant' | 'separator';
  content: string;
}

export default function ChatSidebar({
  participantId,
  taskNumber,
  caseContext,
  taskPrompt,
}: {
  participantId: string;
  taskNumber: number;
  /** Plain-text patient case (with new findings if revealed). Inserted into
   *  the textarea when the participant clicks "Insert case info". */
  caseContext?: string;
  /** Current task prompt; appended after the case when inserting. */
  taskPrompt?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [justInserted, setJustInserted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevTaskRef = useRef(taskNumber);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add separator when task changes
  useEffect(() => {
    if (prevTaskRef.current !== taskNumber && messages.length > 0) {
      setMessages((prev) => [
        ...prev,
        { role: 'separator', content: `Task ${taskNumber}` },
      ]);
    }
    prevTaskRef.current = taskNumber;
  }, [taskNumber, messages.length]);

  function copyMessage(content: string, idx: number) {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function insertCaseContext() {
    if (!caseContext) return;
    const block = `${caseContext}${taskPrompt ? `\n\nCURRENT TASK:\n${taskPrompt}` : ''}\n\n`;
    setInput((prev) => (prev.trim() ? `${prev.trim()}\n\n${block}` : block));
    setJustInserted(true);
    setTimeout(() => setJustInserted(false), 2000);
    // Focus the textarea and place cursor at the end so the participant can
    // immediately type their question.
    setTimeout(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
        ta.scrollTop = ta.scrollHeight;
      }
    }, 0);
  }

  async function sendMessage() {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    // Filter out separators for API call
    const apiMessages = newMessages
      .filter((m) => m.role !== 'separator')
      .map((m) => ({ role: m.role, content: m.content }));

    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          participantId,
          taskNumber,
        }),
      });

      if (!res.ok) {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: 'Sorry, there was an error. Please try again.',
          },
        ]);
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages([
                    ...newMessages,
                    { role: 'assistant', content: accumulated },
                  ]);
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Connection error. Please try again.',
        },
      ]);
    }

    setIsStreaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-border">
        <div className="font-semibold text-sm text-foreground">
          AI Assistant
        </div>
        <div className="text-xs text-muted">Ask anything</div>
      </div>
      <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-100 text-[11px] text-amber-800 leading-tight">
        Do not enter real patient identifiers (names, MRNs, dates of birth, etc.) in this chat. The
        case patient is fictional.
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-muted text-sm py-8">
            <div className="text-3xl mb-2">💬</div>
            <p>Send a message to get started.</p>
          </div>
        )}
        {messages.map((msg, i) => {
          if (msg.role === 'separator') {
            return (
              <div key={i} className="flex items-center gap-2 py-1">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted font-medium px-2">
                  {msg.content}
                </span>
                <div className="flex-1 border-t border-border" />
              </div>
            );
          }
          return (
            <div
              key={i}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm group relative ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-foreground'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm prose-slate max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-bold [&_h2]:font-semibold [&_h3]:font-semibold [&_h1]:mt-3 [&_h2]:mt-2 [&_h3]:mt-2 [&_code]:text-xs [&_code]:bg-slate-200 [&_code]:px-1 [&_code]:rounded">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {isStreaming &&
                      i === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-4 bg-muted animate-pulse ml-0.5 align-text-bottom" />
                      )}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                )}
                {msg.role === 'assistant' && msg.content && !isStreaming && (
                  <button
                    onClick={() => copyMessage(msg.content, i)}
                    className="absolute -bottom-5 right-0 text-[10px] text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIdx === i ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-border">
        {caseContext && (
          <button
            type="button"
            onClick={insertCaseContext}
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            title="Insert the patient case and current task into the message box"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            {justInserted ? 'Inserted into message' : 'Insert case info into context'}
          </button>
        )}
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={2}
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="px-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
