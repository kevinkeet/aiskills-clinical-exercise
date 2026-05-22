'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Inline feedback textarea shown to pilot participants on each task and
 * each quiz question. The component is invisible / inert for real
 * recruits; the parent gates rendering on `participantId.startsWith('PILOT')`.
 *
 * Save behaviour: debounced (1 s) per-keystroke + flush on blur. The
 * parent should also flush via `flushFeedback()` ref when navigating
 * between items to avoid losing the last keystrokes.
 */
export default function PilotFeedbackBox({
  itemType,
  itemNumber,
  initialValue,
  onSavedChange,
}: {
  itemType: 'task' | 'question';
  itemNumber: number;
  initialValue: string;
  /** Called with the canonical value after each save round-trip. */
  onSavedChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialValue);

  // Reset when the item changes (e.g., navigating to a different question).
  useEffect(() => {
    setValue(initialValue);
    setSavedValue(initialValue);
    lastSavedRef.current = initialValue;
    setStatus('idle');
  }, [itemType, itemNumber, initialValue]);

  async function save(v: string) {
    if (v === lastSavedRef.current) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/pilot-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType, itemNumber, feedback: v }),
      });
      if (!res.ok) {
        setStatus('error');
        return;
      }
      lastSavedRef.current = v;
      setSavedValue(v);
      setStatus('saved');
      onSavedChange?.(v);
      // Drop the "saved" pill after a moment.
      setTimeout(() => setStatus((s) => (s === 'saved' ? 'idle' : s)), 1500);
    } catch {
      setStatus('error');
    }
  }

  function handleChange(next: string) {
    setValue(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(next), 1000);
  }

  function handleBlur() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    void save(value);
  }

  return (
    <div className="border border-amber-200 bg-amber-50/40 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={`pf-${itemType}-${itemNumber}`}
          className="text-xs font-semibold text-amber-900"
        >
          Pilot feedback on this {itemType === 'task' ? 'task' : 'question'}{' '}
          <span className="font-normal text-amber-700">(optional)</span>
        </label>
        <span className="text-[10px] text-amber-700">
          {status === 'saving' && 'Saving…'}
          {status === 'saved' && 'Saved'}
          {status === 'error' && 'Save failed'}
          {status === 'idle' &&
            (value !== savedValue
              ? 'Unsaved'
              : value
              ? 'Saved'
              : '')}
        </span>
      </div>
      <textarea
        id={`pf-${itemType}-${itemNumber}`}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={
          itemType === 'task'
            ? 'Was the prompt clear? Anything confusing or missing?'
            : 'Anything wrong with the question or the answer key? Other issues?'
        }
        rows={2}
        className="w-full px-2 py-1.5 border border-amber-200 rounded text-xs bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 leading-relaxed"
      />
    </div>
  );
}
