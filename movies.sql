DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS favorite CASCADE;
DROP TABLE IF EXISTS member_role CASCADE;
DROP TABLE IF EXISTS group_content CASCADE;
DROP TABLE IF EXISTS group_chat CASCADE;

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

-- TEST DATA
INSERT INTO
  users (email, password)
VALUES
  ('alice@example.com', 'password123'),
  ('bob@example.com', 'hunter2'),
  ('charlie@example.com', 'qwerty'),
  ('diana@example.com', 'passw0rd');

INSERT INTO
  groups (group_name, description, owner_id)
VALUES
  (
    'Movie Maniacs',
    'A group for people obsessed with movies',
    1
  ),
  (
    'Sci-Fi Sundays',
    'We watch sci-fi movies every weekend',
    2
  ),
  (
    'Indie Lovers',
    'For fans of indie and arthouse cinema',
    3
  );

INSERT INTO
  group_members (group_id, user_id, role)
VALUES
  (1, 1, 'owner'),
  (1, 2, 'member'),
  (1, 3, 'requested'),
  (2, 2, 'owner'),
  (2, 4, 'member'),
  (3, 3, 'owner'),
  (3, 1, 'member'),
  (3, 4, 'requested');

INSERT INTO
  review (
    media_id,
    user_id,
    review_text,
    rating,
    posted_at
  )
VALUES
  (603, 1, 'Test review', 5, NOW());