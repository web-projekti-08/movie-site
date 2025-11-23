import pool from "../database.js"

export async function createReview(mediaId, userId, text, rating) {
  const result = await pool.query(`
    INSERT INTO review (media_id, user_id, review_text, rating, posted_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING review_id`,
    [mediaId, userId, text, rating]
  );
  return result.rows[0];
}

export async function getReview(reviewId) {
  const result = await pool.query(`
    SELECT * FROM review
    WHERE review_id = $1`,
    [reviewId]
  );
  return result.rows[0];
}

export async function getReviewByMediaId(mediaId) {
  const result = await pool.query(`
    SELECT * FROM review
    WHERE media_id = $1`,
    [mediaId]
  );
  return result.rows[0];
}

export async function getReviewsByUserId(userId) {
  const result = await pool.query(`
    SELECT * FROM review
    WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function getAllReviews() {
  const result = await pool.query(`SELECT * FROM review`);
  return result.rows;
}

export async function editReview(reviewId, text, rating) {
  const result = await pool.query(`
    UPDATE review
    SET review_text = $1, rating = $2
    WHERE review_id = $3
    RETURNING *`,
    [text, rating, reviewId]
  );
  return result.rows[0];
}

export async function deleteReview(reviewId) {
  const result = await pool.query(`
    DELETE FROM review
    WHERE review_id = $1
    RETURNING *`,
    [reviewId]
  );
  return result.rows[0];
}

export async function deleteUserReviews(userId) {
  const result = await pool.query(`
    DELETE FROM review
    WHERE user_id = $1
    RETURNING *`,
    [userId]
  );
  return result.rows[0] || null;
}