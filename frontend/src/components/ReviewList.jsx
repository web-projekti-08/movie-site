/*
  Elokuvasivun arvostelulista, näyttää tietokannassa olevat arvostelut elokuvalle.
*/

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="review-list">
      {reviews.map((r, i) => (
        <div key={i} className="review-item">
          <strong>{r.email || "Anonymous"}:</strong>
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
  <span
    key={star}
    style={{
      color: star <= r.rating ? "#f5c518" : "#555",
      fontSize: "18px",
      marginRight: "2px"
    }}
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

