create table routine_descriptions(
  id serial primary key,
  shot_id integer references shots(id),
  shot_timeout integer not null,
  routine_id integer references routines(id),
  ordering integer not null,
  created timestamp default current_timestamp
);