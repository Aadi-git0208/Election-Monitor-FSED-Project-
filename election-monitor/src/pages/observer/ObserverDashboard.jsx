import React, { useEffect, useState } from "react";
import "./ObserverDashboard.css";
import ProfileUpdateModal from "../../components/common/ProfileUpdateModal";

const EMPTY_SYSTEM_DATA = {
  users: [],
  elections: [],
  reports: [],
  notifications: [],
};

const getSystemData = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("electionSystem"));

    if (!parsed || typeof parsed !== "object") {
      return EMPTY_SYSTEM_DATA;
    }

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      elections: Array.isArray(parsed.elections) ? parsed.elections : [],
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
    };
  } catch {
    return EMPTY_SYSTEM_DATA;
  }
};

const getObserverActivity = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("observer_activity"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

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

const appendCitizenNotification = ({ report, observerName, status }) => {
  const systemData = getSystemData();

  const matchedUser = (systemData.users || []).find(
    (user) => user.id === report?.userId
  );

  const targetEmail = report?.email || matchedUser?.email;

  if (!targetEmail) {
    return;
  }

  const currentNotifications = Array.isArray(systemData.notifications)
    ? systemData.notifications
    : [];

  const nextId =
    currentNotifications.length > 0
      ? Math.max(...currentNotifications.map((entry) => Number(entry.id) || 0)) + 1
      : 1;

  const notification = {
    id: nextId,
    userEmail: targetEmail,
    title: "Report Status Updated",
    message: `Your report "${report?.title || "Untitled report"}" was ${status} by observer ${observerName}.`,
    type: "report",
    date: new Date().toLocaleString(),
    read: false,
  };

  const updatedNotifications = [notification, ...currentNotifications].slice(0, 300);

  localStorage.setItem(
    "electionSystem",
    JSON.stringify({
      ...systemData,
      notifications: updatedNotifications,
    })
  );
};

function ObserverDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const [systemData, setSystemData] = useState(() => getSystemData());
  const [activity, setActivity] = useState(() => getObserverActivity());

  useEffect(() => {
    const loadData = () => {
      setSystemData(getSystemData());
    };

    loadData();

    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const observerName = currentUser?.fullName || currentUser?.name || "Observer";
  const observerImage =
    currentUser?.profileImage ||
    currentUser?.profilePic ||
    currentUser?.image ||
    "/default-profile.png";

  const observerAliases = (() => {
    const aliases = new Set();

    const fullName = normalizeText(currentUser?.fullName || currentUser?.name);
    const firstName = normalizeText((currentUser?.fullName || "").split(" ")[0]);
    const email = normalizeText(currentUser?.email);
    const id = normalizeText(currentUser?.id);

    [fullName, firstName, email, id].forEach((item) => {
      if (item) aliases.add(item);
    });

    return Array.from(aliases);
  })();

  const reports = (systemData.reports || []).filter((report) => {
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
  });

  const elections = (systemData.elections || []).filter((election) => {
    const assignmentCandidates = [
      election.observers,
      election.assignedObservers,
      election.assignedTo,
      election.observerEmail,
      election.observerId,
    ];

    return assignmentCandidates.some((candidate) =>
      matchesObserverAssignment(candidate, observerAliases)
    );
  });

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

      localStorage.setItem("observer_activity", JSON.stringify(next));
      return next;
    });
  };

  const persistReportsUpdate = (updater) => {
    setSystemData((previous) => {
      const currentReports = Array.isArray(previous.reports) ? previous.reports : [];
      const updatedReports = updater(currentReports);
      const nextSystemData = {
        ...previous,
        reports: updatedReports,
      };

      localStorage.setItem("electionSystem", JSON.stringify(nextSystemData));
      return nextSystemData;
    });
  };

  const updateReportDecision = (id, decision) => {
    const nextStatus = decision === "verified" ? "Resolved" : "Rejected";
    const targetReport = (systemData.reports || []).find((report) => report.id === id);

    persistReportsUpdate((currentReports) =>
      currentReports.map((report) =>
        report.id === id
          ? {
              ...report,
              status: nextStatus,
              observerDecision: decision,
              observerActionBy: observerName,
              observerActionAt: new Date().toLocaleString(),
            }
          : report
      )
    );

    addActivity(
      `Report ${id} updated as ${nextStatus} by ${observerName}.`
    );

    if (targetReport) {
      appendCitizenNotification({
        report: targetReport,
        observerName,
        status: nextStatus,
      });
    }
  };

  const addNote = (id) => {
    const note = prompt("Enter note");
    if (!note) return;

    const targetReport = (systemData.reports || []).find((report) => report.id === id);

    persistReportsUpdate((currentReports) =>
      currentReports.map((report) =>
        report.id === id
          ? {
              ...report,
              observerNote: note,
              observerActionBy: observerName,
              observerActionAt: new Date().toLocaleString(),
            }
          : report
      )
    );

    addActivity(`Note added for report ${id}.`);

    if (targetReport) {
      appendCitizenNotification({
        report: targetReport,
        observerName,
        status: "reviewed",
      });
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
    const submissions = JSON.parse(localStorage.getItem("observer_submissions")) || [];

    const nextId =
      submissions.length > 0
        ? Math.max(...submissions.map((entry) => Number(entry.id) || 0)) + 1
        : 1;

    const payload = {
      id: nextId,
      observer: observerName,
      submittedAt: new Date().toISOString(),
      summary: {
        elections: elections.length,
        reports: reports.length,
        resolved: verifiedReports,
        rejected: rejectedReports,
      },
    };

    localStorage.setItem(
      "observer_submissions",
      JSON.stringify([payload, ...submissions].slice(0, 50))
    );

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

                        <span className={badge.className}>{badge.label}</span>
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
                          onClick={() => addNote(report.id)}
                        >
                          Add Note
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
                      onClick={() => addNote(report.id)}
                    >
                      Add Note
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
