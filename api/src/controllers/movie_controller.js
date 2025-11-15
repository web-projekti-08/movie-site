import { searchTMDbMovies, getNowPlayingMovies, getMovieReviews } from "../services/tmdb_service.js";

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