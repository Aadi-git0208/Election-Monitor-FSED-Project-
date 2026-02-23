import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  // 🔥 Load citizens into state (important for live updates)
  const [citizens, setCitizens] = useState(
    JSON.parse(localStorage.getItem("citizens")) || []
  );

  // 🔥 Stats
  const total = citizens.length;
  const approved = citizens.filter(c => c.status === "Approved").length;
  const pending = citizens.filter(c => c.status === "Pending").length;

  // 🔥 Action Handlers
  const handleApprove = (index) => {
    const updated = [...citizens];
    updated[index].status = "Approved";
    setCitizens(updated);
    localStorage.setItem("citizens", JSON.stringify(updated));
  };

  const handleReject = (index) => {
    const updated = [...citizens];
    updated[index].status = "Rejected";
    setCitizens(updated);
    localStorage.setItem("citizens", JSON.stringify(updated));
  };

  const handleDelete = (index) => {
    const updated = [...citizens];
    updated.splice(index, 1);
    setCitizens(updated);
    localStorage.setItem("citizens", JSON.stringify(updated));
  };

  return (
    <div className="admin-container">

      {/* 🔹 Profile Top Right */}
      <div className="admin-topbar">
        <div className="admin-profile">
          <img
            src={currentUser?.profileImage || "https://i.pravatar.cc/100?img=5"}
            alt="Admin"
            className="admin-profile-img"
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div className="admin-dropdown">
              <p><strong>{currentUser?.fullName}</strong></p>
              <p>{currentUser?.email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <h1>Admin Dashboard 👨‍💼</h1>

      {/* 🔥 Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">Total Requests: {total}</div>
        <div className="stat-card approved">Approved: {approved}</div>
        <div className="stat-card pending">Pending: {pending}</div>
      </div>

      {/* 🔥 Requests Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Constituency</th>
            <th>Booth</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {citizens.length === 0 ? (
            <tr>
              <td colSpan="6">No verification requests found.</td>
            </tr>
          ) : (
            citizens.map((citizen, index) => (
              <tr key={index}>
                <td>{citizen.fullName}</td>
                <td>{citizen.userEmail}</td>
                <td>{citizen.constituency}</td>
                <td>{citizen.booth}</td>

                <td>
                  <span
                    className={
                      citizen.status === "Approved"
                        ? "status-approved"
                        : citizen.status === "Pending"
                        ? "status-pending"
                        : "status-rejected"
                    }
                  >
                    {citizen.status}
                  </span>
                </td>

                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(index)}
                    disabled={citizen.status === "Approved"}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(index)}
                    disabled={citizen.status === "Rejected"}
                  >
                    Reject
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboard;