import axios from "axios";
const API = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

export async function postReview(mediaId, reviewText, rating) {
  return axios.post(`${API}/review`,
    { mediaId, text: reviewText, rating },
    { headers: getAuthHeader() }
  );
}

export async function addFavorite(mediaId) {
  return axios.post(`${API}/favorite/`,
    { mediaId },
    { headers: getAuthHeader() }
  );
}

export async function addMovieToGroup(groupId, mediaId) {
  return axios.post(`${API}/groups/${groupId}/content`,
    { mediaId },
    { headers: getAuthHeader() }
  );
}

export async function fetchUserGroups() {
  const res = await axios.get(`${API}/groups/user`,
    { headers: getAuthHeader() }
  );
  return res.data;
}