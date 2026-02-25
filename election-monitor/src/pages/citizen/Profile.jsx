import React, { useState } from "react";
import "./Profile.css";

function Profile() {
  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  const [fullName, setFullName] = useState(
    currentUser?.fullName || currentUser?.name || ""
  );
  const [mobile, setMobile] = useState(currentUser?.mobile || "");
  const [profileImage, setProfileImage] = useState(
    currentUser?.profileImage || currentUser?.image || ""
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* ================= UPDATE PROFILE ================= */

  const handleUpdateProfile = () => {
    const systemData =
      JSON.parse(localStorage.getItem("electionSystem")) || {};

    const updatedUsers = systemData.users.map((user) =>
      user.email === currentUser.email
        ? {
            ...user,
            fullName,
            mobile,
            profileImage,
          }
        : user
    );

    systemData.users = updatedUsers;

    localStorage.setItem(
      "electionSystem",
      JSON.stringify(systemData)
    );

    const updatedCurrentUser = {
      ...currentUser,
      fullName,
      mobile,
      profileImage,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedCurrentUser)
    );

    alert("Profile Updated Successfully ✅");
  };

  /* ================= CHANGE PASSWORD ================= */

  const handleChangePassword = () => {
    if (currentPassword !== currentUser.password) {
      alert("Current password is incorrect ❌");
      return;
    }

    if (!newPassword) {
      alert("Enter new password");
      return;
    }

    const systemData =
      JSON.parse(localStorage.getItem("electionSystem")) || {};

    const updatedUsers = systemData.users.map((user) =>
      user.email === currentUser.email
        ? {
            ...user,
            password: newPassword,
          }
        : user
    );

    systemData.users = updatedUsers;

    localStorage.setItem(
      "electionSystem",
      JSON.stringify(systemData)
    );

    const updatedCurrentUser = {
      ...currentUser,
      password: newPassword,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedCurrentUser)
    );

    setCurrentPassword("");
    setNewPassword("");

    alert("Password Changed Successfully 🔐");
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <div className="profile-container">
      <h2>Profile Settings</h2>

      {/* ===== EDIT PROFILE ===== */}
      <div className="profile-card">
        <h3>Edit Profile</h3>

        <div className="profile-image-section">
          <img
            src={profileImage || "/default-profile.png"}
            alt="profile"
          />
          <input type="file" onChange={handleImageUpload} />
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <button onClick={handleUpdateProfile}>
          Save Changes
        </button>
      </div>

      {/* ===== CHANGE PASSWORD ===== */}
      <div className="profile-card">
        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <button onClick={handleChangePassword}>
          Change Password
        </button>
      </div>

      {/* ===== LOGOUT ===== */}
      <div className="logout-section">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;