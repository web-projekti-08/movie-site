import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('userEmail');
    setIsLoggedIn(!!token);
    if (email) setUserEmail(email);
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      
      {/* Logo */}
      <NavLink className="navbar-brand" to="/">Movie-Site</NavLink>

      {/* Mobile Menu */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* NAVBAR CONTAINER */}
      <div className="collapse navbar-collapse" id="navbarContent">

        {/* LEFT SIDE MENU */}
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/" end>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/groups">Groups</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/favorites">Favorites</NavLink>
          </li>
        </ul>

        {/* RIGHT SIDE USER AREA */}
        <ul className="navbar-nav ms-auto">

          {/* If user NOT logged in */}
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-primary ms-2" to="/signup">Register</NavLink>
              </li>
            </>
          )}

          {/* If user IS logged in */}
          {isLoggedIn && (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}`}
                  className="rounded-circle me-2"
                  width="32"
                  height="32"
                  alt="avatar"
                />
                <span>{userEmail}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><NavLink className="dropdown-item" to="/profile">Profile</NavLink></li>
                <li><NavLink className="dropdown-item" to="/settings">Settings</NavLink></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
              </ul>
            </li>
          )}
        </ul>
      </div>

    </nav>
  );
}
