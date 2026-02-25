import React, { useEffect, useState } from "react";
import "./ReportIssue.css";

function ReportIssue() {

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    {};

  const getSystemData = () => {
    return JSON.parse(localStorage.getItem("electionSystem")) || {
      users: [],
      elections: [],
      reports: [],
      notifications: [],
    };
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = () => {
      const systemData = getSystemData();
      setReports(systemData.reports || []);
    };

    loadReports();

    const interval = setInterval(loadReports, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all required fields");
      return;
    }

    const systemData = getSystemData();

    const newReport = {
      id: Date.now(),
      userId: currentUser?.id || null,
      userName: currentUser?.fullName || currentUser?.name || "Citizen",
      title,
      description,
      image,
      location,
      status: "Pending",
      assignedTo: "",
      adminComment: "",
      date: new Date().toLocaleDateString(),
    };

    systemData.reports.push(newReport);

    localStorage.setItem(
      "electionSystem",
      JSON.stringify(systemData)
    );

    setTitle("");
    setDescription("");
    setImage(null);
    setLocation("");

    alert("Report Submitted Successfully!");
  };

  const userReports = reports.filter(
    (r) => r.userId === currentUser?.id || !r.userId
  );

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

      <div className="report-list">
        <h3>Track Your Reports</h3>

        {userReports.length === 0 && (
          <p>No reports submitted yet.</p>
        )}

        {userReports.map((report) => (
          <div key={report.id} className="report-card">
            <h4>{report.title}</h4>
            <p>{report.description}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${report.status}`}>
                {report.status}
              </span>
            </p>

            <p><strong>Date:</strong> {report.date}</p>

            {report.location && <p>{report.location}</p>}

            {report.assignedTo && (
              <p><strong>Assigned To:</strong> {report.assignedTo}</p>
            )}

            {report.adminComment && (
              <p><strong>Admin Comment:</strong> {report.adminComment}</p>
            )}

            {report.image && (
              <img
                src={report.image}
                alt="uploaded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportIssue;