import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, deleteAccount } from '../services/authApi';

function ProfilePage() {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const id = localStorage.getItem('userId');
    if (!token || !id) {
      navigate('/login');
    } else {
      setUserId(id);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await logout(token);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await deleteAccount(token);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      navigate('/register');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Logged in as {userId}</p>
      <button onClick={handleLogout} style={{ width: '100%', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>
        Logout
      </button>
      <button onClick={handleDeleteAccount} style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white' }}>
        Delete Account
      </button>
    </div>
  );
}

export default ProfilePage;
