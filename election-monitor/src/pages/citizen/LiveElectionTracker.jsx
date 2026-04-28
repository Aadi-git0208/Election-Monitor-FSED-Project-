import React, { useEffect, useState } from "react";
import "./LiveElectionTracker.css";
import API from "../../api/config";

function LiveElectionTracker() {

  const [activeElections, setActiveElections] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  // 🔥 BACKEND DATA FETCH (ONLY CHANGE)
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API}/api/elections/all`);
        const elections = await res.json();

        setActiveElections(
          Array.isArray(elections)
            ? elections.filter((election) => election.active)
            : []
        );

      } catch (err) {
        console.error("Backend error:", err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // ⏳ TIMER (UNCHANGED)
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