import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function callTMDb(endpoint) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return response.data;
  } catch (err) {
    console.error("TMDb API error:", err.message);
    throw new Error("Failed to fetch from TMDb API");
  }
}


export async function searchTMDbMovies({ query, rating, minYear, maxYear, genre }) {
  const data = await callTMDb(`/search/movie?query=${encodeURIComponent(query)}`);

  let movies = data.results.map(m => {
    const year = m.release_date ? parseInt(m.release_date.substring(0, 4)) : null;

    return {
      id: m.id,
      title: m.title,
      release_date: m.release_date,
      year: year,
      rating: m.vote_average,
      genres: m.genre_ids,
      poster_path: m.poster_path,
    };
  });

  // apply filters after search because tmdb query with filters doesn't work on single endpoint
  if (rating != null)
    movies = movies.filter(m => m.rating != null && m.rating >= rating);

  if (minYear != null)
    movies = movies.filter(m => m.year != null && m.year >= minYear);

  if (maxYear != null)
    movies = movies.filter(m => m.year != null && m.year <= maxYear);

  if (genre != null)
    movies = movies.filter(m => m.genres && m.genres.includes(genre));

  return movies;
}

export async function getNowPlayingMovies() {
  const data = await callTMDb("/movie/now_playing");
  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    rating: movie.vote_average,
    poster_path: movie.poster_path,
  }));
}

export async function getMovieReviews(movieId) {
  const data = await callTMDb(`/movie/${movieId}/reviews`);
  return data.results.map((review) => ({
    author: review.author,
    content: review.content,
    rating: review.author_details?.rating,
    url: review.url,
  }));
}

export async function getMovieDetails(movieId) {
  const data = await callTMDb(`/movie/${movieId}`);
  return {
    id: data.id,
    title: data.title,
    release_date: data.release_date,
    overview: data.overview,
    runtime: data.runtime,
    genres: data.genres?.map(g => g.name),
    poster_path: data.poster_path,
    tagline: data.tagline,
    vote_average: data.vote_average,
    vote_count: data.vote_count
  };
}
