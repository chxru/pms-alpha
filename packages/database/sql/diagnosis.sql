-- create schema
create schema if not exists pms;

-- store diagnosis data
create table if not exists pms.diagnosis(
  id serial,
  category text not null,
  name text not null
);

-- activate extension pg_trgm
create extension if not exists pg_trgm;

-- create index using pg_trgm
create index if not exists trgx_idx_diag_name on pms.diagnosis using gin (name gin_trgm_ops);