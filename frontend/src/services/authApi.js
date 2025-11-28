const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function register(email, password) {
  const response = await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }
  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username: email, password })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  return response.json();
}

export async function logout(token) {
  const response = await fetch(`${API_URL}/user/logout`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Logout failed');
  return response.json();
}

export async function deleteAccount(token) {
  const response = await fetch(`${API_URL}/user/delete`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Delete failed');
  return response.json();
}
