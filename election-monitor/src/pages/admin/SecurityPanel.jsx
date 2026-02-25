import React, { useState } from "react";
import "./SecurityPanel.css";

function SecurityPanel() {

  /* ================= LOAD DATA (NO useEffect) ================= */
const [loginHistory] = useState(() => {
  return JSON.parse(localStorage.getItem("loginHistory")) || [];
});

const [users, setUsers] = useState(() => {
  return JSON.parse(localStorage.getItem("users")) || [];
});

const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
  return JSON.parse(localStorage.getItem("twoFactor")) || false;
});
  /* ================= TWO FACTOR ================= */

  const toggleTwoFactor = () => {
    const updated = !twoFactorEnabled;
    localStorage.setItem("twoFactor", JSON.stringify(updated));
    setTwoFactorEnabled(updated);
  };

  /* ================= RESET PASSWORD ================= */

  const resetPassword = (email) => {
    const newPassword = prompt("Enter new password:");

    if (!newPassword) return;

    const updatedUsers = users.map(user =>
      user.email === email
        ? { ...user, password: newPassword }
        : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    alert("Password Reset Successful ✅");
  };

  /* ================= SUSPICIOUS DETECTION ================= */

  const suspiciousLogins = loginHistory.filter(
    login => (login.failedAttempts || 0) >= 3
  );

  return (
    <div className="security-panel">

      <h2>Security Panel</h2>

      {/* ================= TWO FACTOR ================= */}
      <div className="security-card">
        <h3>Two-Factor Authentication</h3>
        <p>Enable extra security layer for admin login.</p>

        <button
          className={twoFactorEnabled ? "enabled" : "disabled"}
          onClick={toggleTwoFactor}
        >
          {twoFactorEnabled ? "Enabled" : "Enable 2FA"}
        </button>
      </div>

      {/* ================= LOGIN HISTORY ================= */}
      <div className="security-card">
        <h3>Login History</h3>

        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th>Failed Attempts</th>
            </tr>
          </thead>

          <tbody>
            {loginHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No Login History
                </td>
              </tr>
            ) : (
              loginHistory.map((log, index) => (
                <tr key={index}>
                  <td>{log.email}</td>
                  <td>{log.date}</td>
                  <td>
                    <span
                      className={
                        log.status === "Success" ? "success" : "fail"
                      }
                    >
                      {log.status}
                    </span>
                  </td>
                  <td>{log.failedAttempts || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= SUSPICIOUS ACTIVITY ================= */}
      <div className="security-card">
        <h3>Suspicious Activity</h3>

        {suspiciousLogins.length === 0 ? (
          <p className="safe">No Suspicious Activity Detected ✅</p>
        ) : (
          suspiciousLogins.map((log, index) => (
            <div key={index} className="alert-box">
              ⚠️ {log.email} has {log.failedAttempts} failed login attempts!
            </div>
          ))
        )}
      </div>

      {/* ================= PASSWORD RESET ================= */}
      <div className="security-card">
        <h3>Password Reset Control</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Reset Password</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No Users Found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.email}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="reset-btn"
                      onClick={() => resetPassword(user.email)}
                    >
                      Reset
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

export default SecurityPanel;