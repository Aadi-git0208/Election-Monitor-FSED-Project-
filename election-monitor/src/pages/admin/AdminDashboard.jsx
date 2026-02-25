import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import UserManagement from "./UserManagement";
import ElectionManagement from "./ElectionManagement";
import ReportManagement from "./ReportManagement";
import SecurityPanel from "./SecurityPanel";
import AnalyticsSummary from "./AnalyticsSummary";
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

function AdminDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [data, setData] = useState({
    totalCitizens: 0,
    totalObservers: 0,
    totalReports: 0,
    totalElections: 0,
    reportsData: [],
  });

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  useEffect(() => {
    const loadData = () => {
      const systemData =
        JSON.parse(localStorage.getItem("electionSystem")) || {
          users: [],
          elections: [],
          reports: [],
          notifications: [],
        };

      const users = systemData.users || [];
      const reports = systemData.reports || [];
      const elections = systemData.elections || [];

      const citizens = users.filter((u) => u.role === "citizen");
      const observers = users.filter((u) => u.role === "observer");

      setData({
        totalCitizens: citizens.length,
        totalObservers: observers.length,
        totalReports: reports.length,
        totalElections: elections.length,
        reportsData: reports,
      });
    };

    loadData();

    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

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
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="admin-layout">

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

      <div className="admin-body">

        <div className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <ul>

            <li
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard Overview
            </li>

            <li
              className={activeSection === "users" ? "active" : ""}
              onClick={() => setActiveSection("users")}
            >
              User Management
            </li>

            <li
              className={activeSection === "elections" ? "active" : ""}
              onClick={() => setActiveSection("elections")}
            >
              Election Management
            </li>

            <li
              className={activeSection === "reports" ? "active" : ""}
              onClick={() => setActiveSection("reports")}
            >
              Report Management
            </li>

            <li
              className={activeSection === "security" ? "active" : ""}
              onClick={() => setActiveSection("security")}
            >
              Security Panel
            </li>

            <li
              className={activeSection === "analytics" ? "active" : ""}
              onClick={() => setActiveSection("analytics")}
            >
              Analytics Summary
            </li>

          </ul>
        </div>

        <div className={`admin-container ${sidebarOpen ? "shift" : ""}`}>

          {activeSection === "dashboard" && (
            <>
              <h1>WELCOME TO THE ADMIN PAGE</h1>

              <div className="card-container">

                <div className="card">
                  <h3>Total Registered Citizens</h3>
                  <h2>{data.totalCitizens}</h2>
                </div>

                <div className="card">
                  <h3>Total Observers</h3>
                  <h2>{data.totalObservers}</h2>
                </div>

                <div className="card">
                  <h3>Total Reports Submitted</h3>
                  <h2>{data.totalReports}</h2>
                </div>

                <div className="card">
                  <h3>Total Ongoing Elections</h3>
                  <h2>{data.totalElections}</h2>
                </div>

              </div>

              <div className="graph-section">

                <div className="graph-card">
                  <h3>Graph: Reports per Day</h3>
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
                  <h3>Graph: Active Users</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
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
    </div>
  );
}

export default AdminDashboard;