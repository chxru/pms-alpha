-- create schema
create schema if not exists diagnosis;

-- store categories
create table if not exists diagnosis.categories(id serial primary key, name text not null);

-- store diagnosis data
create table if not exists diagnosis.data(
  id serial primary key,
  category integer not null references diagnosis.categories(id),
  name text not null
);