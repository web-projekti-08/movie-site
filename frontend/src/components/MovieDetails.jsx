export default function MovieDetails({ movie }) {
  return (
    <div>
      <div>
        <h2 className="movie-details-title">{movie.title}</h2>
        <div className="movie-details-poster">
          {movie.poster_path ? (
          <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.title} />
          ) : (
            <div>No poster available</div>
          )}
        </div>
        <div>
          <p>{movie.overview}</p>
          <strong>Rating</strong>
          <p>{Math.round(movie.vote_average * 10)/10} / 10 ({movie.vote_count} votes)</p>
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