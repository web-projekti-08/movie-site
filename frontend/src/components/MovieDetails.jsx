export default function MovieDetails({ movie }) {
  return (
    <div>
      <div>
        {movie.poster_path ? (
        <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.title} />
        ) : (
          <div>No poster available</div>
        )}
        <div>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <strong>Rating</strong>
          <p>{movie.vote_average} / 10 ({movie.vote_count} votes)</p>
          {movie.genres && movie.genres.length > 0 && (
            <>
              <strong>Genres</strong>
              <p>{movie.genres.join(", ")}</p>
            </>
          )}
          {movie.release_date && (
            <>
              <strong>Release Date</strong>
              <p>{movie.release_date}</p>
            </>
          )}
          {movie.runtime && (
            <>
              <strong>Runtime</strong>
              <p>{movie.runtime} minutes</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}