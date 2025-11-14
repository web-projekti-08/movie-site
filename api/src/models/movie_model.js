import pool from "../database.js";

export async function findAllMovies() {
  const { rows } = await pool.query("SELECT * FROM movies ORDER BY id");
  return rows;
}

export async function searchMovies(q, page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  const searchTerm = `%${q}%`;

  // Parameterized query to prevent SQL injection
  const countQuery = `
    SELECT COUNT(*) as total FROM movies
    WHERE title ILIKE $1 OR director ILIKE $1
  `;

  const dataQuery = `
    SELECT id, title, year, director, genre, rating FROM movies
    WHERE title ILIKE $1 OR director ILIKE $1
    ORDER BY title
    LIMIT $2 OFFSET $3
  `;

  const countResult = await pool.query(countQuery, [searchTerm]);
  const total = parseInt(countResult.rows[0].total, 10);

  const dataResult = await pool.query(dataQuery, [searchTerm, pageSize, offset]);
  const data = dataResult.rows;

  return { data, total, page, pageSize };
}