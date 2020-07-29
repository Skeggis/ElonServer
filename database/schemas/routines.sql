create table routines (
  id serial primary key,
  rounds integer not null,
  round_timeout integer not null,
  ordering integer not null,
  program_id integer references programs(id),
  created timestamp default current_timestamp
);