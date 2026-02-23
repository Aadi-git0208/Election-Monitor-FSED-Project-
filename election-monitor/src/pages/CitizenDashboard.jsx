import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CitizenDashboard.css";

function CitizenDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  const [reports, setReports] = useState(
    JSON.parse(localStorage.getItem("reports")) || []
  );

  const [discussion, setDiscussion] = useState([]);
  const [comment, setComment] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    date: ""
  });

  /* ================= FUNCTIONS ================= */

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  // ✅ NEW: Open Application Form
  const openApplicationForm = () => {
    navigate("/citizen-form");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReport = {
      ...formData,
      userEmail: currentUser?.email,
      status: "Pending"
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));

    alert("Report Submitted Successfully!");
    setFormData({ title: "", type: "", description: "", date: "" });
    setActiveSection("reports");
  };

  const handlePostComment = () => {
    if (!comment.trim()) return;

    setDiscussion([
      ...discussion,
      { user: currentUser?.fullName || "Citizen", text: comment }
    ]);

    setComment("");
  };

  const myReportsCount = reports.filter(
    (r) => r.userEmail === currentUser?.email
  ).length;

  /* ================= UI ================= */

  return (
    <div className="citizen-layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Citizen Panel</h2>
        <ul>
          <li onClick={() => setActiveSection("dashboard")}>Dashboard</li>
          <li onClick={() => setActiveSection("status")}>Election Status</li>
          <li onClick={() => setActiveSection("report")}>Report Issue</li>
          <li onClick={() => setActiveSection("reports")}>My Reports</li>
          <li onClick={() => setActiveSection("discussion")}>Discussion</li>
          <li onClick={() => setActiveSection("notifications")}>Notifications</li>
          <li onClick={() => setActiveSection("profile")}>Profile</li>

          {/* ✅ ONLY NEW ADDITION */}
          <li onClick={openApplicationForm}>Application Form</li>

          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <div className="topbar">
          Welcome {currentUser?.fullName || "Citizen"} 👋
        </div>

        {/* ================= DASHBOARD ================= */}
        {activeSection === "dashboard" && (
          <div className="dashboard-wrapper">

            <div className="cards">
              <div className="card">🗳 Election Active</div>
              <div className="card">📄 My Reports: {myReportsCount}</div>
              <div className="card">📊 Transparency Score: 92%</div>
              <div className="card">🏫 Polling Booth: Govt School</div>
            </div>

            <div className="dashboard-row">
              <div className="dashboard-box">
                <h3>Live Voter Turnout</h3>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: "68%" }}
                  ></div>
                </div>
                <p>68% Citizens Voted</p>
              </div>

              <div className="dashboard-box">
                <h3>Quick Actions</h3>
                <button onClick={() => setActiveSection("report")}>
                  Report Issue
                </button>
                <button onClick={() => setActiveSection("status")}>
                  Check Status
                </button>

                {/* ✅ Also added here (optional but useful) */}
                <button onClick={openApplicationForm}>
                  Open Application Form
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h3>Recent Activity</h3>
              <ul className="activity-list">
                <li>🟢 Your report is under review</li>
                <li>📢 Election date announced</li>
                <li>🔔 Transparency score updated</li>
              </ul>
            </div>

            <div className="countdown-box">
              <h3>Election Countdown</h3>
              <h1>15 Days Left</h1>
              <p>Election Date: 25 April 2026</p>
            </div>

          </div>
        )}

        {/* ================= REPORT ISSUE ================= */}
        {activeSection === "report" && (
          <div className="section-box">
            <h2>Report Election Issue</h2>
            <form className="report-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Issue Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Issue Type</option>
                <option>EVM Problem</option>
                <option>Booth Problem</option>
                <option>Voter List Issue</option>
                <option>Illegal Activity</option>
              </select>

              <textarea
                name="description"
                rows="4"
                placeholder="Describe the issue"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <button type="submit">Submit Issue</button>
            </form>
          </div>
        )}

        {/* ================= PROFILE ================= */}
        {activeSection === "profile" && (
          <div className="section-box">
            <h2>My Profile</h2>
            <p><strong>Name:</strong> {currentUser?.fullName}</p>
            <p><strong>Email:</strong> {currentUser?.email}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default CitizenDashboard;