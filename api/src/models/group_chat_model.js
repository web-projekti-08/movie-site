import pool from "../database.js"

export async function createPost(groupId, userId, text) {
  const result = await pool.query(`
    INSERT INTO group_chat (group_id, user_id, post_text, post_date)
    VALUES ($1, $2, $3, NOW())
    RETURNING *`,
    [groupId, userId, text]
  );
  return result.rows[0];
};

export async function getPosts(groupId) {
  const result = await pool.query(`
    SELECT * FROM group_chat WHERE group_id = $1`, [groupId]
  );
  return result.rows;
};

export async function getUserPosts(groupId, userId) {
  const result = await pool.query(`
    SELECT * FROM group_chat WHERE group_id = $1
    AND user_id = $2`, [groupId, userId]
  );
  return result.rows;
};

export async function deletePost(groupId, postId) {
  const result = await pool.query(`
    DELETE FROM group_chat WHERE group_id = $1
    AND post_id = $2
    RETURNING *`, [groupId, postId]
  );
  return result.rows[0];
};

export async function deleteUserPosts(groupId, userId) {
  const result = await pool.query(`
    DELETE FROM group_chat WHERE group_id = $1
    AND user_id = $2
    RETURNING *`, [groupId, userId]
  );
  return result.rows;
};