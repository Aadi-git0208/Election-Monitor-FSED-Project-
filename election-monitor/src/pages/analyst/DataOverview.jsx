import React, { useCallback, useEffect, useState } from "react";
import "./DataOverview.css";

const normalizeListResponse = (payload, listKey) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && Array.isArray(payload[listKey])) {
    return payload[listKey];
  }

  return [];
};

const getReportDateKey = (report) => {
  const rawDate =
    report?.date ||
    report?.createdAt ||
    report?.reportDate ||
    report?.submittedAt ||
    report?.timestamp;

  if (!rawDate) return null;

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().split("T")[0];
};

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

  const fetchOverviewData = useCallback(async () => {
    try {
      const [reportsRes, electionsRes] = await Promise.allSettled([
        fetch("http://localhost:8080/api/reports/all"),
        fetch("http://localhost:8080/api/elections/all"),
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

      // Calculate report statistics
      setReportStats({
        total: reports.length,
        pending: reports.filter((item) => item.status === "Pending").length,
        assigned: reports.filter((item) => item.status === "Assigned").length,
        resolved: reports.filter((item) => item.status === "Resolved").length,
        rejected: reports.filter((item) => item.status === "Rejected").length,
      });

      // Calculate election statistics
      setElectionStats({
        total: elections.length,
        active: elections.filter((item) => item.active).length,
        inactive: elections.filter((item) => !item.active).length,
      });

      // Calculate reports per day
      const groupedByDate = reports.reduce((acc, report) => {
        const dateKey = getReportDateKey(report);
        if (dateKey) {
          acc[dateKey] = (acc[dateKey] || 0) + 1;
        }
        return acc;
      }, {});

      setReportsPerDay(
        Object.keys(groupedByDate)
          .sort()
          .map((date) => ({
            date,
            count: groupedByDate[date],
          }))
      );
    } catch (error) {
      console.error("Error fetching overview data:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchOverviewData();
    })();

    const interval = setInterval(fetchOverviewData, 10000); // auto refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchOverviewData]);

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