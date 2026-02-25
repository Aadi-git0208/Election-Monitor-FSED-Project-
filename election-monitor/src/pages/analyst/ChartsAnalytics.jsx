import React, { useEffect, useState } from "react";
import "./ChartsAnalytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const ChartsAnalytics = () => {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const votesData = JSON.parse(localStorage.getItem("votesData")) || [];
    setChartData(votesData);
  }, []);

  return (
    <div className="charts-container">

      <h3>Voter Turnout by Region</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="votes" fill="#2b4a86" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default ChartsAnalytics;