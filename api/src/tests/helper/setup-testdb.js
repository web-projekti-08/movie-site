import pool from "../../database.js";

export async function setupTestDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      share_id TEXT UNIQUE,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      refresh_token TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS groups (
      group_id SERIAL PRIMARY KEY,
      group_name VARCHAR(50) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      owner_id INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_role') THEN
        CREATE TYPE member_role AS ENUM ('member', 'owner', 'requested');
      END IF;
    END$$;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_members (
      group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      role member_role NOT NULL,
      joined_at TIMESTAMP,
      PRIMARY KEY (group_id, user_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS group_content (
      content_id SERIAL PRIMARY KEY,
      group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
      media_id INT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS review (
      review_id SERIAL PRIMARY KEY,
      media_id INT NOT NULL,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      review_text TEXT,
      rating INT,
      posted_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorite (
      favorite_id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      media_id INT NOT NULL,
      added_at TIMESTAMP DEFAULT NOW()
    )
  `);
}
