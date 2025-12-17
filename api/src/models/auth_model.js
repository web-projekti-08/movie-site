import pool from "../database.js";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function addOne(email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id AS \"userId\", email",
    [email, hashedPassword]
  );

  return result.rows[0];
}

export async function getAll() {
  const result = await pool.query("SELECT email FROM users");
  return result.rows;
}


export async function authenticateUser(email, password) {
  const result = await pool.query(
    "SELECT user_id, email, password FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password);

  if (isValid) {
    return { userId: user.user_id, email: user.email };
  }

  return null;
}



export async function saveRefreshToken(email, refreshToken) {
  const result = await pool.query(
    "UPDATE users SET refresh_token = $1 WHERE email = $2 RETURNING email",
    [refreshToken, email]
  );

  return result.rows[0];
}

// Hae käyttäjä refresh tokenilla
export async function getUserByRefreshToken(refreshToken) {
  const result = await pool.query(
    "SELECT user_id, email FROM users WHERE refresh_token = $1",
    [refreshToken]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

// Hae käyttäjän ryhmät
export async function getUserGroups(userId) {
  const result = await pool.query(
    `SELECT g.group_id, g.group_name, gm.role
     FROM groups g
     JOIN group_members gm ON g.group_id = gm.group_id
     WHERE gm.user_id = $1`,
    [userId]
  );

  return result.rows; // [{ group_id, group_name, role }, ...]
}


export async function clearRefreshToken(email) {
  const result = await pool.query(
    "UPDATE users SET refresh_token = NULL WHERE email = $1 RETURNING email",
    [email]
  );

  return result.rows[0];
}

export async function deleteUser(userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM group_members WHERE user_id = $1", [userId]);

    await client.query("DELETE FROM review WHERE user_id = $1", [userId]);

    await client.query("DELETE FROM favorite WHERE user_id = $1", [userId]);

    await client.query("DELETE FROM groups WHERE owner_id = $1", [userId]);


    const result = await client.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id, email",
      [userId]
    );


    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
  
}