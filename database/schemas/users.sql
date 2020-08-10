create table users (
  id serial,
  uuid uuid primary key not null ,
  organization_id integer references organizations(id),
  name varchar(255),
  email varchar(255) not null,
  password varchar(255),
  google_id varchar(255),
  photo_url varchar(255),
  created timestamp default current_timestamp
);