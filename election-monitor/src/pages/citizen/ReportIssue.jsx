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

    try {
      const res = await fetch("http://localhost:8080/api/reports/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          email: currentUser?.email,
          userName: currentUser?.fullName,
          title,
          description,
          image,
          location,
          date: new Date().toLocaleDateString()
        })
      });

      if (res.ok) {
        alert("Report Submitted Successfully!");

        // reset form
        setTitle("");
        setDescription("");
        setImage(null);
        setLocation("");
      } else {
        alert("Failed to submit report");
      }

    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
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