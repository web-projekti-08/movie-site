import { API_URL } from "./authApi";
import { authFetch } from "./authFetch";


export async function fetchMovieDetails(movieId) {
  const res = await fetch(`${API_URL}/movie/${movieId}`);
  if (!res.ok) throw new Error("Failed fetching movie details");
  return res.json();
}

export async function fetchMovieReviews(movieId) {
  const res = await fetch(`${API_URL}/review/${movieId}`);
  if (!res.ok) throw new Error("Failed fetching reviews");
  return res.json();
}

export async function postReview(movieId, text, rating) {
  // Käytetään authFetch-funktiota, joka lisää Authorization-headerin
  // Mahdollistaa suojattujen endpointien kutsumisen
  // Vain kirjautuneet käyttäjät voivat lähettää arvosteluja
  const res = await authFetch(`/review/${movieId}`, {
    method: "POST",
    body: JSON.stringify({ review_text: text, rating})
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed posting review");
  }
  return res.json();
}

export async function addFavorite(movieId) {
  // Vain kirjautuneet käyttäjät voivat lisätä suosikkeihin
  const res = await authFetch(`/favorite`, {
    method: "POST",
    body: JSON.stringify({ mediaId: movieId })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed adding movie to favorites");
  }
  return res.json();
}

export async function addMovieToGroup(groupId, movieId) {
  // Vain kirjautuneet käyttäjät voivat lisätä elokuvia ryhmiin
  const res = await authFetch(`/groups/${groupId}/content`, {
    method: "POST",
    body: JSON.stringify({ mediaId: movieId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed adding movie to group");
  }
  return res.json();
}

export async function fetchUserGroups() {
  // Vain kirjautuneet käyttäjät voivat hakea omat ryhmänsä
  const res = await authFetch(`/groups/user`);
  if (!res.ok) {
    console.error("Failed fetching groups:", res.status);
    return [];
  }
  return res.json();
}