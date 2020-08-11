create table organizations (
  id serial primary key,
  name varchar(255) not null,
  owner_id uuid not null,
  image_url varchar(255),
  nr_of_members integer not null default 0,
  created timestamp default current_timestamp
);