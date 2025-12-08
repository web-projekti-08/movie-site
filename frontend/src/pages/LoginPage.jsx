/*
  Kaikki kirjautumiseen liittyvät toiminnot, kuten lomake ja validointi - hoidetaan AuthContextin kautta:
  const { login } = useAuth();
*/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className="auth-container">
    <h2>Login</h2>

    {error && <p className="auth-error">{error}</p>}

    <form onSubmit={handleSubmit} className="auth-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>

    <p className="auth-switch">
      Don't have an account? <a href="/register">Register</a>
    </p>
  </div>
);

}

export default LoginPage;
