import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import "./AnalyticsSummary.css";

function AnalyticsSummary() {

  /* ================= LOAD DATA (MEMOIZED) ================= */

  const users = useMemo(() => {
    return JSON.parse(localStorage.getItem("users")) || [];
  }, []);

  const reports = useMemo(() => {
    return JSON.parse(localStorage.getItem("reports")) || [];
  }, []);

  /* ================= VOTER PARTICIPATION ================= */

  const totalCitizens = users.filter(u => u.role === "citizen").length;
  const votedCitizens = users.filter(u => u.hasVoted).length;

  const participation =
    totalCitizens === 0
      ? 0
      : ((votedCitizens / totalCitizens) * 100).toFixed(1);

  /* ================= COMPLAINT TREND ================= */

  const trendData = useMemo(() => {
    const grouped = {};

    reports.forEach(report => {
      const date = report.date || "Unknown";
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.keys(grouped).map(date => ({
      date,
      complaints: grouped[date]
    }));
  }, [reports]);

  /* ================= HEATMAP DATA ================= */

  const issueCategories = useMemo(() => {
    const categories = {};
    reports.forEach(r => {
      const type = r.category || "General";
      categories[type] = (categories[type] || 0) + 1;
    });
    return categories;
  }, [reports]);

  /* ================= DOWNLOAD CSV ================= */

  const downloadCSV = () => {
    const headers = ["Title", "Description", "Status", "Date"];
    const rows = reports.map(r =>
      [r.title, r.description, r.status, r.date].join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="analytics-summary">

      <h2>Analytics Summary</h2>

      {/* PARTICIPATION */}
      <div className="analytics-card">
        <h3>Voter Participation</h3>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${participation}%` }}
          >
            {participation}%
          </div>
        </div>
      </div>

      {/* TREND */}
      <div className="analytics-card">
        <h3>Complaint Trends</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="complaints" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* HEATMAP */}
      <div className="analytics-card">
        <h3>Heatmap of Issues</h3>

        <div className="heatmap">
          {Object.keys(issueCategories).length === 0 ? (
            <p>No Data Available</p>
          ) : (
            Object.keys(issueCategories).map((key, index) => (
              <div
                key={index}
                className="heatmap-box"
                style={{
                  background: `rgba(255,0,0,${
                    issueCategories[key] / 10
                  })`
                }}
              >
                {key} ({issueCategories[key]})
              </div>
            ))
          )}
        </div>
      </div>

      {/* DOWNLOAD */}
      <div className="analytics-card">
        <h3>Download Reports</h3>
        <button className="download-btn" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>

    </div>
  );
}

export default AnalyticsSummary;