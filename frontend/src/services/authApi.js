const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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

  return res.json(); // { message, user: { userId, email } }
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send cookies
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }

  return res.json(); // { message, accessToken, user: { userId, email } }
}

export async function logout() {
  const res = await fetch(`${API_URL}/user/logout`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Logout failed");
  return res.json(); // { message }
}

export async function deleteAccount() {
  const token = localStorage.getItem('accessToken'); // get JWT from localStorage
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

  return res.json(); // { message }
}
