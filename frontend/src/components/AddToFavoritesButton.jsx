import { addFavorite } from "../services/movieService";

export default function AddToFavoritesButton({ movieId, userId }) {
  const handleClick = async () => {
    try {
      await addFavorite(userId, movieId);
      alert("Added to favorites!");
    } catch (err) {
      console.error("Failed to add favorite:", err);
      alert("Failed to add favorite");
    }
  };

  return <button onClick={handleClick}>❤️ Add to Favorites</button>;
}
