

import pool from "../database.js";

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function addOne(username, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query(
    "INSERT INTO auth_users (username, password) VALUES ($1, $2) RETURNING username",
    [username, hashedPassword]
  );

  return result.rows[0];
}

export async function getAll() {
  const result = await pool.query("SELECT username FROM auth_users");
  return result.rows;
}


export async function authenticateUser(username, password) {
  const result = await pool.query(
    "SELECT username, password FROM auth_users WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0) {
    return null;
  }


  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password);

  if (isValid) {
    return { username: user.username };
  }

  return null;
}



export async function saveRefreshToken(username, refreshToken) {
  const result = await pool.query(
    "UPDATE auth_users SET refresh_token = $1 WHERE username = $2 RETURNING username",
    [refreshToken, username]
  );

  return result.rows[0];
}


export async function getUserByRefreshToken(refreshToken) {
  const result = await pool.query(
    "SELECT username FROM auth_users WHERE refresh_token = $1",
    [refreshToken]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}


export async function clearRefreshToken(username) {
  const result = await pool.query(
    "UPDATE auth_users SET refresh_token = NULL WHERE username = $1 RETURNING username",
    [username]
  );

  return result.rows[0];
}

export async function deleteUser(username) {
  const result = await pool.query(
    "DELETE FROM auth_users WHERE username = $1 RETURNING username",
    [username]
  );

  return result.rows[0];
}

