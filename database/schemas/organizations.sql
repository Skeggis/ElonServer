create table organizations (
  id serial primary key,
  name varchar(255) not null,
  created timestamp default current_timestamp
);