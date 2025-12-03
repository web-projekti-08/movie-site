/*
  This file holds:
  - Group creation and deletion
  - Group member management
  - Group request management
*/

import pool from "../database.js"

// GROUP
export async function createGroup(userId, groupName, description) {
  const result = await pool.query(`
    INSERT INTO groups (group_name, description, created_at, owner_id) 
    VALUES ($1, $2, NOW(), $3)
    RETURNING group_id`,
    [groupName, description, userId]
  );

  const groupId = result.rows[0].group_id;
  await pool.query(`
    INSERT INTO group_members (group_id, user_id, role, joined_at)
    VALUES ($1, $2, 'owner', NOW())`,
    [groupId, userId]
  );

  return result.rows[0];
}

export async function getGroups() {
  const result = await pool.query(`SELECT * FROM groups`);
  return result.rows;
}

export async function getGroup(groupId) {
  const result = await pool.query(`
    SELECT * FROM groups 
    WHERE group_id = $1`, [groupId]);
  return result.rows[0];
}

export async function getUserGroups(userId) {
  const result = await pool.query(`
    SELECT g.group_id, g.group_name, g.description
    FROM groups g
    JOIN group_members gm ON g.group_id = gm.group_id
    WHERE gm.user_id = $1
  `, [userId]);

  return result.rows;
}

export async function deleteGroup(groupId) {
  const result = await pool.query(`DELETE FROM groups WHERE group_id = $1`, [groupId]);
  await pool.query('DELETE FROM group_members WHERE group_id = $1', [groupId]);
  return result.rows;
}

// GROUP MEMBER
export async function getGroupMembers(groupId) {
  const result = await pool.query(`
    SELECT user_id, role
    FROM group_members
    WHERE group_id = $1
    AND (role = 'owner' OR role = 'member')`, 
    [groupId]
  );

  return result.rows;
}

export async function isOwner(groupId, userId) {
  const result = await pool.query(`
    SELECT owner_id FROM groups
    WHERE group_id = $1 AND owner_id = $2`, [groupId, userId]);
  return result.rows;
}

export async function isMember(groupId, userId) {
  const result = await pool.query(`
    SELECT user_id FROM group_members
    WHERE role = 'member'
    AND group_id = $1 AND user_id = $2`, [groupId, userId]);
  return result.rows;
}

export async function removeMember(groupId, userId) {
  const result = await pool.query(`
    DELETE FROM group_members
    WHERE group_id = $1 AND user_id = $2
    RETURNING *`, [groupId, userId]);
  return result.rows[0];
}

// REQUESTS
export async function createJoinRequest(groupId, userId) {
  const result = await pool.query(`
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, 'requested') RETURNING *`,
    [groupId, userId]
  );

  return result.rows[0];
}

export async function getJoinRequests(groupId) {
  const result = await pool.query(`
    SELECT * FROM group_members WHERE group_id = $1
    AND role = 'requested'`, [groupId]);
  return result.rows;
}

export async function acceptJoinRequest(groupId, userId) {
  const result = await pool.query(`
    UPDATE group_members 
    SET role = 'member', joined_at = NOW()
    WHERE group_id = $1 AND user_id = $2 AND role = 'requested'
    RETURNING *`, [groupId, userId]);
  return result.rows[0];
}

export async function rejectJoinRequest(groupId, userId) {
  const result = await pool.query(`
    DELETE FROM group_members
    WHERE group_id = $1 AND user_id = $2
    RETURNING *`, [groupId, userId]);
  return result.rows[0] || null;
}

// ADD CONTENT
export async function addMovieToGroup(groupId, mediaId) {
  const result = await pool.query(`
    INSERT INTO group_content (group_id, media_id)
    VALUES ($1, $2)
    RETURNING *`,
    [groupId, mediaId]
  );
  return result.rows[0];
}