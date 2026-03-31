import React, { useEffect, useState } from "react";
import "./ReportManagement.css";

function ReportManagement() {

  const [reports, setReports] = useState([]);
  const [observers, setObservers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ FETCH REPORTS + USERS (observers)
  useEffect(() => {
    fetch("http://localhost:8080/api/reports")
      .then(res => res.json())
      .then(data => setReports(data));

    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(users => {
        const activeObservers = users.filter(
          (u) => u.role === "observer" && !u.blocked
        );
        setObservers(activeObservers);
      });
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