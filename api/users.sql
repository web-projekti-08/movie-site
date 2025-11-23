CREATE TABLE IF NOT EXISTS auth_users (
  username VARCHAR(50) PRIMARY KEY,
  password VARCHAR(60),
  refresh_token TEXT
);