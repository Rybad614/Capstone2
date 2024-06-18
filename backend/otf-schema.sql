CREATE TABLE admin (
  admin_id SERIAL PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  created_at DATETIME NOT NULL
);

CREATE TABLE members (
  member_id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  admin_id INTEGER REFERENCES admin ON DELETE CASCADE
);

CREATE TABLE calendar (
  event_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  user_id TEXT REFERENCES (admin (email), members(email)) ON DELETE CASCADE
);

CREATE TABLE groupchats (
  chat_group_id SERIAL PRIMARY KEY,
  group_name VARCHAR(25) NOT NULL,
  created_at DATETIME NOT NULL
);

CREATE TABLE participants (
  participant_id SERIAL PRIMARY KEY,
  chat_group_id REFERENCES groupchats ON DELETE CASCADE,
  user_id TEXT REFERENCES (admin (email), members(email)) ON DELETE CASCADE,
  user_type ENUM('admin', 'member') DEFAULT 'member' 
);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  chat_group_id REFERENCES groupchats ON DELETE CASCADE,
  sender_id TEXT REFERENCES (admin (email), members(email)) ON DELETE CASCADE,
  sender_type ENUM('admin', 'member') DEFAULT 'member',
  message_text TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL
);