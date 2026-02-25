import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="logo-img" />
        <h2 className="logo">VoteGuard</h2>
      </div>

      <div className="nav-links">
        
        {/* ================= HOME NAVBAR (NOT LOGGED IN) ================= */}
        {!currentUser && (
          <>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>

            <Link to="/reports">Reports</Link>
            <Link to="/dashboard">Dashboard</Link>

            <Link to="/login">Login</Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}

        {/* ================= ADMIN NAVBAR ================= */}
        {currentUser && currentUser.role === "admin" && (
          <div className="admin-navbar">
            <span className="welcome-text">ADMIN PANEL</span>

            <div
              className="profile-info"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={currentUser?.image}
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

        {/* ================= CITIZEN NAVBAR ================= */}
        {currentUser && currentUser.role === "citizen" && (
          <>
            <Link to="/citizen-dashboard">Dashboard</Link>
            <Link to="/reports">My Reports</Link>

            <div
              className="profile-info"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
  src={currentUser?.image || "/default-profile.png"}
  alt="Profile"
  className="profile-img"
/>

<span>{currentUser?.name}</span>
            </div>

            {showDropdown && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
