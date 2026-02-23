import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isSignup = location.pathname === "/signup";

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
        <Link to="/login">Login</Link>
        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;