import React, { useCallback, useEffect, useState } from "react";
import "./MyReports.css";
import API from "../../api/config";
function MyReports() {

  const [reports, setReports] = useState([]);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    null;

  const userEmail = String(currentUser?.email || "").trim().toLowerCase();

  // 🔥 FETCH FROM BACKEND (ONLY CHANGE)
  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/reports/all`);
      const data = await res.json();

      const filtered = Array.isArray(data)
        ? data.filter((report) => {
            const reportEmail = String(report?.email || "")
              .trim()
              .toLowerCase();
            return reportEmail === userEmail;
          })
        : [];

      setReports(filtered);

    } catch (err) {
      console.error("Error:", err);
    }
  }, [userEmail]);

  useEffect(() => {
    const kickoff = setTimeout(() => {
      void fetchReports();
    }, 0);

    const interval = setInterval(fetchReports, 3000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, [fetchReports]);

  const getStatusClass = (status) => {
    if (status === "Assigned") return "status assigned";
    if (status === "Resolved") return "status resolved";
    if (status === "Rejected") return "status rejected";
    return "status pending";
  };

  return (
    <div className="myreports-container">
      <h2>My Submitted Reports</h2>

      {reports.length === 0 ? (
        <div className="no-reports">
          You have not submitted any reports yet.
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="report-card">

            <div className="report-header">
              <h3>{report.title}</h3>
              <span className={getStatusClass(report.status)}>
                {report.status || "Pending"}
              </span>
            </div>

            <p className="report-description">
              {report.description}
            </p>

            {report.image && (
              <img
                src={report.image}
                alt="evidence"
                className="report-image"
              />
            )}

            {report.location && (
              <p className="report-location">
                📍 {report.location}
              </p>
            )}

            <div className="admin-response">
              <strong>Admin Response:</strong>{" "}
              {report.adminComment || "No response yet"}
            </div>

            {report.observerActionBy && (
              <div className="admin-response">
                <strong>Observer Update:</strong> {report.observerActionBy}
                {report.observerActionAt
                  ? ` (${report.observerActionAt})`
                  : ""}
              </div>
            )}

            {report.observerNote && (
              <div className="admin-response">
                <strong>Observer Note:</strong> {report.observerNote}
              </div>
            )}

            <div className="report-date">
              <strong>Date Submitted:</strong>{" "}
              {report.date || "N/A"}
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default MyReports;