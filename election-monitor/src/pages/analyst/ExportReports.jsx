import React, { useEffect, useMemo, useState } from "react";
import "./ExportReports.css";

const ExportReports = () => {
  const [message, setMessage] = useState("");
  const [systemData, setSystemData] = useState({
    reports: [],
    elections: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reportsRes, electionsRes] = await Promise.all([
          fetch("http://localhost:8080/api/analyst/reports"),
          fetch("http://localhost:8080/api/analyst/elections"),
        ]);

        const reports = await reportsRes.json();
        const elections = await electionsRes.json();

        setSystemData({
          reports: reports || [],
          elections: elections || [],
        });
      } catch (error) {
        console.error("Error fetching export data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const reports = systemData.reports || [];
  const elections = systemData.elections || [];

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const reportSummary = useMemo(() => {
    const pending = reports.filter((report) => report.status === "Pending").length;
    const assigned = reports.filter((report) => report.status === "Assigned").length;
    const resolved = reports.filter((report) => report.status === "Resolved").length;
    const rejected = reports.filter((report) => report.status === "Rejected").length;

    return {
      pending,
      assigned,
      resolved,
      rejected,
    };
  }, [reports]);

  const triggerDownload = (fileName, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const exportReportsCSV = () => {
    if (reports.length === 0) {
      setMessage("No reports available to export.");
      return;
    }

    const header = "ID,Title,Status,Assigned To,Date,Location";
    const rows = reports.map((report) => {
      const line = [
        report.id,
        report.title || "",
        report.status || "Pending",
        report.assignedObserver || "", // 🔥 fixed field name
        report.date || "",
        report.location || "",
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",");

      return line;
    });

    triggerDownload("analyst-reports.csv", [header, ...rows].join("\n"), "text/csv");
    setMessage("Reports CSV exported successfully.");
  };

  const exportElectionsCSV = () => {
    if (elections.length === 0) {
      setMessage("No elections available to export.");
      return;
    }

    const header = "ID,Title,Start Date,End Date,Status";
    const rows = elections.map((election) => {
      return [
        election.id,
        election.title || "",
        election.startDate || "",
        election.endDate || "",
        election.active ? "Active" : "Inactive",
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",");
    });

    triggerDownload(
      "analyst-elections.csv",
      [header, ...rows].join("\n"),
      "text/csv"
    );
    setMessage("Elections CSV exported successfully.");
  };

  const submitInsightToAdmin = () => {
    const analystSubmissions =
      JSON.parse(localStorage.getItem("analyst_submissions")) || [];

    const nextId =
      analystSubmissions.length > 0
        ? Math.max(...analystSubmissions.map((entry) => Number(entry.id) || 0)) + 1
        : 1;

    const payload = {
      id: nextId,
      analyst: currentUser?.fullName || currentUser?.name || "Analyst",
      submittedAt: new Date().toISOString(),
      summary: {
        totalReports: reports.length,
        pending: reportSummary.pending,
        assigned: reportSummary.assigned,
        resolved: reportSummary.resolved,
        rejected: reportSummary.rejected,
        activeElections: elections.filter((election) => election.active).length,
      },
    };

    localStorage.setItem(
      "analyst_submissions",
      JSON.stringify([payload, ...analystSubmissions].slice(0, 100))
    );

    setMessage("Insight submitted to admin.");
  };

  return (
    <div className="export-container analyst-module-card">
      <h2>Export Reports</h2>

      <div className="export-actions">
        <button onClick={exportReportsCSV}>Export Reports CSV</button>
        <button onClick={exportElectionsCSV}>Export Elections CSV</button>
        <button onClick={submitInsightToAdmin}>Submit Insight to Admin</button>
      </div>

      <div className="export-summary">
        <p>Total Reports: {reports.length}</p>
        <p>Pending: {reportSummary.pending}</p>
        <p>Assigned: {reportSummary.assigned}</p>
        <p>Resolved: {reportSummary.resolved}</p>
        <p>Rejected: {reportSummary.rejected}</p>
      </div>

      {message && <p className="export-message">{message}</p>}
    </div>
  );
};

export default ExportReports;