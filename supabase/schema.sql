-- ============================================================
-- eshkon page builder - supabase schema
-- run this in supabase sql editor (in order)
-- ============================================================

-- 1. profiles table (synced from auth.users via trigger)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'viewer'
    check (role in ('viewer', 'editor', 'admin', 'super_admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. pages table
create table public.pages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  content jsonb not null default '[]'::jsonb,
  author_id uuid references public.profiles(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

-- 3. page_versions - audit trail for content changes
create table public.page_versions (
  id uuid default gen_random_uuid() primary key,
  page_id uuid references public.pages(id) on delete cascade not null,
  content jsonb not null,
  version int not null,
  created_by uuid references public.profiles(id) not null,
  created_at timestamptz default now()
);

-- 4. auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. updated_at auto-update trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger pages_updated_at
  before update on public.pages
  for each row execute function public.update_updated_at();

-- ============================================================
-- rls policies
-- ============================================================

alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.page_versions enable row level security;

-- profiles: anyone can read, users update own
create policy "profiles_select" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- profiles: admin+ can update any (for role changes)
create policy "profiles_admin_update" on public.profiles
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- pages: anyone reads published
create policy "pages_select_published" on public.pages
  for select using (status = 'published');

-- pages: author reads own drafts
create policy "pages_select_own_drafts" on public.pages
  for select using (author_id = auth.uid());

-- pages: admin+ reads all
create policy "pages_select_admin" on public.pages
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- pages: authenticated users can insert (author_id must match)
create policy "pages_insert" on public.pages
  for insert with check (author_id = auth.uid());

-- pages: author can update own
create policy "pages_update_own" on public.pages
  for update using (author_id = auth.uid());

-- pages: admin+ can update any (for publish/unpublish)
create policy "pages_admin_update" on public.pages
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- pages: admin+ can delete any
create policy "pages_admin_delete" on public.pages
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- page_versions: read all, insert own
create policy "versions_select" on public.page_versions
  for select using (true);

create policy "versions_insert" on public.page_versions
  for insert with check (created_by = auth.uid());

-- ============================================================
-- indexes for perf
-- ============================================================
create index idx_pages_slug on public.pages(slug);
create index idx_pages_status on public.pages(status);
create index idx_pages_author on public.pages(author_id);
create index idx_versions_page on public.page_versions(page_id);
