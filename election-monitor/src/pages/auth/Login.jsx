import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const readStoredJson = (storage, key, fallback) => {
  const raw = storage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    storage.removeItem(key);
    return fallback;
  }
};

const getSystemData = () => {
  const parsed = readStoredJson(localStorage, "electionSystem", null);

  if (!parsed || typeof parsed !== "object") {
    return {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    };
  }

  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    elections: Array.isArray(parsed.elections) ? parsed.elections : [],
    reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
  };
};

function Login() {
  const navigate = useNavigate();

  const normalizeRole = (role) => String(role || "").trim().toLowerCase();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    remember: false,
  });

  // 🔥 Redirect function
  const redirectUser = useCallback((role) => {
    switch (normalizeRole(role)) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "analyst":
        navigate("/analyst");
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

  // 🔥 Auto login check
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

 // 🔥 LOGIN WITH BACKEND (FINAL FIX)
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://your-backend.up.railway.app/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role.toUpperCase(),
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      alert(text);
      return;
    }

    const data = JSON.parse(text);

    const { password, ...safeUser } = data;

    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");

    if (formData.remember) {
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
    }

    alert("Login Successful ✅");

    redirectUser(safeUser.role.toLowerCase());

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
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
        </form>
      </div>
    </div>
  );
}

export default Login;