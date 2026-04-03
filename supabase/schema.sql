-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ujhcutuccwhochxambxk/sql

create table if not exists articles (
  id           text        primary key,
  title        text        not null,
  source       text        not null,
  published_at timestamptz not null,
  summary      text,
  url          text        not null,
  topic        text,
  fetched_at   timestamptz not null default now()
);

-- If the table already exists, add the topic column:
-- alter table articles add column if not exists topic text;

-- Add neighborhood column (run if table already exists):
-- alter table articles add column if not exists neighborhood text;

create index if not exists articles_published_at_idx on articles (published_at desc);
create index if not exists articles_topic_idx on articles (topic);
create index if not exists articles_neighborhood_idx on articles (neighborhood);

alter table articles enable row level security;

create policy "Public read access"
  on articles for select using (true);

create policy "Server upsert access"
  on articles for insert with check (true);

create policy "Server update access"
  on articles for update using (true);
