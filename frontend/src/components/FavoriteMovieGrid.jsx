import MovieCard from "./MovieCard";

export default function FavoriteMovieGrid({ favorites, onRemove }) {
  if (!favorites.length) {
    return <p className="empty-state">No favorites yet.</p>;
  }

  return (
    <div className="favorites-grid">
      {favorites.map((fav) => (
        <div key={fav.favorite_id} className="favorite-item">
          <div className="favorite-card">
  <MovieCard movie={fav.movie} />
</div>


          {onRemove && (
            <button
              className="btn btn-sm btn-danger mt-2"
              onClick={() => onRemove(fav.favorite_id)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
  
}
