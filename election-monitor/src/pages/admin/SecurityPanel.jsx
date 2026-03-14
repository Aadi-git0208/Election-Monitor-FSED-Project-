import React, { useMemo, useState } from "react";
import "./SecurityPanel.css";

const DEFAULT_TWO_FACTOR_CONFIG = {
  enabled: false,
  roles: {
    admin: true,
    citizen: false,
    analyst: false,
    observer: false,
  },
};

const ROLE_OPTIONS = [
  { key: "admin", label: "Admin Dashboard" },
  { key: "citizen", label: "Citizen Dashboard" },
  { key: "analyst", label: "Analyst Dashboard" },
  { key: "observer", label: "Observer Dashboard" },
];

const getSystemData = () =>
  JSON.parse(localStorage.getItem("electionSystem")) || {
    users: [],
    elections: [],
    reports: [],
    notifications: [],
  };

const getTwoFactorConfig = () => {
  const legacyToggle = JSON.parse(localStorage.getItem("twoFactor")) || false;
  const savedConfig = JSON.parse(localStorage.getItem("twoFactorConfig"));

  if (!savedConfig) {
    return {
      ...DEFAULT_TWO_FACTOR_CONFIG,
      enabled: legacyToggle,
      roles: {
        ...DEFAULT_TWO_FACTOR_CONFIG.roles,
        admin: legacyToggle || DEFAULT_TWO_FACTOR_CONFIG.roles.admin,
      },
    };
  }

  return {
    ...DEFAULT_TWO_FACTOR_CONFIG,
    ...savedConfig,
    roles: {
      ...DEFAULT_TWO_FACTOR_CONFIG.roles,
      ...(savedConfig.roles || {}),
    },
  };
};

function SecurityPanel() {
  const currentUser = useMemo(
    () =>
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser")),
    []
  );
  const canManageTwoFactor = currentUser?.role === "admin";

  /* ================= LOAD DATA (NO useEffect) ================= */
  const [loginHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("loginHistory")) || [];
  });

  const [users, setUsers] = useState(() => {
    return getSystemData().users || [];
  });

  const [twoFactorConfig, setTwoFactorConfig] = useState(() => {
    return getTwoFactorConfig();
  });

  /* ================= TWO FACTOR ================= */

  const saveTwoFactorConfig = (nextConfig) => {
    localStorage.setItem("twoFactorConfig", JSON.stringify(nextConfig));

    // Keep legacy key for backward compatibility with old code.
    localStorage.setItem(
      "twoFactor",
      JSON.stringify(Boolean(nextConfig.enabled && nextConfig.roles.admin))
    );

    setTwoFactorConfig(nextConfig);
  };

  const toggleTwoFactorMaster = () => {
    if (!canManageTwoFactor) {
      alert("Only admin can change 2FA settings.");
      return;
    }

    const nextConfig = {
      ...twoFactorConfig,
      enabled: !twoFactorConfig.enabled,
    };

    saveTwoFactorConfig(nextConfig);
  };

  const toggleRoleTwoFactor = (roleKey) => {
    if (!canManageTwoFactor) {
      alert("Only admin can change 2FA settings.");
      return;
    }

    const nextConfig = {
      ...twoFactorConfig,
      roles: {
        ...twoFactorConfig.roles,
        [roleKey]: !twoFactorConfig.roles[roleKey],
      },
    };

    saveTwoFactorConfig(nextConfig);
  };

  /* ================= RESET PASSWORD ================= */

  const resetPassword = (email) => {
    const newPassword = prompt("Enter new password:");

    if (!newPassword?.trim()) return;

    const systemData = getSystemData();

    const updatedUsers = (systemData.users || []).map((user) =>
      user.email === email
        ? { ...user, password: newPassword.trim() }
        : user
    );

    systemData.users = updatedUsers;

    localStorage.setItem("electionSystem", JSON.stringify(systemData));
    setUsers(updatedUsers);

    alert("Password Reset Successful ✅");
  };

  /* ================= SUSPICIOUS DETECTION ================= */

  const suspiciousLogins = loginHistory.filter(
    (login) => (login.failedAttempts || 0) >= 3
  );

  return (
    <div className="security-panel">

      <h2>Security Panel</h2>

      {/* ================= TWO FACTOR ================= */}
      <div className="security-card">
        <h3>Two-Factor Authentication Control</h3>
        <p>
          Admin controls which dashboard roles must pass OTP verification at
          login.
        </p>

        <button
          className={twoFactorConfig.enabled ? "enabled" : "disabled"}
          onClick={toggleTwoFactorMaster}
          disabled={!canManageTwoFactor}
        >
          {twoFactorConfig.enabled ? "Global 2FA: ON" : "Global 2FA: OFF"}
        </button>

        {!canManageTwoFactor && (
          <p className="hint-text">Only admin can modify these settings.</p>
        )}

        <table className="two-factor-roles">
          <thead>
            <tr>
              <th>Dashboard</th>
              <th>OTP Required</th>
            </tr>
          </thead>

          <tbody>
            {ROLE_OPTIONS.map((role) => {
              const isEnabled = Boolean(twoFactorConfig.roles[role.key]);

              return (
                <tr key={role.key}>
                  <td>{role.label}</td>
                  <td>
                    <button
                      className={isEnabled ? "enabled" : "disabled"}
                      onClick={() => toggleRoleTwoFactor(role.key)}
                      disabled={!canManageTwoFactor || !twoFactorConfig.enabled}
                    >
                      {isEnabled ? "ON" : "OFF"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
              users.map((user) => (
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