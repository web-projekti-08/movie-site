import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Ladataan elokuvia…</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Minun Elokuvat tietokannassa</h1>
      {movies.length === 0 ? (
        <p>Ei elokuvia löytynyt.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>Director</th>
              <th>Genre</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id}>
                <td>{m.title}</td>
                <td>{m.year}</td>
                <td>{m.director}</td>
                <td>{m.genre}</td>
                <td>{m.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;