import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

// Navigaation uloskirjautuminen hoidetaan AuthContextin kautta
export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">

      <NavLink className="navbar-brand" to="/">Movie-Site</NavLink>

      <div className="collapse navbar-collapse" id="navbarContent">
        
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

        <ul className="navbar-nav ms-auto">
          {!user && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-primary ms-2" to="/register">Register</NavLink>
              </li>
            </>
          )}

          {user && (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                  className="rounded-circle me-2"
                  width="32"
                  height="32"
                  alt="avatar"
                />
                <span>{user.email}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><NavLink className="dropdown-item" to="/profile">Profile</NavLink></li>
                <li><NavLink className="dropdown-item" to="/settings">Settings</NavLink></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
