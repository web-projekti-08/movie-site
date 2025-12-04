/* 
  authFetch lisää Authorization-headerin JWT-tokenilla
  Käytetään suojattujen endpointien kutsumiseen
  Vain kirjautuneet käyttäjät voivat käyttää näitä endpointteja
*/

import { API_URL } from "./authApi";

export async function authFetch(path, options = {}) {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found. Please login first.");
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  return response;
}