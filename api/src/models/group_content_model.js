import pool from "../database.js"

export async function addContent(groupId, mediaId) {
  const result = await pool.query(`
    INSERT INTO group_content (group_id, media_id)
    VALUES ($1, $2)
    RETURNING *`,
    [groupId, mediaId]);
  return result.rows[0];
}

export async function getContentById(groupId, contentId) {
  const result = await pool.query(`
    SELECT * FROM group_content
    WHERE group_id = $1 AND  content_id = $2`,
    [groupId, contentId]);
  return result.rows;
}

export async function getAllContent(groupId) {
  const result = await pool.query(`
    SELECT * FROM group_content
    WHERE group_id = $1`,
    [groupId]);
  return result.rows;
}

export async function removeContent(groupId, contentId) {
  const result = await pool.query(`
    DELETE FROM group_content
    WHERE group_id = $1 AND content_id = $2
    RETURNING *`,
    [groupId, contentId]);
  return result.rows[0];
}