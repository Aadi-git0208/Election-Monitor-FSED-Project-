import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const readStoredJson = (storage, key, fallback) => {
  const raw = storage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    storage.removeItem(key);
    return fallback;
  }
};

const getUserImage = (user) => {
  return (
    user?.profileImage ||
    user?.profilePic ||
    user?.image ||
    user?.avatar ||
    "/default-profile.svg"
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const normalizeRole = (role) => {
    let value = role;

    if (value && typeof value === "object") {
      value = value.authority || value.role || "";
    }

    const normalized = String(value || "").trim().toLowerCase();
    return normalized.startsWith("role_")
      ? normalized.replace("role_", "")
      : normalized;
  };

  const getSystemData = () => {
    const parsed = readStoredJson(localStorage, "electionSystem", null);

    if (!parsed || typeof parsed !== "object") {
      return {
        users: [],
        elections: [],
        reports: [],
        notifications: [],
      };
    }

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      elections: Array.isArray(parsed.elections) ? parsed.elections : [],
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
    };
  };

  const resolveRole = (user) => {
    if (!user) {
      return "";
    }

    const directRole =
      normalizeRole(user.role) ||
      normalizeRole(user.userRole) ||
      normalizeRole(user.authority) ||
      normalizeRole(user.authorities?.[0]) ||
      normalizeRole(user.roles?.[0]);

    if (directRole) {
      return directRole;
    }

    const systemUsers = getSystemData().users;
    const email = String(user.email || "").trim().toLowerCase();
    const userId = String(user.id || "").trim();

    const matchedUser = systemUsers.find((item) => {
      const itemEmail = String(item?.email || "").trim().toLowerCase();
      const itemId = String(item?.id || "").trim();

      return (email && itemEmail === email) || (userId && itemId === userId);
    });

    return normalizeRole(matchedUser?.role);
  };

  const getDashboardPath = (role) => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "citizen") return "/citizen-dashboard";
    if (role === "analyst") return "/analyst/dashboard";
    if (role === "observer") return "/observer-dashboard";
    return "/";
  };

  const currentUser =
    readStoredJson(localStorage, "currentUser", null) ||
    readStoredJson(sessionStorage, "currentUser", null);
  const currentRole = resolveRole(currentUser);

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
        {currentUser && currentRole === "admin" && (
          <div className="admin-navbar">
            <span className="welcome-text">ADMIN PANEL</span>

            <div
              className="profile-info"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={getUserImage(currentUser)}
                alt="Profile"
                className="profile-img"
              />
              <span>{currentUser?.fullName || currentUser?.name || "Admin"}</span>
            </div>

            {showDropdown && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}

        {/* ================= CITIZEN NAVBAR ================= */}
        {currentUser && currentRole === "citizen" && (
          <>
            <Link to="/citizen-dashboard">Dashboard</Link>
            <Link to="/reports">My Reports</Link>

            <div
              className="profile-info"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={getUserImage(currentUser)}
                alt="Profile"
                className="profile-img"
              />

              <span>{currentUser?.fullName || currentUser?.name || "Citizen"}</span>
            </div>

            {showDropdown && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        )}

        {/* ================= ANALYST NAVBAR ================= */}
        {currentUser && currentRole === "analyst" && (
          <>
            <Link to="/analyst/dashboard">Dashboard</Link>
            <Link to="/analyst/data-overview">Data Overview</Link>
            <Link to="/analyst/charts">Charts</Link>
            <Link to="/analyst/reports">Reports</Link>

            <div
              className="profile-info"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={getUserImage(currentUser)}
                alt="Profile"
                className="profile-img"
              />

              <span>{currentUser?.fullName || currentUser?.name || "Analyst"}</span>
            </div>

            {showDropdown && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        )}

        {/* ================= OBSERVER NAVBAR ================= */}
        {currentUser && currentRole === "observer" && (
          <>
            <Link to="/observer-dashboard">Dashboard</Link>
            <Link to="/">Home</Link>

            <div
              className="profile-info"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={getUserImage(currentUser)}
                alt="Profile"
                className="profile-img"
              />

              <span>{currentUser?.fullName || currentUser?.name || "Observer"}</span>
            </div>

            {showDropdown && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        )}

        {/* ================= DEFAULT LOGGED-IN NAVBAR ================= */}
        {currentUser && !["admin", "citizen", "analyst", "observer"].includes(currentRole) && (
          <>
            <Link to="/">Home</Link>
            <Link to={getDashboardPath(currentRole)}>Dashboard</Link>

            <div
              className="profile-info"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={getUserImage(currentUser)}
                alt="Profile"
                className="profile-img"
              />

              <span>{currentUser?.fullName || currentUser?.name || "User"}</span>
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
