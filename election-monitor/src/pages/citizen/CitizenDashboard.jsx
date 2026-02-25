import React, { useState } from "react";
import "./CitizenDashboard.css";
import LiveElectionTracker from "./LiveElectionTracker";

function CitizenDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
   const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const reports =
    JSON.parse(localStorage.getItem("citizenReports")) || [];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <div className="citizen-wrapper">

      {/* ================= NAVBAR ================= */}
      <div className="citizen-navbar">
        <button
          className="citizenmenu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <div className="nav-left">
          <h2>VOTEGUARD</h2>
        </div>

       <div className="user-section">
  <img
    src={
      currentUser?.profileImage ||
      currentUser?.profilePic ||
      currentUser?.image ||
      "/default-profile.png"
    }
    alt="profile"
    className="profile-pic"
  />

  <span className="admin-name">
    {currentUser?.fullName || currentUser?.name || "Admin"}
  </span>

  <button
  className="logout-btn"
  onClick={handleLogout}
>
  Logout
</button>
</div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="citizen-layout">
        <div className={`citizen-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <p
            className={activeSection === "dashboard" ? "active-link" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard Overview
          </p>

          <p
            className={activeSection === "elections" ? "active-link" : ""}
            onClick={() => setActiveSection("elections")}
          >
            Live Election Tracker
          </p>

          <p
            className={activeSection === "report" ? "active-link" : ""}
            onClick={() => setActiveSection("report")}
          >
            Report an Issue
          </p>

          <p
            className={activeSection === "myreports" ? "active-link" : ""}
            onClick={() => setActiveSection("myreports")}
          >
            My Reports
          </p>

          <p
            className={activeSection === "forum" ? "active-link" : ""}
            onClick={() => setActiveSection("forum")}
          >
            Civic Discussion Forum
          </p>

          <p
            className={activeSection === "notifications" ? "active-link" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            Notifications
          </p>

          <p
            className={activeSection === "profile" ? "active-link" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Profile Settings
          </p>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="citizen-content">

          {activeSection === "dashboard" && (
            <>
              <div className="welcome-card">
                <div className="profile-section">
                  <img
    src={
      currentUser?.profileImage ||
      currentUser?.profilePic ||
      currentUser?.image ||
      "/default-profile.png"
    }
    alt="profile"
    className="profile-pic"
  />
                  <div>
                    <h2>
                      Welcome,   {currentUser?.fullName || currentUser?.name || "Citizen"}
                    </h2>
                    <p>
                      <strong>Voter ID:</strong>{" "}
                      {currentUser.voterId || "VOT123456"}
                    </p>
                  </div>
                </div>

                <div className="stats">
                  <div className="stat-box">
                    <h3>1</h3>
                    <p>Active Elections</p>
                  </div>

                  <div className="stat-box">
                    <h3>{reports.length}</h3>
                    <p>Total Reports Submitted</p>
                  </div>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-card">
                  <h3>🗳 Live Election</h3>
                  <p>City Council Election 2026</p>
                  <p>
                    Status: <span className="active-status">Ongoing</span>
                  </p>
                </div>

                <div className="info-card">
                  <h3>📝 Recent Report</h3>
                  <p>
                    {reports.length > 0
                      ? reports[reports.length - 1].title
                      : "No reports submitted yet"}
                  </p>
                </div>

                <div className="info-card">
                  <h3>🔔 Notifications</h3>
                  <p>You have 2 new updates</p>
                </div>
              </div>
            </>
          )}
           {activeSection === "livelections" && <LiveElectionTracker />}

        </div>
      </div>
    </div>
  );
}

export default CitizenDashboard;