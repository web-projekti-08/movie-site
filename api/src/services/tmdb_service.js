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


export async function searchTMDbMovies(query) {
  const data = await callTMDb(`/search/movie?query=${encodeURIComponent(query)}`);
  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    overview: movie.overview,
    poster_path: movie.poster_path,
  }));
}

export async function getNowPlayingMovies() {
  const data = await callTMDb("/movie/now_playing");
  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    overview: movie.overview,
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
