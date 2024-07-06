CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('admin', 'member')),
  username VARCHAR(25),
  first_name TEXT,
  password TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  user_grant TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE calendars (
  calendar_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_grant TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description JSONB NOT NULL,
  event_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  calendar_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (calendar_id) REFERENCES calendars(calendar_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE groupchats (
  chat_group_id SERIAL PRIMARY KEY,
  group_name VARCHAR(25) NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE participants (
  participant_id SERIAL PRIMARY KEY,
  chat_group_id INTEGER NOT NULL REFERENCES groupchats(chat_group_id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  chat_group_id INTEGER NOT NULL REFERENCES groupchats(chat_group_id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL,
  message_text TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
);