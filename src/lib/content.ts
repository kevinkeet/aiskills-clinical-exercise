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

/**
 * Only-if-empty auto-seed. We never re-insert deleted rows, so admin
 * deletions persist across reloads. The defaults are written exactly
 * once: when the table is freshly created and contains no rows.
 */
async function ensureTasksSeeded(): Promise<void> {
  const sb = getSupabase();
  const { count, error } = await sb
    .from('tasks')
    .select('*', { count: 'exact', head: true });
  if (error) throw new Error(`tasks read failed: ${error.message}`);
  if ((count ?? 0) > 0) return;
  const { error: insErr } = await sb
    .from('tasks')
    .insert(defaultTasks.map(taskToInsertRow));
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

/** Delete one task by number. Existing task_responses keep their data. */
export async function deleteTask(number: number): Promise<void> {
  const { error } = await getSupabase()
    .from('tasks')
    .delete()
    .eq('number', number);
  if (error) throw new Error(`task delete failed: ${error.message}`);
}

/** The smallest currently-unused task number, for "Add task". */
export async function nextTaskNumber(): Promise<number> {
  const { data, error } = await getSupabase()
    .from('tasks')
    .select('number')
    .order('number', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`tasks max read failed: ${error.message}`);
  return ((data?.number ?? 0) as number) + 1;
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
  // Whether the question is shown to participants. The column has a DB
  // default of true; older rows (pre-migration) read back as undefined and
  // are treated as active. See setQuestionActive() and loadQuestions().
  active?: boolean | null;
}

function rowToQuestion(row: QuizRow): Question {
  // `active` is `false` only when explicitly hidden; undefined/null = live.
  const active = row.active !== false;
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
      active,
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
    active,
  };
}

// `active` is intentionally excluded: upsert/seed must not clobber the live
// flag. On a fresh insert the DB default (true) applies; on edit, omitting
// the column from the upsert payload leaves the existing value untouched.
// Use setQuestionActive() to change it.
function questionToInsertRow(
  q: Question
): Omit<QuizRow, 'task_domain' | 'notes' | 'active'> {
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

/** Only-if-empty auto-seed. See ensureTasksSeeded() for rationale. */
async function ensureQuestionsSeeded(): Promise<void> {
  const sb = getSupabase();
  const { count, error } = await sb
    .from('quiz_questions')
    .select('*', { count: 'exact', head: true });
  if (error) throw new Error(`questions read failed: ${error.message}`);
  if ((count ?? 0) > 0) return;
  const { error: insErr } = await sb
    .from('quiz_questions')
    .insert(defaultQuestions.map(questionToInsertRow));
  if (insErr) throw new Error(`questions seed failed: ${insErr.message}`);
}

/**
 * Load quiz questions.
 *
 * By default only LIVE questions are returned — this is what participants see
 * in the assessment (`/api/questions`) and what their score is computed
 * against (`/api/my-results`). Pass `{ includeInactive: true }` for the admin
 * editor, stats, and CSV export so the PI never loses access to hidden
 * questions or the responses already collected for them.
 */
export async function loadQuestions(
  opts?: { includeInactive?: boolean }
): Promise<Question[]> {
  await ensureQuestionsSeeded();
  const { data, error } = await getSupabase()
    .from('quiz_questions')
    .select('*')
    .order('number');
  if (error) throw new Error(`questions load failed: ${error.message}`);
  // Sort scale questions FIRST (e.g., the post-case comfort rating), then the
  // graded MCQs by number. Asking comfort up front captures the effect of the
  // case before the knowledge questions themselves reinforce additional
  // learning and inflate the rating.
  return (data as QuizRow[])
    .map(rowToQuestion)
    .filter((q) => opts?.includeInactive || q.active !== false)
    .sort((a, b) => {
      const ay = a.type === 'scale' ? 0 : 1;
      const by = b.type === 'scale' ? 0 : 1;
      if (ay !== by) return ay - by;
      return a.number - b.number;
    });
}

/**
 * Toggle a single question's live/hidden state without rewriting the rest of
 * the row. Used by the /admin "Hide from quiz / Make live" control.
 */
export async function setQuestionActive(
  number: number,
  active: boolean
): Promise<void> {
  const { error } = await getSupabase()
    .from('quiz_questions')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('number', number);
  if (error) throw new Error(`question active toggle failed: ${error.message}`);
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

/** Delete one question by number. Existing assessment_responses survive. */
export async function deleteQuestion(number: number): Promise<void> {
  const { error } = await getSupabase()
    .from('quiz_questions')
    .delete()
    .eq('number', number);
  if (error) throw new Error(`question delete failed: ${error.message}`);
}

/** The smallest currently-unused question number, for "Add question". */
export async function nextQuestionNumber(): Promise<number> {
  const { data, error } = await getSupabase()
    .from('quiz_questions')
    .select('number')
    .order('number', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`questions max read failed: ${error.message}`);
  return ((data?.number ?? 0) as number) + 1;
}
