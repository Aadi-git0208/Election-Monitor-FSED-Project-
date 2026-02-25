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

  // ✅ FIXED FUNCTION
  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    setDiscussion([
      ...discussion,
      { user: currentUser?.fullName || "Citizen", text: comment }
    ]);

    setComment("");
  };

  const myReports = reports.filter(
    (r) => r.userEmail === currentUser?.email
  );

  const myReportsCount = myReports.length;

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
          <li onClick={openApplicationForm}>Application Form</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">
          Welcome {currentUser?.fullName || "Citizen"} 👋
        </div>

        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <div className="dashboard-wrapper">
            <div className="cards">
              <div className="card">🗳 Election Active</div>
              <div className="card">📄 My Reports: {myReportsCount}</div>
              <div className="card">📊 Transparency Score: 92%</div>
              <div className="card">🏫 Polling Booth: Govt School</div>
            </div>
          </div>
        )}

        {/* REPORT ISSUE */}
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

        {/* MY REPORTS */}
        {activeSection === "reports" && (
          <div className="section-box">
            <h2>My Reports</h2>
            {myReports.length === 0 ? (
              <p>No reports submitted yet.</p>
            ) : (
              myReports.map((report, index) => (
                <div key={index} className="report-card">
                  <h3>{report.title}</h3>
                  <p><strong>Type:</strong> {report.type}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                  <p><strong>Date:</strong> {report.date}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* DISCUSSION */}
        {activeSection === "discussion" && (
          <div className="section-box">
            <h2>Public Discussion</h2>

            <div className="discussion-list">
              {discussion.map((d, i) => (
                <p key={i}><strong>{d.user}:</strong> {d.text}</p>
              ))}
            </div>

            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Post</button>
          </div>
        )}

        {/* PROFILE */}
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