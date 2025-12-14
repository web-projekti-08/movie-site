import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authFetch } from "../services/authFetch";
import { fetchMovieDetails } from "../services/movieService";
import FavoriteMovieGrid from "../components/FavoriteMovieGrid";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout, deleteAccount } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState("favorites");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();

  }, []);

  async function loadProfileData() {
    setLoading(true);
    try {
      const [favRes, revRes] = await Promise.all([
        authFetch("/favorite"),
        authFetch("/review/user"),
      ]);

      const favData = await favRes.json();
      const revData = await revRes.json();

      const favWithMovies = await Promise.all(
        favData.map(async (fav) => {
          const movie = await fetchMovieDetails(fav.media_id);
          return { ...fav, movie: movie.details || movie };
        })
      );

      setFavorites(favWithMovies);
      const reviewsWithMovies = await Promise.all(
  revData.map(async (r) => {
    const movieData = await fetchMovieDetails(r.media_id);
    const movie = movieData.details || movieData;

    return {
      ...r,
      movieTitle: movie.title
    };
  })
);

setReviews(reviewsWithMovies);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(id) {
    await authFetch(`/favorite/${id}`, { method: "DELETE" });
    setFavorites((prev) => prev.filter((f) => f.favorite_id !== id));
  }

  async function handleDeleteReview(id) {
    await authFetch(`/review/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.review_id !== id));
  }

  if (loading) return <p>Loading profile…</p>;

  return (
    <div className="profile-container">
      <h2>{user.email}</h2>
      <p>
        {favorites.length} favorites · {reviews.length} reviews
      </p>

      <div className="profile-tabs">
        <button onClick={() => setTab("favorites")} className={tab === "favorites" ? "active" : ""}>
          Favorites
        </button>
        <button onClick={() => setTab("reviews")} className={tab === "reviews" ? "active" : ""}>
          Reviews
        </button>
        <button onClick={() => setTab("settings")} className={tab === "settings" ? "active" : ""}>
          Settings
        </button>
      </div>

      {tab === "favorites" && (
        <FavoriteMovieGrid
          favorites={favorites}
          onRemove={handleRemoveFavorite}
        />
      )}

      {tab === "reviews" && (
        <div>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((r) => (
  <div key={r.review_id} className="review-card">
    <h4 className="review-movie-title">
      {r.movieTitle}
    </h4>

    <p>⭐ {r.rating}/5</p>
    <p>{r.review_text}</p>

    <button onClick={() => handleDeleteReview(r.review_id)}>
      Delete
    </button>
  </div>
))}

        </div>
      )}

      {tab === "settings" && (
        <div>
          <button onClick={logout}>Logout</button>
          <button onClick={deleteAccount} className="btn-danger">
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
}
