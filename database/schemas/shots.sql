create table shots (
  id serial primary key,
  shot_location_id integer references shot_locations(id),
  shot_type_id integer references shot_types(id),
  horizontal integer not null,
  vertical integer not null,
  power integer not null,
  created timestamp default current_timestamp
);