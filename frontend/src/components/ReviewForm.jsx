import { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || rating === 0) return alert("Write a review and select a rating!");
    onSubmit(text, rating);
    setText("");
    setRating(0);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="star-rating">
        {[1,2,3,4,5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hoverRating || rating) ? "selected" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Write your review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}
