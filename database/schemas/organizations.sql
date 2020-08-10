create table organizations (
  id serial primary key,
  name varchar(255) not null,
  owner_id uuid REFERENCES users(uuid) not null,
  image_url varchar(255),
  created timestamp default current_timestamp
);