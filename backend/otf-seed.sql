-- Insert data into user table
INSERT INTO users (user_id, user_type, username, password, email, user_grant, created_at)
VALUES (1, 'admin', 'us3rnam3', 'pa55w0rd', 'admin1@email.com', 'edd98fe2-2fd0-46c0-9b01-31fa144e14a1', '2024-06-18 15:28:47'),
       (2, 'admin', 'nam3us3r', 'w0rdpa55', 'admin2@email.com', '2bd1e582-158e-410c-a583-2c79c903437a', '2024-06-18 16:08:17');

-- Insert data into user table
INSERT INTO users (user_id, user_type, first_name, password, email, created_at)
VALUES (3, 'member', 'First', 'pa22w0rd', 'member1@email.com', '2024-06-18 16:10:07'),
       (4, 'member', 'Second', 'pa22w0rd_2', 'member2@email.com', '2024-06-18 16:15:57'),
       (5, 'member', 'Third', 'pa22w0rd_3', 'member3@email.com', '2024-06-18 15:38:27'),
       (6, 'member', 'Fourth', 'pa22w0rd_4', 'member4@email.com', '2024-06-18 15:48:17');

-- Insert data into calendars table
INSERT INTO calendars (calendar_id, name, description, user_grant, user_id)
VALUES (1, 'Team1', 'TEAM 1 ONLY', 'edd98fe2-2fd0-46c0-9b01-31fa144e14a1', 1),
       (2, 'Team2', 'TEAM 2 ONLY', '2bd1e582-158e-410c-a583-2c79c903437a', 2);

-- Insert data into events table
INSERT INTO events (event_id, title, description, event_date, start_time, end_time, calendar_id, user_id)
VALUES (1, 'First Event', '{"condition": "Outdoor", "activities": ["corn hole", "tag"], "announcements": ["none"], "attendance": "voluntary"}', '2024-07-05', '2024-07-05 18:30:00', '2024-07-05 20:00:00', 2, 2),
       (2, 'Second Event', '{"condition": "Indoor", "activities": ["spades", "beer pong"], "announcements": ["Next to come"], "attendance": "mandatory"}', '2024-08-25', '2024-08-25 20:30:00', '2024-08-25 22:00:00', 1, 1);

-- Insert data into groupchats table
INSERT INTO groupchats (chat_group_id, group_name, created_by, created_at)
VALUES (1, 'Team1', 1, '2024-06-18 18:30:21'),
       (2, 'Team2', 2, '2024-06-18 19:30:11'),
       (3, 'Team3', 2, '2024-06-18 20:30:44');

-- Insert data into participants table
INSERT INTO participants (participant_id, chat_group_id, user_id)
VALUES (1, 1, 1),
       (2, 1, 5),
       (3, 1, 6),
       (4, 2, 2),
       (5, 2, 3),
       (6, 2, 4),
       (7, 3, 2),
       (8, 3, 4);

-- Insert data into messages table
INSERT INTO messages (message_id, chat_group_id, sender_id, message_text, timestamp)
VALUES (1, 1, 1, 'Hello everyone!', '2024-06-18 18:30:45'),
       (2, 1, 6, 'Wassup bossman!', '2024-06-18 18:31:33'),
       (3, 1, 5, 'Heyyy :)', '2024-06-18 18:32:51'),
       (4, 2, 2, 'HEY TEAM!', '2024-06-18 19:30:20'),
       (5, 2, 4, 'Hey boss! How are u??', '2024-06-18 19:31:55'),
       (6, 2, 2, 'I am good! Thanks for asking :)', '2024-06-18 19:35:21'),
       (7, 2, 4, 'Good to hear', '2024-06-18 19:37:41'),
       (8, 2, 2, 'Where is First?', '2024-06-18 19:43:15'),
       (9, 2, 3, 'I am not clocked in. No need to engage...', '2024-06-18 19:50:04'),
       (10, 2, 4, 'YYYIKKESS!!!', '2024-06-18 19:52:19'),
       (11, 3, 2, 'Okay Second, its just you and me now :(', '2024-06-18 20:31:00'),
       (12, 3, 4, 'LOL, we dont need him anyway!', '2024-06-18 20:31:45');

