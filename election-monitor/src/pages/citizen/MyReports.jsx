import React, { useEffect, useMemo, useState } from "react";
import "./MyReports.css";

const readStoredJson = (storage, key, fallback) => {
  const raw = storage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    storage.removeItem(key);
    return fallback;
  }
};

const getSystemData = () => {
  const parsed = readStoredJson(localStorage, "electionSystem", null);

  if (!parsed || typeof parsed !== "object") {
    return {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    };
  }

  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    elections: Array.isArray(parsed.elections) ? parsed.elections : [],
    reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
  };
};

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").trim();
const USER_REPORTS_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/$/, "")}/api/reports/user`
  : "";

function MyReports() {
  const [apiReports, setApiReports] = useState(null);
  const [apiFailed, setApiFailed] = useState(false);

  const currentUser =
    readStoredJson(localStorage, "currentUser", null) ||
    readStoredJson(sessionStorage, "currentUser", null) ||
    null;

  const userEmail = String(currentUser?.email || "").trim().toLowerCase();

  const localReports = useMemo(() => {
    if (!userEmail) {
      return [];
    }

    const systemData = getSystemData();
    const allReports = Array.isArray(systemData.reports) ? systemData.reports : [];

    return allReports.filter((report) => {
      const reportEmail = String(report?.email || "").trim().toLowerCase();
      return reportEmail === userEmail;
    });
  }, [userEmail]);

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    if (!userEmail || !USER_REPORTS_ENDPOINT) {
      return;
    }

    let cancelled = false;

    fetch(`${USER_REPORTS_ENDPOINT}/${encodeURIComponent(userEmail)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("API request failed"))))
      .then((data) => {
        if (cancelled) {
          return;
        }

        setApiReports(Array.isArray(data) ? data : []);
        setApiFailed(false);
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }

        console.error(err);
        setApiFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [userEmail]);

  const reports =
    USER_REPORTS_ENDPOINT && !apiFailed && Array.isArray(apiReports)
      ? apiReports
      : localReports;

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