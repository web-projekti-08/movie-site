import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import './ProfilePage.css';

function Profile() {
  const navigate = useNavigate();
  const { user, logout, deleteAccount } = useAuth(); // Auth functions from context

  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.uid) {
      navigate('/login');
      return;
    }
    fetchUserData(user.uid);
  }, [navigate, user]);

  const fetchUserData = async (id) => {
    setLoading(true);
    try {
      await Promise.all([fetchFavorites(id), fetchReviews(id)]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/favorites/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchReviews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/user/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/favorites/${user.uid}/${favoriteId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        setFavorites(favorites.filter(f => f.favorite_id !== favoriteId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/reviews/${reviewId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        setReviews(reviews.filter(r => r.review_id !== reviewId));
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  if (loading) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{user?.email}</h2>
        <p>{favorites.length} favorites · {reviews.length} reviews</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="profile-tabs">
        <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>Favorites</button>
        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Reviews</button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>
      </div>

      <div className="profile-content">
        {activeTab === 'favorites' && (
          <div>
            <h3>Favorites</h3>
            {favorites.map(fav => (
              <div key={fav.favorite_id} className="favorite-card">
                <div>
                  <h4>Movie ID: {fav.media_id}</h4>
                  <p>{new Date(fav.added_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleRemoveFavorite(fav.favorite_id)}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h3>Reviews</h3>
            {reviews.map(review => (
              <div key={review.review_id} className="review-card">
                <div>
                  <h4>Movie ID: {review.media_id}</h4>
                  <p>Rating: {review.rating}/5</p>
                  <p>{review.review_text}</p>
                  <p>{new Date(review.posted_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDeleteReview(review.review_id)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3>Settings</h3>
            <p>Email: {user?.email}</p>
            <button onClick={handleLogout}>Logout</button>
            <button style={{ backgroundColor: '#dc3545', color: 'white', marginTop: '10px' }} onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
