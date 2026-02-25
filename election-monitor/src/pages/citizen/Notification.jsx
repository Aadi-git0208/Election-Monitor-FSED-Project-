import React, { useEffect, useState } from "react";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  /* ================= LOAD NOTIFICATIONS ================= */

  useEffect(() => {
    const loadNotifications = () => {
      const systemData =
        JSON.parse(localStorage.getItem("electionSystem")) || {
          users: [],
          elections: [],
          reports: [],
          notifications: [],
          forumPosts: [],
        };

      const userNotifications = (systemData.notifications || []).filter(
        (n) =>
          n.userEmail === currentUser?.email || n.userEmail === "all"
      );

      setNotifications(userNotifications.reverse());
    };

    loadNotifications();

    const interval = setInterval(loadNotifications, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  /* ================= MARK AS READ ================= */

  const markAsRead = (id) => {
    const systemData =
      JSON.parse(localStorage.getItem("electionSystem")) || {};

    const updated = systemData.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );

    systemData.notifications = updated;

    localStorage.setItem(
      "electionSystem",
      JSON.stringify(systemData)
    );
  };

  return (
    <div className="notifications-container">
      <h2>Notifications Panel</h2>

      {notifications.length === 0 ? (
        <p className="no-notifications">
          No notifications available.
        </p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className={`notification-card ${
              notif.read ? "read" : "unread"
            }`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className="notification-header">
              <strong>{notif.title}</strong>
              <span>{notif.date}</span>
            </div>

            <p>{notif.message}</p>

            <span className={`badge ${notif.type}`}>
              {notif.type}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;