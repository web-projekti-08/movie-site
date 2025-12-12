CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  share_id TEXT UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  refresh_token TEXT
);
CREATE TABLE groups (
  group_id SERIAL PRIMARY KEY,
  group_name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  owner_id INT REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TYPE member_role AS ENUM ('member', 'owner', 'requested');

CREATE TABLE group_members (
  group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  role member_role NOT NULL,
  joined_at TIMESTAMP,
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE group_content (
  content_id SERIAL PRIMARY KEY,
  group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
  media_id INT NOT NULL
);

CREATE TABLE review (
  review_id SERIAL PRIMARY KEY,
  media_id INT NOT NULL,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  review_text TEXT,
  rating INT,
  posted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorite (
  favorite_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  media_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT NOW()
);