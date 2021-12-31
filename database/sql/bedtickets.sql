-- create schema
create schema if not exists bedtickets;

create table if not exists bedtickets.tickets(
  ticket_id char(16) primary key not null,
  created_at TIMESTAMPTZ not null default now(),
  created_by integer references users.data(id) not null,
  discharged_at TIMESTAMPTZ,
  discharged_by integer references users.data(id)
);

create table if not exists bedtickets.entries(
  entry_id integer primary key generated always as identity,
  category text not null,
  topic text,
  diagnosis integer references diagnosis.data(id),
  note text,
  attachments text,
  ticket_id char(16) not null references bedtickets.tickets(ticket_id),
  created_at TIMESTAMPTZ not null default now()
);

create index if not exists entries_idx_diagnosis on bedtickets.entries (diagnosis);