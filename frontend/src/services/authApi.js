export const API_URL = process.env.REACT_APP_API_URL || '';

export async function register(email, password) {
  const res = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }

  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // lähettää cookiet (refresh token)
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }

  return res.json(); // { accessToken }
}

export async function logout() {
  const res = await fetch(`${API_URL}/user/logout`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

// Käyttäjätietojen haku tokenilla
export async function getProfile(token) {
  if (!token) return null;

  const res = await fetch(`${API_URL}/user/profile`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include"
  });

  if (!res.ok) return null;
  return res.json(); // { userId, email, groups, etc }
}

export async function deleteAccount() {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error("Access token missing");

  const res = await fetch(`${API_URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    credentials: "include"
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Delete failed");
  }

  return res.json();
}
