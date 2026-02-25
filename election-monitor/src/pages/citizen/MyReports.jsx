import React, { useEffect, useState } from "react";
import "./MyReports.css";

function MyReports() {
  const [reports, setReports] = useState([]);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    null;

  useEffect(() => {
    const loadReports = () => {
      const systemData =
        JSON.parse(localStorage.getItem("electionSystem")) || {
          users: [],
          elections: [],
          reports: [],
          notifications: [],
        };

      if (!currentUser) {
        setReports([]);
        return;
      }

      const userReports = (systemData.reports || []).filter(
        (report) =>
          report.userId === currentUser.id ||
          report.email === currentUser.email
      );

      setReports(userReports);
    };

    loadReports();

    const interval = setInterval(loadReports, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const getStatusClass = (status) => {
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