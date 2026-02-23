import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CitizenDashboard.css";

function CitizenDashboard() {
  const dashboardRef = useRef(null);
  const statusRef = useRef(null);
  const reportRef = useRef(null);

  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="citizen-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Citizen Panel</h2>

        <ul>
          <li
            onClick={() => {
              setActiveSection("dashboard");
              setTimeout(() => scrollToSection(dashboardRef), 100);
            }}
          >
            Dashboard
          </li>

          <li
            onClick={() => {
              setActiveSection("status");
              setTimeout(() => scrollToSection(statusRef), 100);
            }}
          >
            Election Status
          </li>

          <li
            onClick={() => {
              setActiveSection("report");
              setTimeout(() => scrollToSection(reportRef), 100);
            }}
          >
            Report Issue
          </li>

          <li onClick={() => setActiveSection("verification")}>
            Verification
          </li>

          <li onClick={() => setActiveSection("reports")}>
            My Reports
          </li>

          <li onClick={() => setActiveSection("notifications")}>
            Notifications
          </li>

          <li onClick={() => setActiveSection("profile")}>
            Profile
          </li>

          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <div className="dashboard-topbar">
          <div className="dashboard-profile">
            <img
              src="https://i.pravatar.cc/45"
              alt="Citizen"
              className="profile-img"
            />
          </div>
        </div>

        <h1>Welcome {currentUser?.fullName || "Citizen"} 👋</h1>

        {/* ================= DASHBOARD ================= */}
        {activeSection === "dashboard" && (
          <div ref={dashboardRef} className="cards">
            <div className="card">🗳 Election Active</div>
            <div className="card">📄 Reports Submitted</div>
            <div className="card">🔔 Notifications</div>
            <div className="card">🏫 Polling Info</div>
          </div>
        )}

        {/* ================= MY REPORTS ================= */}
        {activeSection === "reports" && (
          <div className="section-box">
            <h2>📄 My Reports</h2>
            <p>You have submitted 3 reports.</p>
          </div>
        )}

        {/* ================= NOTIFICATIONS ================= */}
        {activeSection === "notifications" && (
          <div className="section-box">
            <h2>🔔 Notifications</h2>
            <p>No new notifications.</p>
          </div>
        )}

        {/* ================= PROFILE ================= */}
        {activeSection === "profile" && (
          <div className="section-box">
            <h2>👤 Profile</h2>
            <p><strong>Name:</strong> {currentUser?.fullName}</p>
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>Role:</strong> {currentUser?.role}</p>
          </div>
        )}

        {/* ================= VERIFICATION ================= */}
        {activeSection === "verification" && (
          <div className="section-box">
            <h2>🆔 Identity Verification</h2>
            <button onClick={() => navigate("/citizen-form")}>
              Fill Verification Form
            </button>
          </div>
        )}

        {/* ================= ELECTION STATUS (UNCHANGED) ================= */}
        {activeSection === "status" && (
          <div ref={statusRef} className="section">
            <h2 className="section-title">Election Status</h2>

            {(() => {
              const allCitizens =
                JSON.parse(localStorage.getItem("citizens")) || [];

              const verificationData = allCitizens.find(
                (citizen) => citizen.userEmail === currentUser?.email
              );

              if (!verificationData) {
                return <p>Please complete identity verification first.</p>;
              }

              if (verificationData.status !== "Approved") {
                return (
                  <div className="status-pending">
                    🟡 Verification Pending Approval
                  </div>
                );
              }

              return (
                <div className="election-status-box">

                  <div className="status-card">
                    <h4>Election Name</h4>
                    <p>Lok Sabha Election 2026</p>
                  </div>

                  <div className="status-card">
                    <h4>Constituency</h4>
                    <p>{verificationData.constituency}</p>
                  </div>

                  <div className="status-card">
                    <h4>Election Date</h4>
                    <p>25 April 2026</p>
                  </div>

                  <div className="status-card">
                    <h4>Booth Location</h4>
                    <p>{verificationData.booth}</p>
                  </div>

                  <div className="status-indicator">
                    <span className="active-dot"></span> Active
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* ================= REPORT ISSUE ================= */}
        <div ref={reportRef} className="report-container">
            <div className="report-card">
              <h2>Report Election Issue</h2>

              <form className="report-form">

                <div className="form-group">
                  <label>Issue Title</label>
                  <input type="text" placeholder="Enter your issue" />
                </div>

                <div className="form-group">
                  <label>Issue Type</label>
                  <select>
                    <option>Select Issue Type</option>
                    <option>EVM Problem</option>
                    <option>Booth Problem</option>
                    <option>Voter List Issue</option>
                    <option>Illegal Activity</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Issue Description</label>
                  <textarea rows="4" placeholder="Describe the issue in detail"></textarea>
                </div>

                <div className="form-group">
                  <label>Date of Issue</label>
                  <input type="date" />
                </div>

                <button type="submit" className="submit-btn">
                  Submit Issue
                </button>

              </form>
            </div>
          </div>
        

      </div>
    </div>
  );
}

export default CitizenDashboard;