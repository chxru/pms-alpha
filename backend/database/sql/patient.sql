-- create schema
create schema if not exists patients;

-- save encrypted patients basic info
create table if not exists patients.info(
  id integer primary key generated always as identity,
  data text,
  created_at TIMESTAMPTZ not null default now()
);