create table shot_types (
  id serial primary key,
  name varchar(255) not null,
  horizontal integer not null,
  vertical integer not null,
  power integer not null,
  created timestamp default current_timestamp
);