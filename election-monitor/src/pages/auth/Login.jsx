import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const DEFAULT_TWO_FACTOR_CONFIG = {
  enabled: false,
  roles: {
    admin: true,
    citizen: false,
    analyst: false,
    observer: false,
  },
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

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    remember: false,
  });
  const [otpCode, setOtpCode] = useState("");
  const [pendingTwoFactor, setPendingTwoFactor] = useState(() => {
    const savedChallenge = sessionStorage.getItem("pending2FA");

    if (!savedChallenge) {
      return null;
    }

    const parsedChallenge = JSON.parse(savedChallenge);

    if (parsedChallenge.expiresAt < Date.now()) {
      sessionStorage.removeItem("pending2FA");
      return null;
    }

    return parsedChallenge;
  });

  const authStep = pendingTwoFactor ? "otp" : "credentials";

  // 🔥 Central Redirect Function (Scalable)
  const redirectUser = useCallback((role) => {
    switch (role) {
      case "analyst":
        navigate("/analyst");
        break;

      case "admin":
        navigate("/admin-dashboard");
        break;

      case "citizen":
        navigate("/citizen-dashboard");
        break;

      case "observer":
        navigate("/observer-dashboard");
        break;

      default:
        navigate("/");
    }
  }, [navigate]);

  const appendLoginHistory = useCallback((entry) => {
    const currentHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
    const updatedHistory = [entry, ...currentHistory].slice(0, 200);
    localStorage.setItem("loginHistory", JSON.stringify(updatedHistory));
  }, []);

  const increaseFailedAttempts = useCallback((email) => {
    const currentFailedMap =
      JSON.parse(localStorage.getItem("loginFailedAttempts")) || {};
    const nextCount = (currentFailedMap[email] || 0) + 1;
    currentFailedMap[email] = nextCount;
    localStorage.setItem("loginFailedAttempts", JSON.stringify(currentFailedMap));
    return nextCount;
  }, []);

  const resetFailedAttempts = useCallback((email) => {
    const currentFailedMap =
      JSON.parse(localStorage.getItem("loginFailedAttempts")) || {};
    currentFailedMap[email] = 0;
    localStorage.setItem("loginFailedAttempts", JSON.stringify(currentFailedMap));
  }, []);

  const finalizeLogin = useCallback(
    (safeUser, remember, normalizedEmail) => {
      resetFailedAttempts(normalizedEmail);

      appendLoginHistory({
        email: safeUser.email,
        date: new Date().toLocaleString(),
        status: "Success",
        failedAttempts: 0,
      });

      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");

      if (remember) {
        localStorage.setItem("currentUser", JSON.stringify(safeUser));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
      }

      alert("Login Successful ✅");
      redirectUser(safeUser.role);
    },
    [appendLoginHistory, redirectUser, resetFailedAttempts]
  );

  // 🔥 Auto Login If Already Logged In
  useEffect(() => {
    const existingUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    if (existingUser) {
      redirectUser(existingUser.role);
    }
  }, [redirectUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const cancelTwoFactor = () => {
    sessionStorage.removeItem("pending2FA");
    setPendingTwoFactor(null);
    setOtpCode("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (authStep === "otp") {
      if (!pendingTwoFactor) {
        alert("2FA session not found. Please login again.");
        return;
      }

      const now = Date.now();
      const normalizedEmail = pendingTwoFactor.email;

      if (pendingTwoFactor.expiresAt < now) {
        const failedCount = increaseFailedAttempts(normalizedEmail);
        appendLoginHistory({
          email: normalizedEmail,
          date: new Date().toLocaleString(),
          status: "Failed",
          failedAttempts: failedCount,
        });

        sessionStorage.removeItem("pending2FA");
        setPendingTwoFactor(null);
        setOtpCode("");
        alert("OTP expired. Please login again.");
        return;
      }

      if (otpCode.trim() !== pendingTwoFactor.otp) {
        const failedCount = increaseFailedAttempts(normalizedEmail);
        appendLoginHistory({
          email: normalizedEmail,
          date: new Date().toLocaleString(),
          status: "Failed",
          failedAttempts: failedCount,
        });

        alert("Invalid OTP code!");
        return;
      }

      const { safeUser, remember } = pendingTwoFactor;
      sessionStorage.removeItem("pending2FA");
      setPendingTwoFactor(null);
      setOtpCode("");
      finalizeLogin(safeUser, remember, normalizedEmail);
      return;
    }

    const normalizedEmail = formData.email.trim().toLowerCase();

    // 🔥 READ FROM electionSystem
    const systemData =
      JSON.parse(localStorage.getItem("electionSystem")) || {
        users: [],
        elections: [],
        reports: [],
        notifications: [],
      };

    const validUser = systemData.users.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === formData.password &&
        user.role === formData.role
    );

    if (!validUser) {
      const failedCount = increaseFailedAttempts(normalizedEmail);
      appendLoginHistory({
        email: formData.email || "unknown",
        date: new Date().toLocaleString(),
        status: "Failed",
        failedAttempts: failedCount,
      });

      alert("Invalid Email, Password or Role!");
      return;
    }

    const { password: _password, ...safeUser } = validUser;
    const twoFactorConfig = getTwoFactorConfig();
    const requiresTwoFactor =
      twoFactorConfig.enabled && Boolean(twoFactorConfig.roles[safeUser.role]);

    if (requiresTwoFactor) {
      const generatedOtp = `${Math.floor(100000 + Math.random() * 900000)}`;
      const challenge = {
        email: normalizedEmail,
        safeUser,
        remember: formData.remember,
        otp: generatedOtp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };

      sessionStorage.setItem("pending2FA", JSON.stringify(challenge));
      setPendingTwoFactor(challenge);
      setOtpCode("");

      // Demo-only OTP display until SMS/email backend is connected.
      alert(`Your 2FA code is: ${generatedOtp}`);
      return;
    }

    finalizeLogin(safeUser, formData.remember, normalizedEmail);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{authStep === "otp" ? "Two-Factor Verification" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {authStep === "credentials" ? (
            <>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />

              <label>Select Role</label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="citizen">Citizen</option>
                <option value="observer">Observer</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>

              <div className="login-options">
                <label>
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
              </div>

              <button type="submit" className="login-btn">
                Login
              </button>

              <p>
                Don’t have an account? <Link to="/signup">Signup</Link>
              </p>
            </>
          ) : (
            <>
              <p>
                Enter the 6-digit code sent for {pendingTwoFactor?.email || "admin"}.
              </p>

              <label>OTP Code</label>
              <input
                type="text"
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              />

              <button type="submit" className="login-btn">
                Verify OTP
              </button>

              <button
                type="button"
                className="login-btn"
                onClick={cancelTwoFactor}
                style={{ marginTop: "10px", background: "#777" }}
              >
                Cancel
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;