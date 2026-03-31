import React, { useState } from "react";
import "./ProfileUpdateModal.css";

const getCurrentUser = () => {
  return (
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    null
  );
};

const getSystemData = () => {
  return (
    JSON.parse(localStorage.getItem("electionSystem")) || {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    }
  );
};

function ProfileUpdateModal({ onClose }) {
  const initialUser = getCurrentUser() || {};

  const [fullName, setFullName] = useState(
    initialUser?.fullName || initialUser?.name || ""
  );
  const [mobile, setMobile] = useState(initialUser?.mobile || "");
  const [profileImage, setProfileImage] = useState(
    initialUser?.profileImage || initialUser?.profilePic || initialUser?.image || ""
  );
  const [email] = useState(initialUser?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const persistCurrentUser = (updatedUser) => {
    const hasLocalSession = !!localStorage.getItem("currentUser");
    const hasBrowserSession = !!sessionStorage.getItem("currentUser");

    if (hasLocalSession) {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }

    if (hasBrowserSession) {
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }

    if (!hasLocalSession && !hasBrowserSession) {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const updateSystemUser = (updater) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      alert("User session not found. Please login again.");
      return null;
    }

    const systemData = getSystemData();
    const users = Array.isArray(systemData.users) ? systemData.users : [];

    const updatedUsers = users.map((user) => {
      const isTarget =
        (currentUser.id && user.id === currentUser.id) ||
        (currentUser.email && user.email === currentUser.email);

      return isTarget ? updater(user) : user;
    });

    const updatedUser = updatedUsers.find(
      (user) =>
        (currentUser.id && user.id === currentUser.id) ||
        (currentUser.email && user.email === currentUser.email)
    );

    localStorage.setItem(
      "electionSystem",
      JSON.stringify({
        ...systemData,
        users: updatedUsers,
      })
    );

    return updatedUser;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (!fullName.trim()) {
      alert("Full name is required.");
      return;
    }

    const updatedUser = updateSystemUser((user) => ({
      ...user,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      profileImage: profileImage || user.profileImage || "/default-profile.svg",
    }));

    if (!updatedUser) {
      return;
    }

    persistCurrentUser(updatedUser);
    alert("Profile updated successfully.");
    onClose();
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      alert("Both current and new password are required.");
      return;
    }

    const activeUser = getCurrentUser();

    if ((activeUser?.password || "") !== currentPassword) {
      alert("Current password is incorrect.");
      return;
    }

    const updatedUser = updateSystemUser((user) => ({
      ...user,
      password: newPassword,
    }));

    if (!updatedUser) {
      return;
    }

    persistCurrentUser(updatedUser);
    setCurrentPassword("");
    setNewPassword("");
    alert("Password changed successfully.");
  };

  return (
    <div className="profile-update-overlay" role="dialog" aria-modal="true">
      <div className="profile-update-modal">
        <div className="profile-update-header">
          <h3>Update Profile</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="profile-update-body">
          <label htmlFor="profile-email">Email</label>
          <input id="profile-email" value={email} disabled />

          <label htmlFor="profile-fullname">Full Name</label>
          <input
            id="profile-fullname"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />

          <label htmlFor="profile-mobile">Mobile</label>
          <input
            id="profile-mobile"
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
          />

          <label htmlFor="profile-image">Profile Image</label>
          <input id="profile-image" type="file" accept="image/*" onChange={handleImageUpload} />

          <div className="profile-preview-wrap">
            <img
              src={profileImage || "/default-profile.svg"}
              alt="profile preview"
              className="profile-preview"
            />
          </div>

          <div className="profile-update-actions">
            <button type="button" onClick={handleSaveProfile}>
              Save Changes
            </button>
          </div>

          <div className="profile-password-block">
            <h4>Change Password</h4>

            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />

            <button type="button" onClick={handleChangePassword}>
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdateModal;
