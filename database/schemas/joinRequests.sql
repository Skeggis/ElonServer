create table join_requests (
  id serial primary key,
  user_uuid uuid REFERENCES users(uuid),
  organization_id integer references organizations(id),
  created timestamp default current_timestamp
);