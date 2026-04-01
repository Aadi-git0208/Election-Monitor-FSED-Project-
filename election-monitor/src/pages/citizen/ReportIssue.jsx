import React, { useState } from "react";
import "./ReportIssue.css";

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

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").trim();
const REPORT_SUBMIT_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/$/, "")}/api/reports/submit`
  : "";

function ReportIssue() {

  const currentUser =
    readStoredJson(localStorage, "currentUser", null) ||
    readStoredJson(sessionStorage, "currentUser", null) ||
    {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");

  // 📸 IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 📍 LOCATION
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`;
        setLocation(coords);
      },
      () => {
        alert("Unable to retrieve location");
      }
    );
  };

  // 🔥 SUBMIT TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all required fields");
      return;
    }

    const reportPayload = {
      userId: currentUser?.id,
      email: currentUser?.email,
      userName: currentUser?.fullName || currentUser?.name || "Citizen",
      title,
      description,
      image,
      location,
      date: new Date().toLocaleDateString(),
      status: "Pending",
    };

    try {
      let submittedToApi = false;

      if (REPORT_SUBMIT_ENDPOINT) {
        const res = await fetch(REPORT_SUBMIT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportPayload),
        });

        submittedToApi = res.ok;
      }

      if (!submittedToApi) {
        const systemData = getSystemData();
        const nextId =
          systemData.reports.length > 0
            ? Math.max(...systemData.reports.map((entry) => Number(entry.id) || 0)) + 1
            : Date.now();

        systemData.reports.push({
          id: nextId,
          ...reportPayload,
        });

        localStorage.setItem("electionSystem", JSON.stringify(systemData));
      }

      alert("Report Submitted Successfully!");

      // reset form
      setTitle("");
      setDescription("");
      setImage(null);
      setLocation("");

    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    }
  };

  return (
    <div className="report-container">
      <h2>Report an Issue</h2>

      <form onSubmit={handleSubmit} className="report-form">
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleImageUpload}
        />

        <button type="button" onClick={handleGetLocation}>
          Get Current Location
        </button>

        {location && <p className="location-text">{location}</p>}

        <button type="submit" className="submit-btn">
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default ReportIssue;