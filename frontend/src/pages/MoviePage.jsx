import './MoviePage.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchMovieDetails,
  fetchMovieReviews,
  postReview,
  addMovieToGroup,
  fetchUserGroups
} from "../services/movieService";

import MovieDetails from "../components/MovieDetails";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import AddToFavoritesButton from "../components/AddToFavoritesButton";
import AddToGroupButton from "../components/AddToGroupButton";

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const userId = 1; // TEST

  useEffect(() => {
    async function loadData() {
      const d = await fetchMovieDetails(id);
      const r = await fetchMovieReviews(id);
      const groups = await fetchUserGroups(userId);
      setMovie(d);
      setReviews(r || []);
      setUserGroups(groups || []);
    }
    loadData();
  }, [id]);

  async function handleReviewSubmit(text, rating) {
    try {
      await postReview(id, userId, text, rating);
      const updatedReviews = await fetchMovieReviews(id);
      setReviews(updatedReviews || []);
    } catch (err) {
      console.error("Failed to post review:", err.message);
    }
  }

  async function handleAddToGroup(groupId, movieId) {
    try {
      await addMovieToGroup(groupId, movieId);
      alert("Added to group!");
    } catch (err) {
      console.error("Failed to add movie to group:", err);
      alert("Failed to add movie to group");
    }
  }

  if (!movie) return <p>Loading movie…</p>;

  return (
    <div className="movie-page">
      <div className="movie-details">
        <div className="movie-details-info">
          <MovieDetails movie={movie} />
          <div className="button-row">
            <AddToFavoritesButton movieId={movie.id} userId={userId} className="add-favorite-btn" />
            <AddToGroupButton
              movieId={movie.id}
              userGroups={userGroups}
              onAdd={handleAddToGroup}
              className="add-group-btn"
            />
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>Reviews</h3>
        <ReviewList reviews={reviews} />
        <ReviewForm onSubmit={handleReviewSubmit} />
      </div>
    </div>
  );
}
