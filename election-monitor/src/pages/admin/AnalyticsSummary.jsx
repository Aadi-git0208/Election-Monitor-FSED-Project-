import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./AnalyticsSummary.css";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Assigned: "#2563eb",
  Resolved: "#16a34a",
  Rejected: "#dc2626",
};

const PIE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

function AnalyticsSummary() {

  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [elections, setElections] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshPulse, setRefreshPulse] = useState(false);

  const [insightDraft, setInsightDraft] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  // 🔥 FETCH DATA FROM BACKEND
  const fetchData = useCallback(async () => {
    try {
      const [r, u, e] = await Promise.all([
        fetch("http://localhost:8080/api/reports/all"),
        fetch("http://localhost:8080/api/users/all"),
        fetch("http://localhost:8080/api/elections/all"),
      ]);

      const reportsData = await r.json();
      const usersData = await u.json();
      const electionsData = await e.json();

      setReports(reportsData);
      setUsers(usersData);
      setElections(electionsData);

      setLastUpdated(new Date());

    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const kickoff = setTimeout(() => {
      void fetchData();
    }, 0);

    const interval = setInterval(fetchData, 3000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, [fetchData]);

  useEffect(() => {
    if (!savedMessage) return;
    const timeout = setTimeout(() => setSavedMessage(""), 2000);
    return () => clearTimeout(timeout);
  }, [savedMessage]);

  // 🔥 SUMMARY CALCULATION (SAME UI LOGIC)
  const summary = useMemo(() => {

    const citizens = users.filter((u) => u.role === "CITIZEN");

    const pending = reports.filter((r) => r.status === "Pending").length;
    const assigned = reports.filter((r) => r.status === "Assigned").length;
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    const rejected = reports.filter((r) => r.status === "Rejected").length;

    return {
      totalReports: reports.length,
      pending,
      assigned,
      resolved,
      rejected,
      openLoad: pending + assigned,
      activeElections: elections.filter((e) => e.active).length,
      totalCitizens: citizens.length,
      participation: 0,
      verificationRate:
        reports.length === 0
          ? 0
          : Math.round(((resolved + rejected) / reports.length) * 100),
    };

  }, [reports, users, elections]);

  // 🔥 BAR DATA
  const trendData = useMemo(() => {
    const map = {};

    reports.forEach((r) => {
      const date = r.date || r.createdAt || "Unknown";
      map[date] = (map[date] || 0) + 1;
    });

    return Object.keys(map).map((date) => ({
      date,
      reports: map[date],
    }));

  }, [reports]);

  // 🔥 PIE DATA
  const statusData = [
    { name: "Pending", value: summary.pending },
    { name: "Assigned", value: summary.assigned },
    { name: "Resolved", value: summary.resolved },
    { name: "Rejected", value: summary.rejected },
  ];

  const onRefreshSummary = () => {
    void fetchData();
    setRefreshPulse(true);
    setTimeout(() => setRefreshPulse(false), 500);
  };

  const onSaveInsights = () => {
    setSavedMessage("Insights updated");
  };

  return (
    <div className="analytics-summary">

      <div className="analytics-summary-header">
        <div>
          <h2>Analytics Summary</h2>
          <p>Last synced: {lastUpdated.toLocaleTimeString()}</p>
        </div>

        <div className="analytics-actions">
          <button
            className={`refresh-btn ${refreshPulse ? "pulse" : ""}`}
            onClick={onRefreshSummary}
          >
            Update Summary
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <h4>Total Reports</h4>
          <p>{summary.totalReports}</p>
        </div>

        <div className="analytics-kpi-card">
          <h4>Verification Rate</h4>
          <p>{summary.verificationRate}%</p>
        </div>

        <div className="analytics-kpi-card">
          <h4>Open Workload</h4>
          <p>{summary.openLoad}</p>
        </div>

        <div className="analytics-kpi-card">
          <h4>Active Elections</h4>
          <p>{summary.activeElections}</p>
        </div>
      </div>

      {/* GRAPH */}
      <div className="analytics-grid">

        <div className="analytics-card">
          <h3>Report Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reports" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" label>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="analytics-card">
        <h3>Admin Insights</h3>

        <textarea
          className="insights-textarea"
          value={insightDraft}
          onChange={(e) => setInsightDraft(e.target.value)}
        />

        <div className="insights-actions">
          <button className="save-btn" onClick={onSaveInsights}>
            Save Insight
          </button>
          {savedMessage && <span>{savedMessage}</span>}
        </div>
      </div>

    </div>
  );
}

export default AnalyticsSummary;