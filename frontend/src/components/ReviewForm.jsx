import { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || rating === 0) {
      setError("Write a review and select a rating!");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      await onSubmit(text, rating);
      setText("");
      setRating(0);
      setHoverRating(0);
    } catch (err) {
      console.error("Review submission error:", err);
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= (hoverRating || rating) ? "selected" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder="Write your review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
