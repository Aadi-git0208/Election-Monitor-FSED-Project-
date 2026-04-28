import React, { useState } from "react";
import "./ReportIssue.css";

function ReportIssue() {

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");

  // 📸 IMAGE (UNCHANGED)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // 📍 LOCATION (UNCHANGED)
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`);
      },
      () => alert("Location failed")
    );
  };

  // 🔥 BACKEND SUBMIT (ONLY CHANGE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Fill required fields");
      return;
    }

    const userEmail = String(currentUser?.email || "").trim().toLowerCase();
    const userName =
      String(currentUser?.fullName || currentUser?.name || "").trim() || "Citizen";

    if (!userEmail) {
      alert("Please login again. User email is missing.");
      return;
    }

    try {
      const reportPayload = {
  userId: currentUser?.id,
  email: currentUser?.email,
  userName: currentUser?.fullName,
  title,
  description,
  image,
  location
};

      const res = await fetch("https://your-backend.up.railway.app/api/reports/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportPayload),
      });

      const text = await res.text();

      if (!res.ok) {
        alert(text || "Failed to submit report");
        return;
      }

      alert("✅ Report submitted successfully!");

      // RESET
      setTitle("");
      setDescription("");
      setImage(null);
      setLocation("");

    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to submit report");
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