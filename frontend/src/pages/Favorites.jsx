import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../services/authFetch";
import { fetchMovieDetails } from "../services/movieService";
import FavoriteMovieGrid from "../components/FavoriteMovieGrid";
import { useAuth } from "../context/AuthContext";
import "./Favorites.css";

export default function Favorites() {
  const { shareId } = useParams();
  const { user, accessToken } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [sharedEmail, setSharedEmail] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSharedView = Boolean(shareId);

  // ✅ DEFINE FUNCTION BEFORE JSX USE
  const handleCreateShareLink = async () => {
    try {
      const res = await fetch("http://localhost:3000/favorite/share/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const data = await res.json();
      setShareUrl(data.shareUrl);
    } catch (err) {
      console.error("Failed to create share link", err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [shareId]);

  async function loadFavorites() {
    setLoading(true);
    try {
      const res = isSharedView
        ? await fetch(`/favorite/share/${shareId}`)
        : await authFetch("/favorite");

      if (!res.ok) throw new Error("Failed to load favorites");

      const data = await res.json();

      if (isSharedView && data.length > 0) {
        setSharedEmail(data[0].email);
      }

      const withMovies = await Promise.all(
        data.map(async (fav) => {
          const movieData = await fetchMovieDetails(fav.media_id);
          return {
            ...fav,
            movie: movieData.details || movieData,
          };
        })
      );

      setFavorites(withMovies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(favoriteId) {
    if (!window.confirm("Remove from favorites?")) return;

    try {
      const res = await authFetch(`/favorite/${favoriteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove favorite");

      setFavorites((prev) =>
        prev.filter((f) => f.favorite_id !== favoriteId)
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p>Loading favorites…</p>;

  return (
    <div className="favorites-page">
      <h2>{isSharedView ? "Shared Favorites" : "My Favorites"}</h2>

      {sharedEmail && <p>Shared by {sharedEmail}</p>}

      {!isSharedView && favorites.length > 0 && (
        <div className="share-section">
          <button className="btn-share" onClick={handleCreateShareLink}>
            Share favorites
          </button>

          {shareUrl && (
            <input
              type="text"
              value={shareUrl}
              readOnly
              onClick={(e) => e.target.select()}
            />
          )}
        </div>
      )}

      <FavoriteMovieGrid
        favorites={favorites}
        onRemove={!isSharedView ? handleRemove : null}
      />
    </div>
  );
}
