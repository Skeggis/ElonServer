create table shot_types (
  id serial primary key,
  shot_location_id integer references shot_locations(id),
  name varchar(255) not null,
  horizontal integer not null,
  vertical integer not null,
  power integer not null,
  created timestamp default current_timestamp
);