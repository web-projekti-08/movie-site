export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="review-list">
      {reviews.map((r, i) => (
        <div key={i} className="review-item">
          <strong>{r.user_id}:</strong>
          <div className="review-stars">
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (r.rating || r.vote_average) ? "selected" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
          <p>{r.review_text}</p>
        </div>
      ))}
    </div>
  );
}
