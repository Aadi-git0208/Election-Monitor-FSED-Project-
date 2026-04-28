import React, { useCallback, useEffect, useState } from "react";
import "./NotificationsPanel.css";
import API from "../../api/config";

const normalizeListResponse = (payload, listKey) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && Array.isArray(payload[listKey])) {
    return payload[listKey];
  }

  return [];
};

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotificationsData = useCallback(async () => {
    try {
      const reportsRes = await fetch(`${API}/api/reports/all`);

      if (!reportsRes.ok) {
        throw new Error("Failed to fetch reports");
      }

      const reportsPayload = await reportsRes.json();
      const reports = normalizeListResponse(reportsPayload, "reports");

      const pending = reports.filter((report) => report.status === "Pending").length;
      const assigned = reports.filter((report) => report.status === "Assigned").length;
      const rejected = reports.filter((report) => report.status === "Rejected").length;

      const derivedAlerts = [];

      if (pending > 0) {
        derivedAlerts.push({
          id: `pending-${pending}`,
          title: "Pending Reports Alert",
          message: `${pending} reports are still pending review.`,
          date: new Date().toLocaleString(),
          type: "alert",
        });
      }

      if (assigned > 0) {
        derivedAlerts.push({
          id: `assigned-${assigned}`,
          title: "Assigned Reports Update",
          message: `${assigned} reports are currently assigned to observers.`,
          date: new Date().toLocaleString(),
          type: "update",
        });
      }

      if (rejected > 0) {
        derivedAlerts.push({
          id: `rejected-${rejected}`,
          title: "Rejected Reports Notice",
          message: `${rejected} reports have been rejected and need trend review.`,
          date: new Date().toLocaleString(),
          type: "critical",
        });
      }

      setNotifications(derivedAlerts.slice(0, 30));
    } catch (error) {
      console.error("Error fetching notifications data:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchNotificationsData();
    })();

    const interval = setInterval(fetchNotificationsData, 10000); // auto refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchNotificationsData]);

  return (
    <div className="notification-container analyst-module-card">
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <div className="analyst-notification-list">
          {notifications.map((notification) => (
            <article key={notification.id} className="analyst-notification-card">
              <div className="analyst-notification-header">
                <h3>{notification.title || "Update"}</h3>
                <span>{notification.date || "-"}</span>
              </div>

              <p>{notification.message || "No details available."}</p>

              <span className={`analyst-notification-tag ${notification.type || "update"}`}>
                {notification.type || "update"}
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;