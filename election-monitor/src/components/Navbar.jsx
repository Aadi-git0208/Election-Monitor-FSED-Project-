import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSignup = location.pathname === "/signup";

  // 🔹 Get current user
  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  const [showDropdown, setShowDropdown] = useState(false);

  // 🔹 Logout function
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/login");
    window.location.reload(); // force navbar refresh
  };

  return (
    <nav className={`navbar ${isSignup ? "navbar-signup" : ""}`}>
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="logo-img" />
        <h2 className="logo">VoteGuard</h2>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/dashboard">Dashboard</Link>

        {!currentUser ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="profile-section">
            <div
              className="profile-info"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="profile-img"
              />
              <span>{currentUser.name}</span>
            </div>

            {showDropdown && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;