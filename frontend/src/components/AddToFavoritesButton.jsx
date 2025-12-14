import { useEffect, useState } from "react";
import { addFavorite } from "../services/movieService";
import { authFetch } from "../services/authFetch";
import { useAuth } from "../context/AuthContext";

export default function AddToFavoritesButton({ movieId }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function checkFavorite() {
      try {
        const res = await authFetch("/favorite");
        const data = await res.json();
        setIsFavorite(data.some((f) => f.media_id === movieId));
      } catch (err) {
        console.error(err);
      }
    }

    checkFavorite();
  }, [movieId, user]);

  const handleClick = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    try {
      await addFavorite(movieId);
      setIsFavorite(true);
    } catch (err) {
      console.error(err);
      alert("Failed to add favorite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isFavorite || loading}
      className={isFavorite ? "btn-favorited" : "btn-favorite"}
    >
      {isFavorite ? "✓ In Favorites" : "❤️ Add to Favorites"}
    </button>
  );
}
