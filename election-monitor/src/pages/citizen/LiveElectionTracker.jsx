import React, { useEffect, useState } from "react";
import "./LiveElectionTracker.css";

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

function LiveElectionTracker() {

  const [activeElections, setActiveElections] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const loadData = () => {
      const systemData = getSystemData();
      const elections = Array.isArray(systemData.elections) ? systemData.elections : [];
      setActiveElections(elections.filter((election) => election.active));
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // ⏳ TIMER (same logic)
  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimes = {};

      activeElections.forEach((election) => {
        const end = new Date(election.endDate);
        const now = new Date();
        const diff = end - now;

        if (diff <= 0) {
          updatedTimes[election.id] = "Election Ended";
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          updatedTimes[election.id] =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      });

      setTimeLeft(updatedTimes);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeElections]);

  if (activeElections.length === 0) {
    return (
      <div className="election-container">
        <h2>No Active Elections Available</h2>
      </div>
    );
  }

  return (
    <div className="election-container">
      <h2>Live Election Tracker</h2>

      {activeElections.map((election) => (
        <div key={election.id} className="election-card">

          <h3>{election.title}</h3>

          <p>
            <strong>Status:</strong>{" "}
            <span className="active-status">
              {election.active ? "Active" : "Inactive"}
            </span>
          </p>

          <h4>Countdown Timer</h4>
          <p className="countdown">
            {timeLeft[election.id] || "Loading..."}
          </p>

          <div className="candidate-section">
            <h4>Candidate Details</h4>

            {Array.isArray(election.candidates) &&
            election.candidates.length > 0 ? (
              election.candidates.map((candidate, index) => (
                <div key={index} className="candidate-box">
                  <p>{candidate}</p>
                </div>
              ))
            ) : (
              <p>No candidates listed</p>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}

export default LiveElectionTracker;