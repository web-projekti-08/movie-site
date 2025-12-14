import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;

  return (
    <nav className="nav">
      <div className="nav-left">
        <NavLink to="/" className="nav-logo">
          MovieSite
        </NavLink>

        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/groups" className="nav-link">Groups</NavLink>
        <NavLink to="/favorites" className="nav-link">Favorites</NavLink>
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/register" className="nav-btn">Register</NavLink>
          </>
        ) : (
          <div className="nav-user">
            <span>{user.email}</span>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button className="danger" onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
