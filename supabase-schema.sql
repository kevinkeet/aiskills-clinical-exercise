-- Run this in Supabase SQL editor to create tables

create table participants (
  id uuid default gen_random_uuid() primary key,
  participant_id text unique not null,
  group_assignment text not null check (group_assignment in ('ai', 'control')),
  consent_given boolean default true,
  created_at timestamptz default now()
);

create table task_responses (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null references participants(participant_id),
  task_number integer not null check (task_number between 1 and 6),
  response text not null,
  time_spent_seconds integer not null,
  started_at timestamptz not null,
  submitted_at timestamptz default now(),
  unique(participant_id, task_number)
);

create table assessment_responses (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null references participants(participant_id),
  question_number integer not null check (question_number between 1 and 12),
  selected_answer text not null,
  submitted_at timestamptz default now(),
  unique(participant_id, question_number)
);

create table chat_logs (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null references participants(participant_id),
  task_number integer not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS but allow all operations (for simplicity with anon key)
alter table participants enable row level security;
alter table task_responses enable row level security;
alter table assessment_responses enable row level security;
alter table chat_logs enable row level security;

create policy "Allow all on participants" on participants for all using (true) with check (true);
create policy "Allow all on task_responses" on task_responses for all using (true) with check (true);
create policy "Allow all on assessment_responses" on assessment_responses for all using (true) with check (true);
create policy "Allow all on chat_logs" on chat_logs for all using (true) with check (true);
