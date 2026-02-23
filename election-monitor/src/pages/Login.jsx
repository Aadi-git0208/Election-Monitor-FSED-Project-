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


  useEffect(() => {
    const existingUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    if (existingUser) {
      navigate(`/${existingUser.role}-dashboard`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    
    const validUser = users.find(
      (user) =>
        user.email.toLowerCase() === formData.email.toLowerCase() &&
        user.password === formData.password &&
        user.role === formData.role
    );

    if (!validUser) {
      alert("Invalid Email, Password or Role!");
      return;
    }

    // Remove password before storing session
   const { password: _password, ...safeUser } = validUser;
    // Clear previous sessions
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");

    if (formData.remember) {
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
    }

    alert("Login Successful ✅");

    // Cleaner dynamic role redirect
    navigate(`/${safeUser.role}-dashboard`);
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
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <label>Select Role</label>
          <select
            name="role"
            value={formData.role}
            required
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="citizen">Citizen</option>
            <option value="observer">Observer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>

          <div className="login-options">
            <label className="remember">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>

            <Link to="#" className="forgot">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="signup-link">
            Don’t have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;