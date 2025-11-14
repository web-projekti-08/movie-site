import { findAllMovies, searchMovies } from "../models/movie_model.js";
import { searchTMDbMovies, getNowPlayingMovies, getMovieReviews } from "../services/tmdb_service.js";

export async function getAll(req, res, next) {
  try {
    const movies = await findAllMovies();
    res.json(movies);
  } catch (err) {
    next(err);
  }
}

export async function search(req, res, next) {
  const { q, page = 1, pageSize = 10 } = req.query;

  
  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Search query (q) is required" });
  }

  try {
    const result = await searchMovies(q.trim(), parseInt(page, 10), parseInt(pageSize, 10));
    res.json(result);
  } catch (err) {
    
    res.status(500).json({ error: "Database error occurred" });
    next(err);
  }
}


export async function searchTMDb(req, res, next) {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Search query (q) is required" });
  }

  try {
    const results = await searchTMDbMovies(q.trim());
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to search TMDb" });
    next(err);
  }
}


export async function nowPlaying(req, res, next) {
  try {
    const results = await getNowPlayingMovies();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch now playing movies" });
    next(err);
  }
}


export async function getReviews(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  try {
    const reviews = await getMovieReviews(id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
    next(err);
  }
}