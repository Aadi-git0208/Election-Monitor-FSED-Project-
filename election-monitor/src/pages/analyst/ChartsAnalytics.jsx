import React, { useEffect, useState } from "react";
import "./ChartsAnalytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

const getReports = () => {
  const systemData = readStoredJson(localStorage, "electionSystem", {
    users: [],
    elections: [],
    reports: [],
    notifications: [],
  });

  return Array.isArray(systemData?.reports) ? systemData.reports : [];
};

const ChartsAnalytics = () => {
  const [statusChartData, setStatusChartData] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const reports = getReports();

      const statusCounts = {
        Pending: 0,
        Assigned: 0,
        Resolved: 0,
        Rejected: 0,
      };

      reports.forEach((report) => {
        const status = report.status || "Pending";
        if (!statusCounts[status]) {
          statusCounts[status] = 0;
        }
        statusCounts[status] += 1;
      });

      setStatusChartData(
        Object.keys(statusCounts).map((status) => ({
          status,
          count: statusCounts[status],
        }))
      );

      const dailyCounts = reports.reduce((acc, report) => {
        const key = report.date || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      setDailyChartData(
        Object.keys(dailyCounts).map((date) => ({
          date,
          count: dailyCounts[date],
        }))
      );
    };

    loadData();
    const interval = setInterval(loadData, 3000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const COLORS = ["#ff9800", "#0d47a1", "#2e7d32", "#c62828", "#607d8b"];

  return (
    <div className="charts-container analyst-module-card">
      <h2>Charts Analytics</h2>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Report Status Distribution</h3>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusChartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Reports Submitted Per Day</h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dailyChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1565c0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsAnalytics;