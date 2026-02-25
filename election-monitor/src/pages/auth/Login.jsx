import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    remember: false,
  });

  // 🔥 Auto Login If Already Logged In
  useEffect(() => {
    const existingUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    if (existingUser) {
      redirectUser(existingUser.role);
    }
  }, []);

  // 🔥 Central Redirect Function (Scalable)
  const redirectUser = (role) => {
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
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
        user.email.toLowerCase() === formData.email.toLowerCase() &&
        user.password === formData.password &&
        user.role === formData.role
    );

    if (!validUser) {
      alert("Invalid Email, Password or Role!");
      return;
    }

   const { password: _password, ...safeUser } = validUser;

    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");

    if (formData.remember) {
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
    }

    alert("Login Successful ✅");

    redirectUser(safeUser.role);
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