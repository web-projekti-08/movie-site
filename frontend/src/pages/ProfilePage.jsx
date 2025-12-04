/*
  Profiilisivu, jossa käyttäjä voi nähdä tietonsa, kirjautua ulos tai poistaa tilinsä.
  Uloskirjautuminen ja tilin poisto hoidetaan AuthContextin kautta:
  const { user, logout, deleteAccount} = useAuth();
*/

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user, logout, deleteAccount} = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Profile</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <p><strong>Email:</strong> {user?.email}</p>

      <button 
        onClick={handleLogout} 
        style={{ width: '100%', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}
      >
        Logout
      </button>
      
      <button 
        onClick={handleDeleteAccount} 
        style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white' }}
      >
        Delete Account
      </button>
    </div>
  );
}

export default ProfilePage;
