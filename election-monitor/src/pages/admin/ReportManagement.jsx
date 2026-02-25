import React, { useState } from "react";
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

  const [reports, setReports] = useState(() => {
    const systemData = getSystemData();
    return systemData.reports || [];
  });

  const [filterStatus, setFilterStatus] = useState("all");

  const updateStorage = (updatedReports) => {
    const systemData = getSystemData();
    systemData.reports = updatedReports;

    localStorage.setItem(
      "electionSystem",
      JSON.stringify(systemData)
    );

    setReports(updatedReports);
  };

  const changeStatus = (id, status) => {
    const updated = reports.map((report) =>
      report.id === id
        ? { ...report, status }
        : report
    );
    updateStorage(updated);
  };

  const assignObserver = (id, observerName) => {
    const updated = reports.map((report) =>
      report.id === id
        ? { ...report, assignedTo: observerName }
        : report
    );
    updateStorage(updated);
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

      <div className="report-controls">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Reports</option>
          <option value="Pending">Pending</option>
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
              <th>Actions</th>
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
                    <input
                      type="text"
                      placeholder="Observer name"
                      defaultValue={report.assignedTo || ""}
                      onBlur={(e) =>
                        assignObserver(report.id, e.target.value)
                      }
                    />
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
                    <button
                      className="resolve-btn"
                      onClick={() => changeStatus(report.id, "Resolved")}
                    >
                      Resolve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => changeStatus(report.id, "Rejected")}
                    >
                      Reject
                    </button>
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