create table programs (
  id serial primary key,
  name varchar(255) not null,
  description text,
  author varchar(255) not null,
  total_times integer not null,
  num_shots integer not null,
  sets integer not null,
  timeout integer not null,
  created timestamp default current_timestamp
);