import React, { useEffect, useMemo, useState } from "react";
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

const PIE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0ea5e9"];

const getSystemData = () => {
  return (
    JSON.parse(localStorage.getItem("electionSystem")) || {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    }
  );
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getReportDate = (report) => {
  return (
    parseDate(report.date) ||
    parseDate(report.createdAt) ||
    parseDate(report.submittedAt) ||
    parseDate(report.updatedAt)
  );
};

const toCsvValue = (value) => {
  const normalized = String(value ?? "").replace(/"/g, '""');
  return `"${normalized}"`;
};

function AnalyticsSummary() {
  const [systemData, setSystemData] = useState(getSystemData());
  const [observerSubmissions, setObserverSubmissions] = useState([]);
  const [analystSubmissions, setAnalystSubmissions] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshPulse, setRefreshPulse] = useState(false);
  const [insightDraft, setInsightDraft] = useState(
    localStorage.getItem("admin_analytics_notes") || ""
  );
  const [savedMessage, setSavedMessage] = useState("");

  const loadAnalyticsData = () => {
    setSystemData(getSystemData());
    setObserverSubmissions(
      JSON.parse(localStorage.getItem("observer_submissions")) || []
    );
    setAnalystSubmissions(
      JSON.parse(localStorage.getItem("analyst_submissions")) || []
    );
    setLastUpdated(new Date());
  };

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadAnalyticsData, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!savedMessage) return undefined;
    const timeout = setTimeout(() => setSavedMessage(""), 2200);
    return () => clearTimeout(timeout);
  }, [savedMessage]);

  const users = systemData.users || [];
  const reports = systemData.reports || [];
  const elections = systemData.elections || [];

  const summary = useMemo(() => {
    const citizens = users.filter((user) => user.role === "citizen");
    const votedCitizens = citizens.filter((user) => user.hasVoted).length;
    const pending = reports.filter((report) => report.status === "Pending").length;
    const assigned = reports.filter((report) => report.status === "Assigned").length;
    const resolved = reports.filter((report) => report.status === "Resolved").length;
    const rejected = reports.filter((report) => report.status === "Rejected").length;
    const totalCitizens = citizens.length;

    return {
      totalReports: reports.length,
      pending,
      assigned,
      resolved,
      rejected,
      openLoad: pending + assigned,
      activeElections: elections.filter((election) => election.active).length,
      totalCitizens,
      votedCitizens,
      participation:
        totalCitizens === 0
          ? 0
          : Number(((votedCitizens / totalCitizens) * 100).toFixed(1)),
      verificationRate:
        reports.length === 0
          ? 0
          : Number((((resolved + rejected) / reports.length) * 100).toFixed(1)),
    };
  }, [users, reports, elections]);

  const trendData = useMemo(() => {
    const today = new Date();
    const dailyMap = {};

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      dailyMap[key] = {
        key,
        date: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        reports: 0,
      };
    }

    reports.forEach((report) => {
      const reportDate = getReportDate(report);
      if (!reportDate) return;

      const key = reportDate.toISOString().slice(0, 10);
      if (dailyMap[key]) {
        dailyMap[key].reports += 1;
      }
    });

    return Object.values(dailyMap);
  }, [reports]);

  const statusData = useMemo(() => {
    const counts = {
      Pending: 0,
      Assigned: 0,
      Resolved: 0,
      Rejected: 0,
      Other: 0,
    };

    reports.forEach((report) => {
      const status = report.status || "Pending";
      if (counts[status] === undefined) {
        counts.Other += 1;
      } else {
        counts[status] += 1;
      }
    });

    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [reports]);

  const issueCategories = useMemo(() => {
    const categories = {};
    reports.forEach((report) => {
      const type = report.category || "General";
      categories[type] = (categories[type] || 0) + 1;
    });

    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [reports]);

  const onRefreshSummary = () => {
    loadAnalyticsData();
    setRefreshPulse(true);
    setTimeout(() => setRefreshPulse(false), 500);
  };

  const onSaveInsights = () => {
    localStorage.setItem("admin_analytics_notes", insightDraft.trim());
    setSavedMessage("Insights updated");
  };

  const downloadCSV = () => {
    const headers = [
      "Report ID",
      "Title",
      "Category",
      "Status",
      "Assigned Observer",
      "Citizen",
      "Date",
    ];

    const rows = reports.map((report) => {
      const citizenName = report.citizenName || report.reportedBy || report.userName || "-";
      const date = report.date || report.createdAt || report.submittedAt || "-";

      return [
        toCsvValue(report.id || "-"),
        toCsvValue(report.title || "Untitled"),
        toCsvValue(report.category || "General"),
        toCsvValue(report.status || "Pending"),
        toCsvValue(report.assignedObserver || report.assignedTo || "Unassigned"),
        toCsvValue(citizenName),
        toCsvValue(date),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `analytics-summary-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-summary">
      <div className="analytics-summary-header">
        <div>
          <h2>Analytics Summary</h2>
          <p>
            Last synced: {lastUpdated.toLocaleTimeString("en-GB", { hour12: false })}
          </p>
        </div>

        <div className="analytics-actions">
          <button
            type="button"
            className={`refresh-btn ${refreshPulse ? "pulse" : ""}`}
            onClick={onRefreshSummary}
          >
            Update Summary
          </button>
          <button type="button" className="download-btn" onClick={downloadCSV}>
            Download CSV
          </button>
        </div>
      </div>

      <div className="analytics-kpi-grid">
        <article className="analytics-kpi-card">
          <h4>Total Reports</h4>
          <p>{summary.totalReports}</p>
        </article>

        <article className="analytics-kpi-card">
          <h4>Verification Rate</h4>
          <p>{summary.verificationRate}%</p>
        </article>

        <article className="analytics-kpi-card">
          <h4>Open Workload</h4>
          <p>{summary.openLoad}</p>
        </article>

        <article className="analytics-kpi-card">
          <h4>Active Elections</h4>
          <p>{summary.activeElections}</p>
        </article>

        <article className="analytics-kpi-card">
          <h4>Observer Submissions</h4>
          <p>{observerSubmissions.length}</p>
        </article>

        <article className="analytics-kpi-card">
          <h4>Analyst Submissions</h4>
          <p>{analystSubmissions.length}</p>
        </article>
      </div>

      <div className="analytics-card">
        <h3>Voter Participation</h3>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${summary.participation}%` }}
          >
            {summary.participation}%
          </div>
        </div>
        <p className="analytics-meta">
          {summary.votedCitizens} of {summary.totalCitizens} citizens have voted
        </p>
      </div>

      <div className="analytics-grid">
        <section className="analytics-card">
          <h3>Report Trend (Last 7 Days)</h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe5f3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="reports" fill="#1976d2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="analytics-card">
          <h3>Report Status Distribution</h3>

          {statusData.length === 0 ? (
            <p className="analytics-empty">No report status data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={92}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={STATUS_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>

      <div className="analytics-card">
        <h3>Complaint Trends</h3>
        <div className="trend-chips">
          <span className="trend-chip pending">Pending: {summary.pending}</span>
          <span className="trend-chip assigned">Assigned: {summary.assigned}</span>
          <span className="trend-chip resolved">Resolved: {summary.resolved}</span>
          <span className="trend-chip rejected">Rejected: {summary.rejected}</span>
        </div>
      </div>

      <div className="analytics-card">
        <h3>Heatmap of Issues</h3>

        <div className="heatmap">
          {issueCategories.length === 0 ? (
            <p className="analytics-empty">No data available</p>
          ) : (
            issueCategories.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="heatmap-box"
                style={{
                  background: `rgba(30, 64, 175, ${Math.min(0.22 + item.value / 10, 0.9)})`,
                }}
              >
                {item.name} ({item.value})
              </div>
            ))
          )}
        </div>
      </div>

      <div className="analytics-card">
        <h3>Admin Insights</h3>
        <p className="analytics-meta">
          Track policy notes or weekly summary comments. This can be updated anytime.
        </p>

        <textarea
          className="insights-textarea"
          rows={5}
          value={insightDraft}
          onChange={(event) => setInsightDraft(event.target.value)}
          placeholder="Write your latest analytics insight here..."
        />

        <div className="insights-actions">
          <button type="button" className="save-btn" onClick={onSaveInsights}>
            Save Insight Update
          </button>
          {savedMessage ? <span className="saved-message">{savedMessage}</span> : null}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsSummary;