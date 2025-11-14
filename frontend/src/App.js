import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [nowPlayingLoading, setNowPlayingLoading] = useState(false);

  
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/movie`);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  
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
        throw new Error("Server error");
      }

      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error searching movies:", err);
      setSearchError("Failed to search movies. Please try again.");
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

  
  const displayMovies = showNowPlaying ? nowPlayingMovies : (searchResults || movies);
  const isTMDbResults = searchResults !== null || showNowPlaying;
  const isLocalResults = !isTMDbResults;

  if (loading && isLocalResults) return <p>Ladataan elokuvia…</p>;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <h1>Elokuvat</h1>

      {/* Search Section */}
      <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search movies…"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={{
              padding: "0.5rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: searchLoading ? "not-allowed" : "pointer",
              opacity: searchLoading ? 0.6 : 1,
            }}
          >
            {searchLoading ? "Searching…" : "Search"}
          </button>
        </div>

        <button
          onClick={handleNowPlaying}
          disabled={nowPlayingLoading}
          style={{
            padding: "0.5rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: nowPlayingLoading ? "not-allowed" : "pointer",
            opacity: nowPlayingLoading ? 0.6 : 1,
            marginRight: "0.5rem",
          }}
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
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}

        {searchError && <p style={{ color: "red", marginTop: "0.5rem" }}>{searchError}</p>}
      </div>

      {/* Results Section */}
      {isTMDbResults && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>{showNowPlaying ? "Now in Theaters" : "Search Results"}</h2>
        </div>
      )}

      {displayMovies.length === 0 ? (
        <p>{isTMDbResults ? "No movies found." : "Ei elokuvia löytynyt."}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {displayMovies.map((m) => (
            <div
              key={m.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "1rem",
                backgroundColor: "#fff",
              }}
            >
              {m.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                  alt={m.title}
                  style={{ width: "100%", height: "auto", marginBottom: "0.5rem", borderRadius: "4px" }}
                />
              )}
              <h3 style={{ marginTop: 0, fontSize: "1rem" }}>{m.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                {m.year || m.release_date ? new Date(m.release_date || m.year).getFullYear() : "N/A"}
              </p>
              {m.overview && (
                <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: 0 }}>
                  {m.overview.substring(0, 100)}...
                </p>
              )}
              {!m.overview && m.director && (
                <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: 0 }}>
                  Director: {m.director}
                </p>
              )}
              {!m.overview && m.genre && (
                <p style={{ fontSize: "0.85rem", color: "#555" }}>
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

export default App;