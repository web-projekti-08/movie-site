import { useState } from "react";
import "../App.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [nowPlayingLoading, setNowPlayingLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setSearchError("");
      setShowNowPlaying(false);
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setShowNowPlaying(false);

    try {
      const url = new URL(`${process.env.REACT_APP_API_URL}/movie/search-tmdb`);
      url.searchParams.append("q", searchTerm.trim());

      const res = await fetch(url);

      if (res.status === 400) {
        setSearchError("Please enter a valid search term");
        setSearchResults(null);
        setSearchLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Serveer error");
      }

      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error searching movies:", err);
      setSearchError("Failed to search movies.Please try again.");
      setSearchResults(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNowPlaying = async () => {
    setNowPlayingLoading(true);
    setSearchResults(null);
    setSearchError("");
    setSearchTerm("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/movie/now-playing`);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setNowPlayingMovies(data);
      setShowNowPlaying(true);
    } catch (err) {
      console.error("Error fetching now playing:", err);
      setSearchError("Failed to load now playing movies");
      setShowNowPlaying(false);
    } finally {
      setNowPlayingLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setSearchResults(null);
      setSearchError("");
      setShowNowPlaying(false);
    }
  };

  const displayMovies = showNowPlaying ? nowPlayingMovies : (searchResults || []);

  return (
    <div className="app-container">
      <h1>Elokuvat</h1>

      <div className="search-section">
        <div className="search-input-row">
          <input
            type="text"
            placeholder="Search movies…"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="btn btn-primary"
          >
            {searchLoading ? "Searching…" : "Search"}
          </button>
        </div>

        <button
          onClick={handleNowPlaying}
          disabled={nowPlayingLoading}
          className="btn btn-success"
        >
          {nowPlayingLoading ? "Loading…" : "Now in Theaters"}
        </button>

        {(searchResults !== null || showNowPlaying) && (
          <button
            onClick={() => {
              setSearchResults(null);
              setSearchTerm("");
              setSearchError("");
              setShowNowPlaying(false);
              setNowPlayingMovies([]);
            }}
            className="btn btn-secondary"
          >
            Clear
          </button>
        )}

        {searchError && <p className="error-message">{searchError}</p>}
      </div>

      {(searchResults !== null || showNowPlaying) && (
        <div className="results-heading">
          <h2>{showNowPlaying ? "Now in Theaters" : "Search Results"}</h2>
        </div>
      )}

      {displayMovies.length === 0 ? (
        <p className="no-results-message">No movies found.</p>
      ) : (
        <div className="movies-grid">
          {displayMovies.map((m) => (
            <div key={m.id} className="movie-card">
              {m.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                  alt={m.title}
                  className="movie-poster"
                />
              )}
              <h3 className="movie-title">{m.title}</h3>
              <p className="movie-year">
                {m.year || m.release_date ? new Date(m.release_date || m.year).getFullYear() : "N/A"}
              </p>
              {m.overview && (
                <p className="movie-description">
                  {m.overview.substring(0, 100)}...
                </p>
              )}
              {!m.overview && m.director && (
                <p className="movie-description">
                  Director: {m.director}
                </p>
              )}
              {!m.overview && m.genre && (
                <p className="movie-description">
                  Genre: {m.genre}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
