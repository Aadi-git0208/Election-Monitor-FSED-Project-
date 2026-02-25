import React, { useEffect, useState } from "react";
import "./CitizenDashboard.css";
import LiveElectionTracker from "./LiveElectionTracker";
import ReportIssue from "./ReportIssue";
import MyReports from "./MyReports";
import CivicDiscussionForum from "./CivicDiscussionForum";
import Notifications from "./Notification";
import Profile from "./Profile";

function CitizenDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [systemData, setSystemData] = useState({
    users: [],
    elections: [],
    reports: [],
    notifications: [],
  });

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  useEffect(() => {
    const loadData = () => {
      const data =
        JSON.parse(localStorage.getItem("electionSystem")) || {
          users: [],
          elections: [],
          reports: [],
          notifications: [],
        };
      setSystemData(data);
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeElections = systemData.elections.filter(
    (e) => e.active === true
  );

  const userReports = systemData.reports.filter(
    (r) => r.userId === currentUser?.id || !r.userId
  );

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <div className="citizen-wrapper">
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
            {currentUser?.fullName || currentUser?.name || "Citizen"}
          </span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

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
            className={activeSection === "civicforum" ? "active-link" : ""}
            onClick={() => setActiveSection("civicforum")}
          >
            Civic Discussion Forum
          </p>
           <p
            className={activeSection === "notifications" ? "active-link" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            Notification
          </p>
           <p
            className={activeSection === "profile" ? "active-link" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </p>
        </div>

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
                      Welcome,{" "}
                      {currentUser?.fullName ||
                        currentUser?.name ||
                        "Citizen"}
                    </h2>
                    <p>
                      <strong>Voter ID:</strong>{" "}
                      {currentUser?.voterId || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="stats">
                  <div className="stat-box">
                    <h3>{activeElections.length}</h3>
                    <p>Active Elections</p>
                  </div>

                  <div className="stat-box">
                    <h3>{userReports.length}</h3>
                    <p>Total Reports Submitted</p>
                  </div>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-card">
                  <h3>🗳 Live Elections</h3>
                  {activeElections.length === 0 ? (
                    <p>No Active Elections</p>
                  ) : (
                    activeElections.map((e) => (
                      <p key={e.id}>{e.title}</p>
                    ))
                  )}
                </div>

                <div className="info-card">
                  <h3>📝 Recent Report</h3>
                  {userReports.length > 0 ? (
                    <p>
                      {
                        userReports[userReports.length - 1]
                          .title
                      }
                    </p>
                  ) : (
                    <p>No reports submitted yet</p>
                  )}
                </div>

                <div className="info-card">
                  <h3>🔔 Notifications</h3>
                  <p>{systemData.notifications.length} updates</p>
                </div>
              </div>
            </>
          )}

          {activeSection === "elections" && <LiveElectionTracker />}
          {activeSection === "report" && <ReportIssue />}
          {activeSection === "myreports" && <MyReports />}
          {activeSection === "civicforum" && <CivicDiscussionForum />}
          {activeSection === "notifications" && <Notifications />}
          {activeSection === "profile" && <Profile />}
        </div>
      </div>
    </div>
  );
}

export default CitizenDashboard;