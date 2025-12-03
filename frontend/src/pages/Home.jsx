import { useEffect, useState } from "react";
import "../App.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [rating, setRating] = useState("");

  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [nowPlaying, setNowPlaying] = useState([]);
  const [nowPlayingLoading, setNowPlayingLoading] = useState(true);
  const [nowPlayingError, setNowPlayingError] = useState("");

  const API_BASE = process.env.REACT_APP_API_URL || "";

  // Fetch now playing movies
  useEffect(() => {
    let cancelled = false;
    async function loadNowPlaying() {
      setNowPlayingLoading(true);
      try {
        const res = await fetch(`${API_BASE}/movie/now-playing`);
        if (!res.ok) throw new Error("Failed to load now playing");

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results ? data.results : [];

        if (!cancelled) setNowPlaying(list);
      } catch (err) {
        console.error("Now playing error:", err);
        if (!cancelled) setNowPlayingError("Failed to load now playing movies");
      } finally {
        if (!cancelled) setNowPlayingLoading(false);
      }
    }
    loadNowPlaying();
    return () => { cancelled = true; };
  }, [API_BASE]);

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchError("Please enter a search term.");
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setSearchResults(null);

    try {
      const url = new URL(`${API_BASE}/movie/search`);
      url.searchParams.append("query", searchTerm.trim());

      // Filters
      if (genre) url.searchParams.append("genre", genre);
      if (minYear) url.searchParams.append("minYear", minYear);
      if (maxYear) url.searchParams.append("maxYear", maxYear);
      if (rating) url.searchParams.append("rating", rating);

      const res = await fetch(url);
      if (!res.ok) throw new Error("Server error");

      const payload = await res.json();
      setSearchResults(payload.results ?? []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Failed to search movies. Please try again.");
      setSearchResults(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setGenre("");
    setMinYear("");
    setMaxYear("");
    setRating("");
    setSearchResults(null);
    setSearchError("");
  };

  // Display search results if any, otherwise now playing
  const display = searchResults !== null ? searchResults : nowPlaying;

  // Helper function for showing movie ratings
  const getMovieRating = (m) => m.vote_average ?? m.rating ?? "—";

  return (
    <div className="app-container">
      <h1>Movies</h1>

      {/* Search */}
      <div className="search-section">
        <div className="search-input-row">
          <input
            type="text"
            placeholder="Search movies…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="search-input"
          />
          <button onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? "Searching…" : "Search"}
          </button>
          <button onClick={handleClear}>Clear</button>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Genre</option>
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="16">Animation</option>
            <option value="35">Comedy</option>
            <option value="18">Drama</option>
            <option value="27">Horror</option>
            <option value="878">Sci-Fi</option>
          </select>

          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">Rating</option>
            <option value="9">9+</option>
            <option value="8">8+</option>
            <option value="7">7+</option>
            <option value="6">6+</option>
            <option value="5">5+</option>
          </select>

          <select value={minYear} onChange={(e) => setMinYear(e.target.value)}>
            <option value="">Min Year</option>
            {Array.from({ length: 60 }, (_, i) => 2025 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select value={maxYear} onChange={(e) => setMaxYear(e.target.value)}>
            <option value="">Max Year</option>
            {Array.from({ length: 60 }, (_, i) => 2025 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {searchError && <p className="error-message">{searchError}</p>}
      </div>

      {/* Results heading */}
      <h2>{searchResults !== null ? "Search Results" : "Now Playing"}</h2>

      {/* Movie grid */}
      <div className="movies-grid">
        {display.map((m) => (
          <div
            key={m.id}
            className="movie-card"
            style={{ cursor: "pointer" }}
            onClick={() => window.location.href = `/movie/${m.id}`}
          >
            {m.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                alt={m.title}
              />
            )}
            <h3>{m.title}</h3>
            <p>{m.release_date ? new Date(m.release_date).getFullYear() : "N/A"}</p>
            <p>⭐ {getMovieRating(m)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
