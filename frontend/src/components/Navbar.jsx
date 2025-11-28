import {Link, NavLink} from 'react-router-dom'
import '../App.css'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">Movie-Site</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/groups">Groups</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/favorites">Favorites</NavLink>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <NavLink className="nav-link" to="/profile">Profile</NavLink>
              ) : (
                <NavLink className="nav-link" to="/login">Login</NavLink>
              )}
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><NavLink className="dropdown-item" to="/settings">Settings</NavLink></li>
                <li><NavLink className="dropdown-item" to="/notifications">Notifications</NavLink></li>
                <li><hr className="dropdown-divider" /></li>
                {!isLoggedIn && <li><NavLink className="dropdown-item" to="/signup">Sign up</NavLink></li>}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}