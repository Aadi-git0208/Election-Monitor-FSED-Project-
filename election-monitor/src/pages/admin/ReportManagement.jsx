import React, { useEffect, useState } from "react";
import "./ReportManagement.css";

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
const REPORTS_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/$/, "")}/api/reports`
  : "";
const USERS_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/$/, "")}/api/users`
  : "";

function ReportManagement() {

  const [reports, setReports] = useState([]);
  const [observers, setObservers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let cancelled = false;

    const loadFromLocal = () => {
      const systemData = getSystemData();

      const localReports = Array.isArray(systemData.reports)
        ? systemData.reports
        : [];
      const localUsers = Array.isArray(systemData.users)
        ? systemData.users
        : [];

      const activeObservers = localUsers.filter(
        (u) => u?.role === "observer" && !u?.blocked
      );

      if (cancelled) {
        return;
      }

      setReports(localReports);
      setObservers(activeObservers);
    };

    const load = async () => {
      if (!REPORTS_ENDPOINT || !USERS_ENDPOINT) {
        loadFromLocal();
        return;
      }

      try {
        const [reportsRes, usersRes] = await Promise.all([
          fetch(REPORTS_ENDPOINT),
          fetch(USERS_ENDPOINT),
        ]);

        if (!reportsRes.ok || !usersRes.ok) {
          throw new Error("Failed to load admin report data");
        }

        const reportData = await reportsRes.json();
        const users = await usersRes.json();

        if (cancelled) {
          return;
        }

        const safeReports = Array.isArray(reportData) ? reportData : [];
        const safeUsers = Array.isArray(users) ? users : [];

        const activeObservers = safeUsers.filter(
          (u) => u?.role === "observer" && !u?.blocked
        );

        setReports(safeReports);
        setObservers(activeObservers);
      } catch (error) {
        console.error("Falling back to local reports/users:", error);
        loadFromLocal();
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ❗ ASSIGN OBSERVER (frontend only for now)
  const assignObserver = (id, observerEmail) => {
    const selectedObserver = observers.find(
      (observer) => observer.email === observerEmail
    );

    setReports(
      reports.map((report) =>
        report.id === id
          ? {
              ...report,
              assignedObserver: selectedObserver?.fullName || "",
              status: selectedObserver
                ? "Assigned"
                : "Pending",
            }
          : report
      )
    );
  };

  // ❗ COMMENT (frontend only)
  const addComment = (id, comment) => {
    setReports(
      reports.map((report) =>
        report.id === id
          ? { ...report, adminComment: comment }
          : report
      )
    );
  };

  const filteredReports =
    filterStatus === "all"
      ? reports
      : reports.filter((r) => r.status === filterStatus);

  return (
    <div className="report-management">

      <h2>Report Management</h2>
      <p className="observer-assignment-hint">
        Active Observers: {observers.length}
      </p>

      <div className="report-controls">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Reports</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="report-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Evidence</th>
              <th>Assign Observer</th>
              <th>Admin Comment</th>
              <th>Assignment</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No Reports Found
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.title}</td>
                  <td>{report.description}</td>

                  <td>
                    <span className={`status ${report.status}`}>
                      {report.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    {report.image ? (
                      report.image.includes("video") ? (
                        <video width="80" controls>
                          <source src={report.image} />
                        </video>
                      ) : (
                        <img
                          src={report.image}
                          alt="evidence"
                          className="evidence-img"
                        />
                      )
                    ) : (
                      "No File"
                    )}
                  </td>

                  <td>
                    <select
                      value={report.assignedObserver || ""}
                      onChange={(e) =>
                        assignObserver(report.id, e.target.value)
                      }
                    >
                      <option value="">Unassigned</option>
                      {observers.map((observer) => (
                        <option key={observer.id} value={observer.email}>
                          {observer.fullName} ({observer.email})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="text"
                      placeholder="Add comment"
                      defaultValue={report.adminComment || ""}
                      onBlur={(e) =>
                        addComment(report.id, e.target.value)
                      }
                    />
                  </td>

                  <td>
                    {report.assignedObserver ? "Assigned" : "Unassigned"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ReportManagement;