/*
  Elokuvasivun arvostelulista, näyttää tietokannassa olevat arvostelut elokuvalle.
*/

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="review-list">
      {reviews.map((r, i) => (
        <div key={i} className="review-item">
          <strong>{r.email || "Anonymous"} </strong>
          <div className="review-stars">
            {Array.from({ length: r.rating }, (_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
          <p className="review-date">
            { new Date(r.posted_at).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>{r.review_text}</p>
        </div>
      ))}
    </div>
  );
}

