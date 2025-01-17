create table programs (
  id serial primary key,
  name varchar(255) not null,
  description text,
  author varchar(255) not null,
  total_time integer not null,
  num_shots integer not null,
  sets integer not null,
  set_timeout integer not null,
  created timestamp default current_timestamp
);