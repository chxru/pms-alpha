-- create schema
create schema if not exists diagnosis;

-- store categories
create table if not exists diagnosis.categories(
  id integer primary key generated always as identity,
  name text not null unique
);

-- store diagnosis data
create table if not exists diagnosis.data(
  id integer primary key generated always as identity,
  category integer not null references diagnosis.categories(id),
  name text not null,
  constraint dd_cn_unique unique (category, name)
);

-- create full text index for category name and data
create index if not exists trgx_idx_diag_cat on diagnosis.categories using gin (name gin_trgm_ops);

create index if not exists trgx_idx_diag_data on diagnosis.data using gin (name gin_trgm_ops);