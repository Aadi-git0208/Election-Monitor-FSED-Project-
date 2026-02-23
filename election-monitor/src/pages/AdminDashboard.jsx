import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  /* ================== GET USER ================== */

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  /* ================== STATES (ALWAYS FIRST) ================== */

  const [electionStatus, setElectionStatus] = useState(() => {
    const saved = localStorage.getItem("electionStatus");
    return saved ? JSON.parse(saved) : false;
  });

  const [transparencyScore, setTransparencyScore] = useState(() => {
    return localStorage.getItem("transparencyScore") || "";
  });

  const [boothName, setBoothName] = useState("");

  const [booths, setBooths] = useState(() => {
    return JSON.parse(localStorage.getItem("booths")) || [];
  });

  const [users] = useState(() => {
    return JSON.parse(localStorage.getItem("users")) || [];
  });

  /* ================== ROUTE PROTECTION (AFTER HOOKS) ================== */

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to={`/${currentUser.role}-dashboard`} replace />;
  }

  /* ================== FUNCTIONS ================== */

  const toggleElection = () => {
    const newStatus = !electionStatus;
    setElectionStatus(newStatus);
    localStorage.setItem("electionStatus", JSON.stringify(newStatus));
  };

  const addBooth = () => {
    if (!boothName.trim()) {
      alert("Please enter booth name");
      return;
    }

    const updatedBooths = [...booths, boothName];
    setBooths(updatedBooths);
    localStorage.setItem("booths", JSON.stringify(updatedBooths));
    setBoothName("");
  };

  const updateTransparency = () => {
    if (!transparencyScore) {
      alert("Please enter transparency score");
      return;
    }

    localStorage.setItem("transparencyScore", transparencyScore);
  };

  /* ================== UI ================== */

  return (
    <div className="admin-container">
      <h1>Welcome {currentUser.name} 👋</h1>

      <div className="admin-section">
        <h3>Election Status</h3>
        <p>
          Current Status:{" "}
          {electionStatus ? "Active 🟢" : "Inactive 🔴"}
        </p>
        <button onClick={toggleElection}>
          {electionStatus ? "Deactivate" : "Activate"} Election
        </button>
      </div>

      <div className="admin-section">
        <h3>Transparency Score</h3>
        <input
          type="number"
          value={transparencyScore}
          onChange={(e) => setTransparencyScore(e.target.value)}
          placeholder="Enter Score"
        />
        <button onClick={updateTransparency}>
          Update Score
        </button>
      </div>

      <div className="admin-section">
        <h3>Add Polling Booth</h3>
        <input
          type="text"
          value={boothName}
          onChange={(e) => setBoothName(e.target.value)}
          placeholder="Enter Booth Name"
        />
        <button onClick={addBooth}>Add Booth</button>

        <div className="booth-list">
          {booths.map((booth, index) => (
            <p key={index}>• {booth}</p>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h3>Registered Users</h3>

        {users.length === 0 ? (
          <p>No users registered yet.</p>
        ) : (
          users.map((user, index) => (
            <div key={index} className="user-card">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Booth:</strong> {user.booth || "Not Assigned"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;