/**
 * Editable study content (tasks + quiz questions) backed by Supabase.
 *
 * - The canonical defaults live in src/data/tasks.ts and src/data/questions.ts.
 * - On first read, those defaults are inserted into the `tasks` and
 *   `quiz_questions` tables (idempotent: ON CONFLICT DO NOTHING).
 * - Subsequent reads come from the database, so admin edits made via
 *   /api/admin/tasks and /api/admin/questions are immediately reflected
 *   on /exercise, /assessment, and the admin stats/export routes.
 */
import { getSupabase } from './supabase';
import { defaultTasks, type Task } from '@/data/tasks';
import { defaultQuestions, type Question, type MCQQuestion } from '@/data/questions';

// ---------------- Tasks ----------------

interface TaskRow {
  number: number;
  title: string;
  prompt: string;
  show_additional_findings: boolean;
  min_chars: number;
}

function rowToTask(row: TaskRow): Task {
  return {
    number: row.number,
    title: row.title,
    prompt: row.prompt,
    showAdditionalFindings: row.show_additional_findings,
    minChars: row.min_chars,
  };
}

function taskToInsertRow(t: Task): TaskRow {
  return {
    number: t.number,
    title: t.title,
    prompt: t.prompt,
    show_additional_findings: !!t.showAdditionalFindings,
    min_chars: t.minChars,
  };
}

async function ensureTasksSeeded(): Promise<void> {
  const sb = getSupabase();
  const { data, error } = await sb.from('tasks').select('number');
  if (error) throw new Error(`tasks read failed: ${error.message}`);
  const seeded = new Set((data ?? []).map((r) => r.number));
  const missing = defaultTasks
    .filter((t) => !seeded.has(t.number))
    .map(taskToInsertRow);
  if (missing.length === 0) return;
  const { error: insErr } = await sb
    .from('tasks')
    .upsert(missing, { onConflict: 'number' });
  if (insErr) throw new Error(`tasks seed failed: ${insErr.message}`);
}

export async function loadTasks(): Promise<Task[]> {
  await ensureTasksSeeded();
  const { data, error } = await getSupabase()
    .from('tasks')
    .select('*')
    .order('number');
  if (error) throw new Error(`tasks load failed: ${error.message}`);
  return (data as TaskRow[]).map(rowToTask);
}

/** Upsert one task by number. Used by /api/admin/tasks. */
export async function upsertTask(t: Task): Promise<void> {
  const row = { ...taskToInsertRow(t), updated_at: new Date().toISOString() };
  const { error } = await getSupabase()
    .from('tasks')
    .upsert(row, { onConflict: 'number' });
  if (error) throw new Error(`task upsert failed: ${error.message}`);
}

// ---------------- Quiz questions ----------------

interface QuizRow {
  number: number;
  type: 'mcq' | 'scale';
  text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string | null;
  scale_min: number | null;
  scale_max: number | null;
  scale_min_label: string | null;
  scale_max_label: string | null;
  task_domain: string | null;
  notes: string | null;
}

function rowToQuestion(row: QuizRow): Question {
  if (row.type === 'mcq') {
    return {
      number: row.number,
      type: 'mcq',
      text: row.text,
      options: [
        { label: 'A', value: row.option_a ?? '' },
        { label: 'B', value: row.option_b ?? '' },
        { label: 'C', value: row.option_c ?? '' },
        { label: 'D', value: row.option_d ?? '' },
      ],
      correctAnswer: row.correct_answer ?? 'A',
    };
  }
  return {
    number: row.number,
    type: 'scale',
    text: row.text,
    min: row.scale_min ?? 0,
    max: row.scale_max ?? 10,
    minLabel: row.scale_min_label ?? undefined,
    maxLabel: row.scale_max_label ?? undefined,
  };
}

function questionToInsertRow(q: Question): Omit<QuizRow, 'task_domain' | 'notes'> {
  if (q.type === 'scale') {
    return {
      number: q.number,
      type: 'scale',
      text: q.text,
      option_a: null,
      option_b: null,
      option_c: null,
      option_d: null,
      correct_answer: null,
      scale_min: q.min,
      scale_max: q.max,
      scale_min_label: q.minLabel ?? null,
      scale_max_label: q.maxLabel ?? null,
    };
  }
  const mcq = q as MCQQuestion;
  return {
    number: mcq.number,
    type: 'mcq',
    text: mcq.text,
    option_a: mcq.options.find((o) => o.label === 'A')?.value ?? null,
    option_b: mcq.options.find((o) => o.label === 'B')?.value ?? null,
    option_c: mcq.options.find((o) => o.label === 'C')?.value ?? null,
    option_d: mcq.options.find((o) => o.label === 'D')?.value ?? null,
    correct_answer: mcq.correctAnswer,
    scale_min: null,
    scale_max: null,
    scale_min_label: null,
    scale_max_label: null,
  };
}

async function ensureQuestionsSeeded(): Promise<void> {
  const sb = getSupabase();
  const { data, error } = await sb.from('quiz_questions').select('number');
  if (error) throw new Error(`questions read failed: ${error.message}`);
  const seeded = new Set((data ?? []).map((r) => r.number));
  const missing = defaultQuestions
    .filter((q) => !seeded.has(q.number))
    .map(questionToInsertRow);
  if (missing.length === 0) return;
  const { error: insErr } = await sb
    .from('quiz_questions')
    .upsert(missing, { onConflict: 'number' });
  if (insErr) throw new Error(`questions seed failed: ${insErr.message}`);
}

export async function loadQuestions(): Promise<Question[]> {
  await ensureQuestionsSeeded();
  const { data, error } = await getSupabase()
    .from('quiz_questions')
    .select('*')
    .order('number');
  if (error) throw new Error(`questions load failed: ${error.message}`);
  return (data as QuizRow[]).map(rowToQuestion);
}

/** Upsert one question by number. Used by /api/admin/questions. */
export async function upsertQuestion(q: Question): Promise<void> {
  const row = {
    ...questionToInsertRow(q),
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabase()
    .from('quiz_questions')
    .upsert(row, { onConflict: 'number' });
  if (error) throw new Error(`question upsert failed: ${error.message}`);
}
