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

const readStoredJson = (storage, key, fallback) => {
  const raw = storage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    storage.removeItem(key);
    return fallback;
  }
};

const getSystemData = () => {
  const parsed = readStoredJson(localStorage, "electionSystem", null);

  if (!parsed || typeof parsed !== "object") {
    return {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    };
  }

  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    elections: Array.isArray(parsed.elections) ? parsed.elections : [],
    reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
  };
};

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").trim();
const USERS_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/$/, "")}/api/users`
  : "";
const REPORTS_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/$/, "")}/api/reports`
  : "";
const ELECTIONS_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/$/, "")}/api/elections`
  : "";

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
    observerSubmissions: [],
  });

  const currentUser =
    readStoredJson(localStorage, "currentUser", null) ||
    readStoredJson(sessionStorage, "currentUser", null);

  // ✅ BACKEND DATA LOAD
  const loadData = useCallback(async () => {
    try {
      let users = [];
      let reports = [];
      let elections = [];

      if (USERS_ENDPOINT && REPORTS_ENDPOINT && ELECTIONS_ENDPOINT) {
        const [usersRes, reportsRes, electionsRes] = await Promise.all([
          fetch(USERS_ENDPOINT),
          fetch(REPORTS_ENDPOINT),
          fetch(ELECTIONS_ENDPOINT),
        ]);

        if (!usersRes.ok || !reportsRes.ok || !electionsRes.ok) {
          throw new Error("Dashboard API request failed");
        }

        users = await usersRes.json();
        reports = await reportsRes.json();
        elections = await electionsRes.json();
      } else {
        const localData = getSystemData();
        users = localData.users;
        reports = localData.reports;
        elections = localData.elections;
      }

      const safeUsers = Array.isArray(users) ? users : [];
      const safeReports = Array.isArray(reports) ? reports : [];
      const safeElections = Array.isArray(elections) ? elections : [];

      const observerSubmissions =
        readStoredJson(localStorage, "observer_submissions", []);

      const citizens = safeUsers.filter((u) => u.role === "citizen");
      const observers = safeUsers.filter((u) => u.role === "observer");
      const adminUsers = safeUsers.filter((u) => u.role === "admin");
      const analysts = safeUsers.filter((u) => u.role === "analyst");

      setData({
        totalCitizens: citizens.length,
        totalObservers: observers.length,
        totalAdmin: adminUsers.length,
        totalAnalysts: analysts.length,
        totalReports: safeReports.length,
        totalElections: safeElections.length,
        reportsData: safeReports,
        observerSubmissions,
      });

    } catch (error) {
      console.error("Error loading dashboard data, using local fallback:", error);

      const localData = getSystemData();
      const observerSubmissions =
        readStoredJson(localStorage, "observer_submissions", []);

      const citizens = localData.users.filter((u) => u.role === "citizen");
      const observers = localData.users.filter((u) => u.role === "observer");
      const adminUsers = localData.users.filter((u) => u.role === "admin");
      const analysts = localData.users.filter((u) => u.role === "analyst");

      setData({
        totalCitizens: citizens.length,
        totalObservers: observers.length,
        totalAdmin: adminUsers.length,
        totalAnalysts: analysts.length,
        totalReports: localData.reports.length,
        totalElections: localData.elections.length,
        reportsData: localData.reports,
        observerSubmissions,
      });
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

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

      <div className="admin-body">

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