insert into shot_locations(image) VALUES ('image here');

insert into shot_types (name, horizontal, vertical, power, shot_location_id) values ('Test', 20, 20, 100, 1);


insert into programs(name, description, author, total_time, num_shots, sets, timeout) 
values 
(
  'First program',
  'This is the very first program (and not with accurate total time or shot count)',
  'Róbert',
  100,
  1000,
  5,
  60
);

insert into routines (rounds, timeout, ordering, program_id) values
(3, 5, 1, 1), (10, 3, 2, 1), (20, 4, 3, 1);

insert into routine_descriptions (shot_type, timeout, routine_id, ordering) values
(1, 2, 1, 1), (1, 1, 1, 2),
(1, 5, 2, 1),
(1, 1, 3, 1), (1, 3, 3, 2), (1, 1, 3, 3);