import React, { useEffect, useState } from "react";
import "./LiveElectionTracker.css";

function LiveElectionTracker() {

  const activeElections =
    JSON.parse(localStorage.getItem("activeElections")) || [];

  const election = activeElections.length > 0 ? activeElections[0] : null;

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!election) return;

    const timer = setInterval(() => {
      const end = new Date(election.endDate);
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Election Ended");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);

  }, [election]);

  if (!election) {
    return (
      <div className="election-container">
        <h2>No Active Elections Available</h2>
      </div>
    );
  }

  return (
    <div className="election-container">
      <h2>{election.title}</h2>

      <div className="election-card">
        <h3>
          Status: <span className="active-status">{election.status}</span>
        </h3>

        <h3>Countdown Timer</h3>
        <p className="countdown">{timeLeft}</p>
      </div>

      <div className="election-card">
        <h3>Candidate Details</h3>
        {election.candidates?.map((candidate, index) => (
          <div key={index} className="candidate-box">
            <p><strong>Name:</strong> {candidate.name}</p>
            <p><strong>Party:</strong> {candidate.party}</p>
          </div>
        ))}
      </div>

      <div className="election-card">
        <h3>Election Rules</h3>
        <ul>
          {election.rules?.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LiveElectionTracker;