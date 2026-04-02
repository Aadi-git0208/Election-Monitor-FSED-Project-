import React, { useCallback, useEffect, useState } from "react";
import "./AdminDashboard.css";
import UserManagement from "./UserManagement";
import ElectionManagement from "./ElectionManagement";
import ReportManagement from "./ReportManagement";
import SecurityPanel from "./SecurityPanel";
import AnalyticsSummary from "./AnalyticsSummary";
import ProfileUpdateModal from "../../components/common/ProfileUpdateModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const getUserImage = (user) => {
  return (
    user?.profileImage ||
    user?.profilePic ||
    user?.image ||
    user?.avatar ||
    "/default-profile.svg"
  );
};

function AdminDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [data, setData] = useState({
    totalCitizens: 0,
    totalObservers: 0,
    totalAdmin: 0,
    totalAnalysts: 0,
    totalReports: 0,
    totalElections: 0,
    reportsData: [],
  });

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  // 🔥 FETCH FROM BACKEND
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/dashboard");
      const backendData = await res.json();

      setData((prev) => ({
        ...prev,
        totalCitizens: backendData.totalCitizens,
        totalObservers: backendData.totalObservers,
        totalAdmin: backendData.totalAdmin,
        totalAnalysts: backendData.totalAnalysts,
        totalReports: backendData.totalReports,
        totalElections: backendData.totalElections,
        reportsData: [], // graph future
      }));

    } catch (err) {
      console.error("Error fetching dashboard:", err);
    }
  }, []);

  useEffect(() => {
    const kickoff = setTimeout(() => {
      void fetchDashboardData();
    }, 0);

    const interval = setInterval(fetchDashboardData, 5000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  // 🔥 GRAPH (UI same, data empty for now)
  const reportPerDay =
    data.reportsData?.reduce((acc, report) => {
      if (!report.date) return acc;
      acc[report.date] = (acc[report.date] || 0) + 1;
      return acc;
    }, {}) || {};

  const barData = Object.keys(reportPerDay).map((date) => ({
    date,
    reports: reportPerDay[date],
  }));

  const pieData = [
    { name: "Citizens", value: data.totalCitizens },
    { name: "Observers", value: data.totalObservers },
    { name: "Admin", value: data.totalAdmin },
    { name: "Analysts", value: data.totalAnalysts },
  ];

  const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F"];

  return (
    <div className="admin-layout">

      {/* NAVBAR */}
      <div className="admin-navbar">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h2>VOTEGUARD</h2>

        <div className="user-section">
          <img
            src={getUserImage(currentUser)}
            alt="profile"
            className="profile-pic"
          />

          <span className="admin-name">
            {currentUser?.fullName || "Admin"}
          </span>

          <button
            className="admin-profile-update-btn"
            onClick={() => setShowProfileModal(true)}
          >
            Update Profile
          </button>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("currentUser");
              sessionStorage.removeItem("currentUser");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="admin-body">

        {/* SIDEBAR */}
        <div className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <ul>
            <li onClick={() => setActiveSection("dashboard")}>Dashboard Overview</li>
            <li onClick={() => setActiveSection("users")}>User Management</li>
            <li onClick={() => setActiveSection("elections")}>Election Management</li>
            <li onClick={() => setActiveSection("reports")}>Report Management</li>
            <li onClick={() => setActiveSection("security")}>Security Panel</li>
            <li onClick={() => setActiveSection("analytics")}>Analytics Summary</li>
          </ul>
        </div>

        {/* MAIN CONTENT */}
        <div className={`admin-container ${sidebarOpen ? "shift" : ""}`}>

          {activeSection === "dashboard" && (
            <>
              <h1>WELCOME TO THE ADMIN PAGE</h1>

              <div className="card-container">
                <div className="card"><h3>Citizens</h3><h2>{data.totalCitizens}</h2></div>
                <div className="card"><h3>Observers</h3><h2>{data.totalObservers}</h2></div>
                <div className="card"><h3>Reports</h3><h2>{data.totalReports}</h2></div>
                <div className="card"><h3>Elections</h3><h2>{data.totalElections}</h2></div>
              </div>

              {/* GRAPH SECTION (UI SAME) */}
              <div className="graph-section">

                <div className="graph-card">
                  <h3>Reports per Day</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reports" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="graph-card">
                  <h3>Active Users</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" label>
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </>
          )}

          {activeSection === "users" && <UserManagement />}
          {activeSection === "elections" && <ElectionManagement />}
          {activeSection === "reports" && <ReportManagement />}
          {activeSection === "security" && <SecurityPanel />}
          {activeSection === "analytics" && <AnalyticsSummary />}

        </div>
      </div>

      {showProfileModal && (
        <ProfileUpdateModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}

export default AdminDashboard;