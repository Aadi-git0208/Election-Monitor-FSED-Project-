import React, { useEffect, useState } from "react";
import "./DataOverview.css";

const DataOverview = () => {

  const [totalVotes, setTotalVotes] = useState(0);
  const [participation, setParticipation] = useState(0);
  const [regionStats, setRegionStats] = useState([]);

  useEffect(() => {
    const votesData = JSON.parse(localStorage.getItem("votesData")) || [];
    const totalVoters = Number(localStorage.getItem("totalVoters")) || 1;

    const total = votesData.reduce((sum, item) => sum + item.votes, 0);

    setTotalVotes(total);
    setParticipation(((total / totalVoters) * 100).toFixed(2));
    setRegionStats(votesData);

  }, []);

  return (
    <div className="overview-wrapper">

      <div className="overview-card">
        <h3>Total Votes</h3>
        <p>{totalVotes}</p>
      </div>

      <div className="overview-card">
        <h3>Participation %</h3>
        <p>{participation}%</p>
      </div>

      <div className="overview-card">
        <h3>Region-wise Stats</h3>
        {regionStats.map((region, index) => (
          <p key={index}>
            {region.region}: {region.votes}
          </p>
        ))}
      </div>

    </div>
  );
};

export default DataOverview;