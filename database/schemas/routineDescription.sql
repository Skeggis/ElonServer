create table routine_description(
  id serial primary key,
  shot_type integer references shot_types(id),
  timeout integer not null,
  routine_id integer references routines(id)
  created timestamp default current_timestamp
);