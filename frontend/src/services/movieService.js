import axios from "axios";
const API = process.env.REACT_APP_API_URL;

export async function fetchMovieDetails(id) {
  const res = await axios.get(`${API}/movie/${id}`);
  return res.data.details;
}

export async function fetchMovieReviews(id) {
  try {
    const res = await axios.get(`${API}/review/media/${id}`);
    if (!Array.isArray(res.data)) return [];
    return res.data;
  } catch (err) {
    console.error("Failed to fetch reviews:", err.message);
    return [];
  }
}

export async function postReview(mediaId, userId, reviewText, rating) {
  return axios.post(`${API}/review`, { mediaId, userId, text: reviewText, rating });
}

export async function addFavorite(userId, mediaId) {
  return axios.post(`${API}/favorite/${userId}`, { mediaId });
}

export async function addMovieToGroup(groupId, mediaId) {
  return axios.post(`${API}/groups/${groupId}/content`, { mediaId });
}

export async function fetchUserGroups(userId) {
  const res = await axios.get(`${API}/groups/user/${userId}`);
  return res.data;
}