import React, { useEffect, useState } from "react";
import "./ReportManagement.css";

function ReportManagement() {

  const getSystemData = () => {
    return JSON.parse(localStorage.getItem("electionSystem")) || {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    };
  };

  const [reports, setReports] = useState([]);
  const [observers, setObservers] = useState([]);

  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const loadData = () => {
      const systemData = getSystemData();
      setReports(systemData.reports || []);

      const activeObservers = (systemData.users || []).filter(
        (user) => user.role === "observer" && !user.blocked
      );

      setObservers(activeObservers);
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateStorage = (updatedReports) => {
    const systemData = getSystemData();
    systemData.reports = updatedReports;

    localStorage.setItem(
      "electionSystem",
      JSON.stringify(systemData)
    );

    setReports(updatedReports);
  };

  const assignObserver = (id, observerEmail) => {
    const selectedObserver = observers.find(
      (observer) => observer.email === observerEmail
    );

    const updated = reports.map((report) =>
      report.id === id
        ? {
            ...report,
            assignedTo: selectedObserver?.fullName || "",
            assignedObserver: selectedObserver?.fullName || "",
            assignedObserverEmail: selectedObserver?.email || "",
            assignedObserverId: selectedObserver?.id || "",
            observerEmail: selectedObserver?.email || "",
            observerId: selectedObserver?.id || "",
            status: selectedObserver
              ? !report.status || report.status === "Pending"
                ? "Assigned"
                : report.status
              : report.status === "Assigned"
                ? "Pending"
                : report.status || "Pending",
          }
        : report
    );

    updateStorage(updated);
  };

  const getAssignedObserverEmail = (report) => {
    if (report.assignedObserverEmail) return report.assignedObserverEmail;
    if (report.observerEmail) return report.observerEmail;

    const normalizedAssigned = String(report.assignedTo || "")
      .trim()
      .toLowerCase();

    if (!normalizedAssigned) return "";

    const matchedObserver = observers.find((observer) => {
      const email = String(observer.email || "").trim().toLowerCase();
      const fullName = String(observer.fullName || "").trim().toLowerCase();
      return email === normalizedAssigned || fullName === normalizedAssigned;
    });

    return matchedObserver?.email || "";
  };

  const addComment = (id, comment) => {
    const updated = reports.map((report) =>
      report.id === id
        ? { ...report, adminComment: comment }
        : report
    );
    updateStorage(updated);
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
                      value={getAssignedObserverEmail(report)}
                      onChange={(e) => assignObserver(report.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {observers.map((observer) => (
                        <option key={observer.id || observer.email} value={observer.email}>
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
                    {getAssignedObserverEmail(report) ? "Assigned" : "Unassigned"}
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