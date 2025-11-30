export default function MovieDetails({ movie }) {
  return (
    <div>
      <h2>{movie.title}</h2>
      {movie.poster_path && (
        <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} />
      )}
      <p>{movie.overview}</p>
      <p>Rating: {movie.vote_average}</p>
      <p>Votes: {movie.vote_count}</p>
      <p>Genres: {movie.genres?.join(", ")}</p>
      <p>Release: {movie.release_date}</p>
      <p>Runtime: {movie.runtime} minutes</p>
    </div>
  );
}