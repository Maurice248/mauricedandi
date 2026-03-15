create extension if not exists pgcrypto;

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  key text not null unique,
  deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.api_keys
add column if not exists deleted boolean not null default false;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists api_keys_set_updated_at on public.api_keys;
create trigger api_keys_set_updated_at
before update on public.api_keys
for each row execute function public.set_updated_at();
