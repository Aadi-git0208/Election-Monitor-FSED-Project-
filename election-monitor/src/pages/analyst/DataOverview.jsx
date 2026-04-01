import React, { useEffect, useState } from "react";
import "./DataOverview.css";

const DataOverview = () => {
  const [reportStats, setReportStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    resolved: 0,
    rejected: 0,
  });
  const [electionStats, setElectionStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [reportsPerDay, setReportsPerDay] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reportsRes, electionsRes] = await Promise.all([
          fetch("http://localhost:8080/api/analyst/reports"),
          fetch("http://localhost:8080/api/analyst/elections"),
        ]);

        const reports = await reportsRes.json();
        const elections = await electionsRes.json();

        // ===== SAME LOGIC (no change) =====
        setReportStats({
          total: reports.length,
          pending: reports.filter((item) => item.status === "Pending").length,
          assigned: reports.filter((item) => item.status === "Assigned").length,
          resolved: reports.filter((item) => item.status === "Resolved").length,
          rejected: reports.filter((item) => item.status === "Rejected").length,
        });

        setElectionStats({
          total: elections.length,
          active: elections.filter((item) => item.active).length,
          inactive: elections.filter((item) => !item.active).length,
        });

        const groupedByDate = reports.reduce((acc, report) => {
          const key = report.date || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        setReportsPerDay(
          Object.keys(groupedByDate).map((date) => ({
            date,
            count: groupedByDate[date],
          }))
        );
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overview-wrapper analyst-module-card">
      <h2>Data Overview</h2>

      <div className="overview-grid">
        <div className="overview-card">
          <h3>Total Reports</h3>
          <p>{reportStats.total}</p>
        </div>

        <div className="overview-card">
          <h3>Pending Reports</h3>
          <p>{reportStats.pending}</p>
        </div>

        <div className="overview-card">
          <h3>Assigned Reports</h3>
          <p>{reportStats.assigned}</p>
        </div>

        <div className="overview-card">
          <h3>Resolved Reports</h3>
          <p>{reportStats.resolved}</p>
        </div>

        <div className="overview-card">
          <h3>Rejected Reports</h3>
          <p>{reportStats.rejected}</p>
        </div>

        <div className="overview-card">
          <h3>Active Elections</h3>
          <p>{electionStats.active}</p>
        </div>
      </div>

      <div className="overview-breakdown">
        <div className="overview-breakdown-card">
          <h3>Election Breakdown</h3>
          <p>Total Elections: {electionStats.total}</p>
          <p>Active Elections: {electionStats.active}</p>
          <p>Inactive Elections: {electionStats.inactive}</p>
        </div>

        <div className="overview-breakdown-card">
          <h3>Reports Submitted By Date</h3>
          {reportsPerDay.length === 0 ? (
            <p>No report data available.</p>
          ) : (
            reportsPerDay.map((item) => (
              <p key={item.date}>
                {item.date}: {item.count}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DataOverview;