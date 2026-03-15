import React, { useEffect, useMemo, useState } from "react";
import "./AnalystDashboard.css";

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

const AnalystDashboard = () => {
  const [systemData, setSystemData] = useState(getSystemData());

  useEffect(() => {
    const loadData = () => setSystemData(getSystemData());

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const reports = systemData.reports || [];
  const elections = systemData.elections || [];

  const summary = useMemo(() => {
    const pending = reports.filter((report) => report.status === "Pending").length;
    const assigned = reports.filter((report) => report.status === "Assigned").length;
    const resolved = reports.filter((report) => report.status === "Resolved").length;
    const rejected = reports.filter((report) => report.status === "Rejected").length;

    const activeElections = elections.filter((election) => election.active).length;

    const resolutionRate =
      reports.length === 0 ? 0 : Math.round((resolved / reports.length) * 100);

    return {
      pending,
      assigned,
      resolved,
      rejected,
      activeElections,
      resolutionRate,
    };
  }, [reports, elections]);

  const latestReports = [...reports]
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    .slice(0, 6);

  return (
    <div className="analyst-dashboard-home">
      <h1>ANALYST OVERVIEW</h1>

      <div className="analyst-card-grid">
        <article className="analyst-summary-card">
          <h3>Total Reports</h3>
          <p>{reports.length}</p>
        </article>

        <article className="analyst-summary-card">
          <h3>Pending Reports</h3>
          <p>{summary.pending}</p>
        </article>

        <article className="analyst-summary-card">
          <h3>Assigned Reports</h3>
          <p>{summary.assigned}</p>
        </article>

        <article className="analyst-summary-card">
          <h3>Resolved Reports</h3>
          <p>{summary.resolved}</p>
        </article>

        <article className="analyst-summary-card">
          <h3>Rejected Reports</h3>
          <p>{summary.rejected}</p>
        </article>

        <article className="analyst-summary-card">
          <h3>Active Elections</h3>
          <p>{summary.activeElections}</p>
        </article>
      </div>

      <div className="analyst-home-panels">
        <section className="analyst-home-panel">
          <h3>Performance Snapshot</h3>
          <p>Resolution rate: {summary.resolutionRate}%</p>
          <p>Workload in progress: {summary.pending + summary.assigned}</p>
          <p>Total completed: {summary.resolved + summary.rejected}</p>
        </section>

        <section className="analyst-home-panel">
          <h3>Recent Reports</h3>

          {latestReports.length === 0 ? (
            <p>No reports available yet.</p>
          ) : (
            latestReports.map((report) => (
              <div key={report.id} className="analyst-home-row">
                <p>{report.title || "Untitled report"}</p>
                <span>{report.status || "Pending"}</span>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default AnalystDashboard;