import pool from "../database.js";

export async function findAllMovies() {
  const { rows } = await pool.query("SELECT * FROM movies ORDER BY id");
  return rows;
}