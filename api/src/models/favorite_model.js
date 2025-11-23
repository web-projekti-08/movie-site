import crypto from "crypto";
import pool from "../database.js"

export async function addFavorite(userId, mediaId) {
  const result = await pool.query(`
    INSERT INTO favorite (user_id, media_id, added_at)
    VALUES ($1, $2, NOW())
    RETURNING *`,
    [userId, mediaId]);
  return result.rows[0];
}

export async function getUserFavorite(userId, favoriteId) {
  const result = await pool.query(`
    SELECT * FROM favorite
    WHERE user_id = $1 AND favorite_id = $2`,
    [userId, favoriteId]
  );
  return result.rows[0];
}

export async function getUserFavorites(userId) {
  const result = await pool.query(`
    SELECT * FROM favorite
    WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function removeUserFavorite(userId, favoriteId) {
  const result = await pool.query(`
    DELETE FROM favorite
    WHERE user_id = $1 AND favorite_id = $2
    RETURNING *`,
    [userId, favoriteId]
  );
  return result.rows[0] || null;
}

// SHARE
export async function createShareId(userId) {
  const existing = await pool.query(`
    SELECT share_id FROM users
    WHERE user_id = $1`,
    [userId]
  );

  if (existing.rows[0].share_id) {
    return existing.rows[0].share_id;
  }

  const newShareId = crypto.randomBytes(8).toString("hex");

  await pool.query(`
    UPDATE users SET share_id = $1
    WHERE user_id = $2`,
    [newShareId, userId]
  );
  return newShareId;
}

export async function getSharedFavorites(shareId) {
  const result = await pool.query(`
    SELECT u.email, f.media_id, f.added_at
    FROM users u
    JOIN favorite f ON u.user_id = f.user_id
    WHERE u.share_id = $1`,
    [shareId]
  );

  return result.rows;
}