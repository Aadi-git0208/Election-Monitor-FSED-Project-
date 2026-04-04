import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./ExportReports.css";

const normalizeListResponse = (payload, listKey) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && Array.isArray(payload[listKey])) {
    return payload[listKey];
  }

  return [];
};

const ExportReports = () => {
  const [message, setMessage] = useState("");
  const [systemData, setSystemData] = useState({
    reports: [],
    elections: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const fetchExportData = useCallback(async () => {
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

      setSystemData({
        reports: reports || [],
        elections: elections || [],
      });
    } catch (error) {
      console.error("Error fetching export data:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchExportData();
    })();

    const interval = setInterval(fetchExportData, 10000); // auto refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchExportData]);

  const reports = useMemo(
    () => (Array.isArray(systemData.reports) ? systemData.reports : []),
    [systemData.reports]
  );
  const elections = useMemo(
    () => (Array.isArray(systemData.elections) ? systemData.elections : []),
    [systemData.elections]
  );

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
        report.assignedObserver || "",
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

  const submitInsightToAdmin = async () => {
    setSubmitting(true);
    try {
      const payload = {
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

      const response = await fetch(
        "http://localhost:8080/api/analyst/submissions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit insight");
      }

      setMessage("Insight submitted to admin successfully.");
    } catch (error) {
      console.error("Error submitting insight:", error);
      setMessage("Failed to submit insight. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="export-container analyst-module-card">
      <h2>Export Reports</h2>

      <div className="export-actions">
        <button onClick={exportReportsCSV}>Export Reports CSV</button>
        <button onClick={exportElectionsCSV}>Export Elections CSV</button>
        <button onClick={submitInsightToAdmin} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Insight to Admin"}
        </button>
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