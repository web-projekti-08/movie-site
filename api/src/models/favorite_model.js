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