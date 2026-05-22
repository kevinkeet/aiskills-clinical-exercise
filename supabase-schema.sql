-- IRB-86737: Stanford Clinical Case-Based Learning Study
-- Run this in the Supabase SQL editor.
-- WARNING: this migration drops the old participants table and dependents.
-- Only run on an environment that is pre-recruitment.

drop table if exists chat_logs cascade;
drop table if exists assessment_responses cascade;
drop table if exists task_responses cascade;
drop table if exists intake_responses cascade;
drop table if exists participants cascade;

-- participants: pre-seeded by the coordinator before recruitment opens.
-- One row per enrollment number (P-NNN). The arm assignment is generated
-- by scripts/generate-randomization.ts and uploaded via
-- POST /api/admin/seed-participants.
create table participants (
  participant_id        text primary key,
  pgy                   integer not null check (pgy in (1, 2, 3)),
  arm                   text not null check (arm in ('AI', 'CONTROL')),
  email                 text,        -- optional, for coordinator mailmerge only
  created_at            timestamptz default now(),
  consent_at            timestamptz,
  intake_completed_at   timestamptz,
  intake_complete       boolean default false,
  session_started_at    timestamptz,
  session_completed_at  timestamptz,
  current_step          text default 'consent'
                          check (current_step in
                            ('consent','enrollment','demographics',
                             'fabryPretest','case','assessment','done')),
  assessment_time_seconds integer,
  -- Single-active-session token. Rotated on each /api/intake/lookup so that
  -- if the participant logs in from a second device, the first session
  -- becomes invalid (the cookie's sessionId no longer matches this column).
  active_session_id     text
);

-- intake_responses: demographics + self-rated familiarity. One row per participant.
create table intake_responses (
  participant_id  text primary key references participants(participant_id) on delete cascade,
  demographics    jsonb not null,
  fabry_pretest   jsonb not null,
  mismatch_flags  jsonb default '{}'::jsonb,
  submitted_at    timestamptz default now()
);

create table task_responses (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null references participants(participant_id) on delete cascade,
  task_number integer not null check (task_number between 1 and 6),
  response text not null,
  time_spent_seconds integer not null,
  started_at timestamptz not null,
  submitted_at timestamptz default now(),
  unique(participant_id, task_number)
);

create table assessment_responses (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null references participants(participant_id) on delete cascade,
  -- Question numbers map to rows in `quiz_questions`. The lower bound is
  -- enforced; the upper bound is open so admins can add new questions.
  question_number integer not null check (question_number >= 1),
  selected_answer text not null,
  time_spent_seconds integer default 0,
  submitted_at timestamptz default now(),
  unique(participant_id, question_number)
);

create table chat_logs (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null references participants(participant_id) on delete cascade,
  task_number integer not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Pilot user feedback on tasks and quiz questions. Inline textarea shown
-- only to participants whose IDs begin with PILOT; real recruits do not
-- see the feedback UI.
create table pilot_feedback (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null references participants(participant_id) on delete cascade,
  item_type text not null check (item_type in ('task','question')),
  item_number int not null check (item_number >= 1),
  feedback text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(participant_id, item_type, item_number)
);

-- Editable study content. Auto-seeded with src/data/tasks.ts and
-- src/data/questions.ts on first GET; overridden by admin edits.
create table tasks (
  number int primary key check (number >= 1),
  title text not null,
  prompt text not null,
  show_additional_findings boolean not null default false,
  min_chars int not null default 200,
  updated_at timestamptz not null default now()
);

create table quiz_questions (
  number int primary key check (number >= 1),
  type text not null check (type in ('mcq','scale')),
  text text not null,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_answer text check (correct_answer is null or correct_answer in ('A','B','C','D')),
  scale_min int,
  scale_max int,
  scale_min_label text,
  scale_max_label text,
  task_domain text,
  notes text,
  updated_at timestamptz not null default now()
);

-- RLS: enabled, but allow all because writes go through the service via the anon key
-- and all sensitive endpoints are gated server-side.
alter table participants enable row level security;
alter table intake_responses enable row level security;
alter table task_responses enable row level security;
alter table assessment_responses enable row level security;
alter table chat_logs enable row level security;
alter table tasks enable row level security;
alter table quiz_questions enable row level security;
alter table pilot_feedback enable row level security;

create policy "Allow all on participants" on participants for all using (true) with check (true);
create policy "Allow all on intake_responses" on intake_responses for all using (true) with check (true);
create policy "Allow all on task_responses" on task_responses for all using (true) with check (true);
create policy "Allow all on assessment_responses" on assessment_responses for all using (true) with check (true);
create policy "Allow all on chat_logs" on chat_logs for all using (true) with check (true);
create policy "Allow all on tasks" on tasks for all using (true) with check (true);
create policy "Allow all on quiz_questions" on quiz_questions for all using (true) with check (true);
create policy "Allow all on pilot_feedback" on pilot_feedback for all using (true) with check (true);
