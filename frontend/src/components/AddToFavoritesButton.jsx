import { addFavorite } from "../services/movieService";
import { useAuth } from "../context/AuthContext";

export default function AddToFavoritesButton({ movieId }) {
  const { user, accessToken } = useAuth();

  const handleClick = async () => {
    if (!user || !accessToken) {
      alert("Please login first");
      return;
    }
    try {
      await addFavorite(movieId);
      alert("Added to favorites!");
    } catch (err) {
      console.error("Failed to add favorite:", err);
      if (err.message.includes("401") || err.message.includes("Invalid")) {
        alert("Your session has expired. Please login again.");
      } else {
        alert("Failed to add favorite: " + err.message);
      }
    }
  };

  return (
    <button onClick={handleClick} disabled={!user || !accessToken}>
      ❤️ Add to Favorites
    </button>
  );
}
