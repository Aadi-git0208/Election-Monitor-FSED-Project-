import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "",
    agree: false,
    profileImage: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!formData.agree) {
    alert("Please agree to Terms & Conditions");
    return;
  }

  const existingUsers =
    JSON.parse(localStorage.getItem("users")) || [];

  const userExists = existingUsers.find(
    (user) => user.email === formData.email
  );

  if (userExists) {
    alert("User already registered with this email!");
    return;
  }

  const newUser = {
    name: formData.fullName,
    email: formData.email,
    mobile: formData.mobile,
    password: formData.password,
    role: formData.role,
    image: formData.profileImage || "/default-profile.png",
  };

  localStorage.setItem(
    "users",
    JSON.stringify([...existingUsers, newUser])
  );

  alert("Signup Successful! Please Login ✅");

  navigate("/login");  
};
  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            required
            value={formData.mobile}
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

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
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

          <label>Upload Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {formData.profileImage && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <img
                src={formData.profileImage}
                alt="Preview"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          <div className="terms">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <span>I agree to Terms & Conditions</span>
          </div>

          <button type="submit" className="signup-btn">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;