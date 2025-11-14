import pool from "../database.js"

export async function addMedia(groupId, mediaId) {
  const result = await pool.query(`
    INSERT INTO group_content (group_id, media_id)
    VALUES ($1, $2)
    RETURNING *`,
    [groupId, mediaId]);
  return result.rows[0];
}

export async function getMediaById(groupId, mediaId) {
  const result = await pool.query(`
    SELECT * FROM group_content
    WHERE group_id = $1 AND  media_id = $2`,
    [groupId, mediaId]);
  return result.rows;
}

export async function getAllMedia(groupId) {
  const result = await pool.query(`
    SELECT * FROM group_content
    WHERE group_id = $1`,
    [groupId]);
  return result.rows;
}

export async function removeMedia(groupId, contentId) {
  const result = await pool.query(`
    DELETE FROM group_content
    WHERE group_id = $1 AND content_id = $2
    RETURNING *`,
    [groupId, contentId]);
  return result.rows[0];
}