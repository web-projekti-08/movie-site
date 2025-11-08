import { findAllMovies } from "../models/movie_model.js";

export async function getAll(req, res, next) {
  try {
    const movies = await findAllMovies();
    res.json(movies);
  } catch (err) {
    next(err);
  }
}