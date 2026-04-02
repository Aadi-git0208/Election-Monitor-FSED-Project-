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

function ReportIssue() {

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");

  // 📸 IMAGE
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // 📍 LOCATION
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`);
      },
      () => alert("Location failed")
    );
  };

  // 🔥 SUBMIT (FRONTEND ONLY)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Fill required fields");
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

    const systemData = getSystemData();
    const reports = Array.isArray(systemData.reports) ? systemData.reports : [];
    const nextId =
      reports.length > 0
        ? Math.max(...reports.map((report) => Number(report.id) || 0)) + 1
        : 1;

    const updatedReports = [
      {
        ...reportPayload,
        id: nextId,
      },
      ...reports,
    ];

    localStorage.setItem(
      "electionSystem",
      JSON.stringify({
        ...systemData,
        reports: updatedReports,
      })
    );

    alert("✅ Report saved successfully!");

    setTitle("");
    setDescription("");
    setImage(null);
    setLocation("");
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

        <input type="file" onChange={handleImageUpload} />

        <button type="button" onClick={handleGetLocation}>
          Get Location
        </button>

        {location && <p>{location}</p>}

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}

export default ReportIssue;