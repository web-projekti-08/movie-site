/*
  Rekisteröitymissivu, joka käsittelee käyttäjän rekisteröitymisen.
  Rekisteröityminen hoidetaan AuthContextin kautta: const { register } = useAuth();.
*/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import "./Register.css";

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // HIENO SUCCESS MESSAGE
  const navigate = useNavigate();
  const { register } = useAuth();

  // Valodoi salasana: vähintään 8 merkkiä, yksi numero, yksi iso kirjain
  const validatePassword = (pwd) => {
    return pwd.length >= 8 && /\d/.test(pwd) && /[A-Z]/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters, contain a number and an uppercase letter');
      return;
    }

    try {
      await register(email, password);
      // NÄYTTÄÄ HIENON VIESTIN JA OHJAA LOGIN-SIVULLE 2 SEKUNNIN JÄLKEEN onnistuneesta rekisteröinnistä
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className="auth-container">
    <h2>Register</h2>

    {error && <p className="auth-error">{error}</p>}
    {success && <p className="auth-success">{success}</p>}

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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button type="submit">Register</button>
    </form>

    <p className="auth-switch">
      Already have an account? <a href="/login">Login</a>
    </p>
  </div>
);

}

export default RegisterPage;
