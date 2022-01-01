-- create schema
create schema if not exists patients;

-- save encrypted patients basic info
create table if not exists patients.info(
  uuid text not null primary key,
  data text not null,
  full_name text not null,
  created_at TIMESTAMPTZ not null default now()
);

-- activate extension pg_trgm
create extension if not exists pg_trgm;

-- create index using pg_trgm
create index if not exists trgx_idx_patients_name on patients.info using gin (full_name gin_trgm_ops);