import { 
  searchTMDbMovies,
  getNowPlayingMovies,
  getMovieReviews,
  getMovieDetails
} from "../services/tmdb_service.js";

export async function searchMovies(req, res) {
  try {
    const {
      query,
      rating,
      minYear,
      maxYear,
      genre
    } = req.query;

    const results = await searchTMDbMovies({
      query: query ? query.trim() : null,
      rating: rating ? Number(rating) : null,
      minYear: minYear ? Number(minYear) : null,
      maxYear: maxYear ? Number(maxYear) : null,
      genre: genre ? Number(genre) : null,
    });

    res.json({ results });
    
  } catch (err) {
    console.error("searchMovies error:", err?.message || err);
    res.status(500).json({ error: "internal server error" });
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

export async function getMovie(req, res, next) {
  if (!req.params.movieId) {
    return res.status(400).json({ error: "Movie ID required" });
  }

  try {
    const details = await getMovieDetails(req.params.movieId);
    res.json({ details });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie details "});
    next(err);
  }
}