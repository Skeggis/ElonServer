insert into shot_locations(name) VALUES ('Far left') , ('Far center') , ('Far right'), ('Middle left'), ('Middle center'), ('Middle right'), ('Front left'), ('Front center'), ('Front right');

insert into shot_types (name) VALUES ('Smash'), ('Lift'), ('Netshot'), ('Flat');

insert into shots (horizontal, vertical, power, shot_type_id, shot_location_id) VALUES
(100, 100, 100, 1, 4), (100, 100, 100, 1, 5), (100, 100, 100, 1, 6),
(100, 100, 100, 2, 1), (100, 100, 100, 2, 2), (100, 100, 100, 2, 3),
(100, 100, 100, 3, 7), (100, 100, 100, 3, 8), (100, 100, 100, 3, 9),
(100, 100, 100, 4, 4), (100, 100, 100, 4, 5), (100, 100, 100, 4, 6);      

insert into programs(name, description, author, total_time, num_shots, sets, set_timeout) 
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

insert into routines (rounds, round_timeout, ordering, program_id) values
(3, 5, 1, 1), (10, 3, 2, 1), (20, 4, 3, 1);

insert into routine_descriptions (shot_id, shot_timeout, routine_id, ordering) values
(1, 2, 1, 1), (2, 1, 1, 2), (3, 1, 1, 3), (4, 1, 1, 4), (5, 1, 1, 5), (6, 1, 1, 6), (7, 1, 1, 7), (8, 1, 1, 8), (9, 1, 1, 9), (10, 1, 1, 10), (11, 1, 1, 11), (12, 1, 1, 12),
(1, 5, 2, 1),
(1, 1, 3, 1), (7, 3, 3, 2), (4, 1, 3, 3);