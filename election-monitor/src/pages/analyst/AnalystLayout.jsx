import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./AnalystDashboard.css";
import ProfileUpdateModal from "../../components/common/ProfileUpdateModal";

const AnalystLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <div className="analyst-layout">
      <div className="analyst-navbar">
        <button
          className="analyst-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h2>VOTEGUARD</h2>

        <div className="analyst-user-section">
          <img
            src={
              currentUser?.profileImage ||
              currentUser?.profilePic ||
              currentUser?.image ||
              "/default-profile.png"
            }
            alt="profile"
            className="analyst-profile-pic"
          />

          <span className="analyst-name">
            {currentUser?.fullName || currentUser?.name || "Analyst"}
          </span>

          <button
            className="analyst-profile-update-btn"
            onClick={() => setShowProfileModal(true)}
          >
            Update Profile
          </button>

          <button className="analyst-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="analyst-body">
        <div className={`analyst-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <ul>
            <li>
              <NavLink
                to="dashboard"
                className={({ isActive }) =>
                  `analyst-sidebar-link ${isActive ? "active" : ""}`
                }
              >
                Dashboard Overview
              </NavLink>
            </li>

            <li>
              <NavLink
                to="data-overview"
                className={({ isActive }) =>
                  `analyst-sidebar-link ${isActive ? "active" : ""}`
                }
              >
                Data Overview
              </NavLink>
            </li>

            <li>
              <NavLink
                to="charts"
                className={({ isActive }) =>
                  `analyst-sidebar-link ${isActive ? "active" : ""}`
                }
              >
                Charts Analytics
              </NavLink>
            </li>

            <li>
              <NavLink
                to="predictive"
                className={({ isActive }) =>
                  `analyst-sidebar-link ${isActive ? "active" : ""}`
                }
              >
                Predictive Analysis
              </NavLink>
            </li>

            <li>
              <NavLink
                to="reports"
                className={({ isActive }) =>
                  `analyst-sidebar-link ${isActive ? "active" : ""}`
                }
              >
                Export Reports
              </NavLink>
            </li>

            <li>
              <NavLink
                to="notifications"
                className={({ isActive }) =>
                  `analyst-sidebar-link ${isActive ? "active" : ""}`
                }
              >
                Notifications
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={`analyst-container ${sidebarOpen ? "shift" : ""}`}>
          <Outlet />
        </div>
      </div>

      {showProfileModal && (
        <ProfileUpdateModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default AnalystLayout;