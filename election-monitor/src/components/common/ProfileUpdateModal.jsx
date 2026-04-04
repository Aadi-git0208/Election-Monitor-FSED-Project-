import React, { useState } from "react";
import "./ProfileUpdateModal.css";

const getCurrentUser = () => {
  return (
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    null
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
  const [loading, setLoading] = useState(false);

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

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      alert("Full name is required.");
      return;
    }

    setLoading(true);
    try {
      const userId = initialUser?.id || initialUser?.userId;
      if (!userId) {
        alert("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const updatePayload = {
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        profileImage: profileImage || "/default-profile.svg",
      };

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      const updatedUser = await response.json();
      persistCurrentUser(updatedUser);
      alert("Profile updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Both current and new password are required.");
      return;
    }

    setLoading(true);
    try {
      const userId = initialUser?.id || initialUser?.userId;
      if (!userId) {
        alert("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const passwordPayload = {
        currentPassword,
        newPassword,
      };

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(passwordPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to change password");
        setLoading(false);
        return;
      }

      const updatedUser = await response.json();
      persistCurrentUser(updatedUser);
      setCurrentPassword("");
      setNewPassword("");
      alert("Password changed successfully.");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <button type="button" onClick={handleSaveProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="profile-password-block">
            <h4>Change Password</h4>

            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={loading}
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              disabled={loading}
            />

            <button type="button" onClick={handleChangePassword} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdateModal;
