import React, { useEffect, useState } from "react";

import "./ObserverDashboard.css";
import ProfileUpdateModal from "../../components/common/ProfileUpdateModal";
import API from "../../api/config";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const normalizeListResponse = (payload, listKey) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && Array.isArray(payload[listKey])) {
    return payload[listKey];
  }

  return [];
};

const splitToNormalizedItems = (value) => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item || "").split(","))
      .map((item) => normalizeText(item))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => normalizeText(item))
      .filter(Boolean);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    const normalized = normalizeText(value);
    return normalized ? [normalized] : [];
  }

  return [];
};

const matchesObserverAssignment = (value, aliases) => {
  const normalizedItems = splitToNormalizedItems(value);

  return normalizedItems.some((item) => {
    return aliases.some((alias) => {
      if (!alias) return false;

      if (item === alias) {
        return true;
      }

      if (alias.length > 2 && (item.includes(alias) || alias.includes(item))) {
        return true;
      }

      return false;
    });
  });
};

const getStatusBadge = (election) => {
  const statusText = normalizeText(election.status);

  if (statusText.includes("live") || statusText.includes("ongoing")) {
    return {
      label: "Live",
      className: "observer-badge observer-badge-live",
    };
  }

  if (statusText.includes("closed") || statusText.includes("completed")) {
    return {
      label: "Closed",
      className: "observer-badge observer-badge-closed",
    };
  }

  if (election.active === true) {
    return {
      label: "Live",
      className: "observer-badge observer-badge-live",
    };
  }

  return {
    label: "Review",
    className: "observer-badge observer-badge-review",
  };
};

function ObserverDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [elections, setElections] = useState([]);
  const [activity, setActivity] = useState([]);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const observerName = currentUser?.fullName || currentUser?.name || "Observer";
  const observerImage =
    currentUser?.profileImage ||
    currentUser?.profilePic ||
    currentUser?.image ||
    "/default-profile.svg";

  const observerAliases = [
    normalizeText(currentUser?.fullName || currentUser?.name),
    normalizeText((currentUser?.fullName || currentUser?.name || "").split(" ")[0]),
    normalizeText(currentUser?.email),
    normalizeText(currentUser?.id),
  ].filter(Boolean);
  const observerAliasesKey = observerAliases.join("|");

  useEffect(() => {
    if (!observerAliasesKey) {
      return;
    }

    const observerAliasesList = observerAliasesKey.split("|");

    let active = true;

    const loadObserverData = async () => {
      try {
        const [reportsRes, electionsRes] = await Promise.all([
          fetch(`${API}/api/reports/all`),
          fetch(`${API}/api/elections/all`),
        ]);

        const [reportsPayload, electionsPayload] = await Promise.all([
          reportsRes.json(),
          electionsRes.json(),
        ]);

        const allReports = normalizeListResponse(reportsPayload, "reports");
        const allElections = normalizeListResponse(electionsPayload, "elections");

        const assignedReports = allReports.filter((report) => {
          const assignmentCandidates = [
            report.assignedTo,
            report.assignedObserver,
            report.assignedObserverEmail,
            report.assignedObserverId,
            report.observerEmail,
            report.observerId,
          ];

          return assignmentCandidates.some((candidate) =>
            matchesObserverAssignment(candidate, observerAliasesList)
          );
        });

        const assignedElections = allElections.filter((election) => {
          const assignmentCandidates = [
            election.observers,
            election.assignedObservers,
            election.assignedTo,
            election.observerEmail,
            election.observerId,
            election.observer_id,
            election.assignedObserver,
            election.observer,
            election.assigned_observer_id,
            election.assigned_observer,
          ];

          return assignmentCandidates.some((candidate) =>
            matchesObserverAssignment(candidate, observerAliasesList)
          );
        });

        if (!active) return;

        setReports(assignedReports);
        setElections(assignedElections);
      } catch (err) {
        console.error("Error fetching observer dashboard data:", err);
      }
    };

    void loadObserverData();

    const interval = setInterval(loadObserverData, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [observerAliasesKey]);

  const addActivity = (message) => {
    setActivity((previous) => {
      const nextId =
        previous.length > 0
          ? Math.max(...previous.map((entry) => Number(entry.id) || 0)) + 1
          : 1;

      const next = [
        {
          id: nextId,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          message,
        },
        ...previous,
      ].slice(0, 30);
      return next;
    });
  };

    const refreshObserverData = async () => {
      try {
        const [reportsRes, electionsRes] = await Promise.all([
          fetch(`${API}/api/reports/all`),
          fetch(`${API}/api/elections/all`),
        ]);

        const [reportsPayload, electionsPayload] = await Promise.all([
          reportsRes.json(),
          electionsRes.json(),
        ]);

        const allReports = normalizeListResponse(reportsPayload, "reports");
        const allElections = normalizeListResponse(electionsPayload, "elections");

        setReports(
          allReports.filter((report) => {
            const assignmentCandidates = [
              report.assignedTo,
              report.assignedObserver,
              report.assignedObserverEmail,
              report.assignedObserverId,
              report.observerEmail,
              report.observerId,
            ];

            return assignmentCandidates.some((candidate) =>
              matchesObserverAssignment(candidate, observerAliases)
            );
          })
        );

        setElections(
          allElections.filter((election) => {
            const assignmentCandidates = [
              election.observers,
              election.assignedObservers,
              election.assignedTo,
              election.observerEmail,
              election.observerId,
              election.observer_id,
              election.assignedObserver,
              election.observer,
              election.assigned_observer_id,
              election.assigned_observer,
            ];

            return assignmentCandidates.some((candidate) =>
              matchesObserverAssignment(candidate, observerAliases)
            );
          })
        );
      } catch (err) {
        console.error("Error refreshing observer dashboard data:", err);
      }
    };

    const updateReportDecision = async (id, decision) => {
    const nextStatus = decision === "verified" ? "Resolved" : "Rejected";
      try {
        const params = new URLSearchParams({
          decision,
          observerName,
        });

        const response = await fetch(`${API}/api/reports/${id}/decision?${params.toString()}`, {
          method: "PUT",
        });

        if (!response.ok) {
          throw new Error(`Failed to update report decision (${response.status})`);
        }

        addActivity(`Report ${id} updated as ${nextStatus} by ${observerName}.`);
        await refreshObserverData();
      } catch (err) {
        console.error(err);
    }
  };

  const reviewReport = async (id) => {
    const note = prompt("Enter review note (optional)") || "";

    try {
      const params = new URLSearchParams({
        decision: "reviewed",
        note,
        observerNote: note,
        comment: note,
        observerName,
      });

      const response = await fetch(`${API}/api/reports/${id}/decision?${params.toString()}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`Failed to review report (${response.status})`);
      }

      addActivity(`Report ${id} marked for review by ${observerName}.`);
      await refreshObserverData();
    } catch (err) {
      console.error(err);
    }
  };

  const reviewElection = async (id) => {
    const note = prompt("Enter election review note (optional)") || "";

    try {
      addActivity(
        `Election ${id} reviewed${note ? `: ${note}` : ""} by ${observerName}.`
      );
      alert("Election review saved to activity log.");
    } catch (err) {
      console.error(err);
    }
  };

  const verifiedReports = reports.filter((report) => report.status === "Resolved").length;
  const rejectedReports = reports.filter((report) => report.status === "Rejected").length;

  const transparencyScore =
    reports.length === 0 ? 0 : Math.round((verifiedReports / reports.length) * 100);

  const dashboardSubtitle =
    elections.length > 0
      ? `${elections.length} election assignments active`
      : "No election assignments from admin yet";

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  const handleDownloadReport = () => {
    const reportText = [
      "Observer Monitoring Report",
      `Observer: ${observerName}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Assigned elections: ${elections.length}`,
      `Assigned reports: ${reports.length}`,
      `Resolved: ${verifiedReports}`,
      `Rejected: ${rejectedReports}`,
      "",
      "Reports:",
      ...reports.map(
        (report) =>
          `- ${report.title || "Untitled report"} | ${report.status || "Pending"}`
      ),
    ].join("\n");

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "observer-report.txt";
    link.click();
    URL.revokeObjectURL(url);

    addActivity("Observer report downloaded.");
  };

  const handleSubmitToAdmin = () => {
    addActivity("Observer summary submitted to admin.");
    alert("Summary submitted to admin dashboard.");
  };

  const noDataMessage = "No related data found. Admin needs to assign elections/reports to this observer.";

  return (
    <div className="observer-layout">
      <div className="observer-navbar">
        <button
          className="observer-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h2>VOTEGUARD</h2>

        <div className="observer-user-section">
          <img src={observerImage} alt="profile" className="observer-profile-pic" />
          <span className="observer-name">{observerName}</span>
          <button
            className="observer-profile-update-btn"
            onClick={() => setShowProfileModal(true)}
          >
            Update Profile
          </button>
          <button className="observer-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="observer-body">
        <div className={`observer-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <ul>
            <li
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard Overview
            </li>
            <li
              className={activeSection === "elections" ? "active" : ""}
              onClick={() => setActiveSection("elections")}
            >
              Assigned Elections
            </li>
            <li
              className={activeSection === "reports" ? "active" : ""}
              onClick={() => setActiveSection("reports")}
            >
              Report Management
            </li>
            <li
              className={activeSection === "activity" ? "active" : ""}
              onClick={() => setActiveSection("activity")}
            >
              Activity Log
            </li>
          </ul>
        </div>

        <div className={`observer-container ${sidebarOpen ? "shift" : ""}`}>
          {activeSection === "dashboard" && (
            <>
              <h1>WELCOME TO THE OBSERVER PAGE</h1>

              <div className="observer-card-container">
                <div className="observer-card">
                  <h3>Total Assigned Elections</h3>
                  <h2>{elections.length}</h2>
                </div>

                <div className="observer-card">
                  <h3>Total Assigned Reports</h3>
                  <h2>{reports.length}</h2>
                </div>

                <div className="observer-card">
                  <h3>Resolved Reports</h3>
                  <h2>{verifiedReports}</h2>
                </div>

                <div className="observer-card">
                  <h3>Transparency Score</h3>
                  <h2>{transparencyScore}%</h2>
                </div>
              </div>

              <div className="observer-section-grid">
                <div className="observer-section-card">
                  <h3>Assigned Elections</h3>

                  {elections.length === 0 && (
                    <p className="observer-row-subtitle">{noDataMessage}</p>
                  )}

                  {elections.map((election) => {
                    const badge = getStatusBadge(election);

                    return (
                      <div key={election.id} className="observer-row">
                        <div>
                          <p className="observer-row-title">
                            {election.title || election.name || "Untitled election"}
                          </p>
                          <p className="observer-row-subtitle">
                            {election.startDate && election.endDate
                              ? `${election.startDate} to ${election.endDate}`
                              : "Date not set"}
                          </p>
                        </div>

                        <div className="observer-action-buttons">
                          <span className={badge.className}>{badge.label}</span>
                          <button
                            className="observer-btn observer-note"
                            onClick={() => reviewElection(election.id)}
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="observer-section-card">
                  <h3>Assigned Reports</h3>

                  {reports.length === 0 && (
                    <p className="observer-row-subtitle">{noDataMessage}</p>
                  )}

                  {reports.map((report) => (
                    <div key={report.id} className="observer-report-row">
                      <div>
                        <p className="observer-row-title">{report.title || "Untitled report"}</p>
                        <p className="observer-row-subtitle">
                          {report.location || "Location not specified"}
                        </p>
                        <p className="observer-row-subtitle">
                          Status: {report.status || "Pending"}
                        </p>
                        {report.observerNote && (
                          <p className="observer-note-line">Note: {report.observerNote}</p>
                        )}
                      </div>

                      <div className="observer-action-buttons">
                        <button
                          className="observer-btn observer-verify"
                          onClick={() => updateReportDecision(report.id, "verified")}
                        >
                          Verify
                        </button>
                        <button
                          className="observer-btn observer-false"
                          onClick={() => updateReportDecision(report.id, "false")}
                        >
                          Reject
                        </button>
                        <button
                          className="observer-btn observer-note"
                          onClick={() => reviewReport(report.id)}
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="observer-section-card observer-full-card">
                <div className="observer-card-topbar">
                  <h3>Field Activity Log</h3>
                  <div className="observer-top-actions">
                    <button type="button" onClick={handleDownloadReport}>Download Report</button>
                    <button type="button" onClick={handleSubmitToAdmin}>Submit to Admin</button>
                  </div>
                </div>

                {activity.length === 0 && (
                  <p className="observer-row-subtitle">No activity yet. Actions you perform will appear here.</p>
                )}

                {activity.map((entry) => (
                  <div key={entry.id} className="observer-activity-row">
                    <p className="observer-time">{entry.time}</p>
                    <p>{entry.message}</p>
                  </div>
                ))}
              </div>

              <footer className="observer-footer">
                <p>{dashboardSubtitle}</p>

                <div className="observer-top-actions">
                  <button onClick={handleDownloadReport}>Download PDF</button>
                  <button onClick={handleSubmitToAdmin}>Submit to Admin</button>
                </div>
              </footer>
            </>
          )}

          {activeSection === "elections" && (
            <div className="observer-section-card observer-alone-card">
              <h3>Assigned Elections</h3>

              {elections.length === 0 && (
                <p className="observer-row-subtitle">{noDataMessage}</p>
              )}

              {elections.map((election) => {
                const badge = getStatusBadge(election);

                return (
                  <div key={election.id} className="observer-row">
                    <div>
                      <p className="observer-row-title">
                        {election.title || election.name || "Untitled election"}
                      </p>
                      <p className="observer-row-subtitle">
                        {election.startDate && election.endDate
                          ? `${election.startDate} to ${election.endDate}`
                          : "Date not set"}
                      </p>
                    </div>
                    <span className={badge.className}>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {activeSection === "reports" && (
            <div className="observer-section-card observer-alone-card">
              <h3>Report Management</h3>

              {reports.length === 0 && (
                <p className="observer-row-subtitle">{noDataMessage}</p>
              )}

              {reports.map((report) => (
                <div key={report.id} className="observer-report-row">
                  <div>
                    <p className="observer-row-title">{report.title || "Untitled report"}</p>
                    <p className="observer-row-subtitle">
                      {report.location || "Location not specified"}
                    </p>
                    <p className="observer-row-subtitle">
                      Status: {report.status || "Pending"}
                    </p>
                    {report.observerNote && <p className="observer-note-line">Note: {report.observerNote}</p>}
                  </div>

                  <div className="observer-action-buttons">
                    <button
                      className="observer-btn observer-verify"
                      onClick={() => updateReportDecision(report.id, "verified")}
                    >
                      Verify
                    </button>
                    <button
                      className="observer-btn observer-false"
                      onClick={() => updateReportDecision(report.id, "false")}
                    >
                      Reject
                    </button>
                    <button
                      className="observer-btn observer-note"
                      onClick={() => reviewReport(report.id)}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "activity" && (
            <div className="observer-section-card observer-alone-card">
              <h3>Activity Log</h3>

              {activity.length === 0 && (
                <p className="observer-row-subtitle">No activity yet. Actions you perform will appear here.</p>
              )}

              {activity.map((entry) => (
                <div key={entry.id} className="observer-activity-row">
                  <p className="observer-time">{entry.time}</p>
                  <p>{entry.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showProfileModal && (
        <ProfileUpdateModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}

export default ObserverDashboard;
