import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./AnalystDashboard.css";

const normalizeListResponse = (payload, listKey) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && Array.isArray(payload[listKey])) {
    return payload[listKey];
  }

  return [];
};

const AnalystDashboard = () => {
  const [systemData, setSystemData] = useState({
    reports: [],
    elections: [],
  });

  const fetchAnalystData = useCallback(async () => {
    try {
      const [reportsRes, electionsRes] = await Promise.allSettled([
        fetch("https://your-backend.up.railway.app/api/reports/all"),
        fetch("https://your-backend.up.railway.app/api/elections/all"),
      ]);

      let reports = [];
      let elections = [];

      if (reportsRes.status === "fulfilled") {
        const reportsPayload = await reportsRes.value.json();
        reports = normalizeListResponse(reportsPayload, "reports");
      }

      if (electionsRes.status === "fulfilled") {
        const electionsPayload = await electionsRes.value.json();
        elections = normalizeListResponse(electionsPayload, "elections");
      }

      setSystemData({
        reports,
        elections,
      });
    } catch (error) {
      console.error("Error fetching analyst data:", error);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    (async () => {
      await fetchAnalystData();
    })();
    
    // Set up interval
    const interval = setInterval(fetchAnalystData, 10000); // auto refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchAnalystData]);

  const reports = systemData.reports;
  const elections = systemData.elections;

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