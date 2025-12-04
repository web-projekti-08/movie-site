/*
  Yksittäisen elokuvan sivu, joka näyttää elokuvan tiedot, arvostelut.
  Vain kirjautuneet käyttäjät voivat lisätä elokuvan suosikkeihin, ryhmiin ja kirjoittaa arvosteluja.
*/

import '../App.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchMovieDetails,
  fetchMovieReviews,
  postReview,
  addMovieToGroup,
} from "../services/movieService";

import MovieDetails from "../components/MovieDetails";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import AddToFavoritesButton from "../components/AddToFavoritesButton";
import AddToGroupButton from "../components/AddToGroupButton";
import { useAuth } from "../context/AuthContext";

export default function MoviePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadData() {
      const d = await fetchMovieDetails(id);
      const r = await fetchMovieReviews(id);

      // Unwrapataan movie details jos tarpeen
      const movieData = d.details || d;

      setMovie(movieData);
      setReviews(r || []);
    }
      loadData();
    }, [id]);

  async function handleReviewSubmit(text, rating) {
    try {
      await postReview(id, text, rating);
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

          {user && (
            <div className="button-row">
              <AddToFavoritesButton movieId={movie.id} className="add-favorite-btn" />
              <AddToGroupButton
                movieId={movie.id}
                userGroups={user.groups}
                onAdd={handleAddToGroup}
                className="add-group-btn"
              />
            </div>
          )}
        </div>
      </div>

      <div className="review-section">
        <h3>Reviews</h3>
        <ReviewList reviews={reviews} />
        {user && <ReviewForm onSubmit={handleReviewSubmit} />}
      </div>
    </div>
  );
}
