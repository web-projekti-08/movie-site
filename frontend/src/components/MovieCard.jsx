/*
  ELOKUVA KORTTI KOMPONENTTI, JOKA NÄYTTÄÄ ELOKUVAN TIETOA PIENEMMÄSSÄ KOOSSA
*/

export default function MovieCard({ movie }) {
  if (!movie) {
    return (
      <div className="movie-card">
        <p>Movie data unavailable</p>
      </div>
    );
  }

  return (
    <div className="movie-card">
      {/* POSTER */}
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          style={{ width: "100%", borderRadius: "4px" }}
        />
      ) : (
        <div style={{ width: "100%", height: "300px", backgroundColor: "#ccc" }}>
          No poster
        </div>
      )}
      {/* TIEDOT */}
      <h5>{movie.title}</h5>
      {movie.release_date && <p>{movie.release_date}</p>}
    </div>
  );
}
