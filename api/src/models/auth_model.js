import pool from "../database.js";
import bcrypt from "bcrypt";

export async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

export async function findUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

export async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at";
  const result = await pool.query(query, [email, hashedPassword]);
  return result.rows[0];
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export async function deleteUserById(userId) {
  const query = "DELETE FROM users WHERE id = $1";
  await pool.query(query, [userId]);
}
