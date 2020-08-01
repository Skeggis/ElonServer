create table users (
  id serial primary key,
  uuid uuid not null,
  organization_id integer references organizations(id),
  name varchar(255),
  email varchar(255) not null,
  password varchar(255) not null,
  created timestamp default current_timestamp
);