-- create schema
create schema if not exists patients;

-- save encrypted patients basic info
create table if not exists patients.info(
  id integer primary key generated always as identity,
  data text,
  created_at TIMESTAMPTZ not null default now()
);

-- save patient full name for search
create table if not exists patients.search(
  id integer references patients.info(id),
  full_name text not null
);

-- activate extension pg_trgm
create extension if not exists pg_trgm;

-- create index using pg_trgm
create index if not exists trgx_idx_patients_name on patients.search using gin (full_name gin_trgm_ops);