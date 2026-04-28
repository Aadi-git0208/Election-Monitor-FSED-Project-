import React, { useCallback, useEffect, useState } from "react";
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

const normalizeListResponse = (payload, listKey) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && Array.isArray(payload[listKey])) {
    return payload[listKey];
  }

  return [];
};

const getReportDateKey = (report) => {
  const rawDate =
    report?.date ||
    report?.createdAt ||
    report?.reportDate ||
    report?.submittedAt ||
    report?.timestamp;

  if (!rawDate) return null;

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().split("T")[0];
};

const ChartsAnalytics = () => {
  const [statusChartData, setStatusChartData] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);

  const fetchChartsData = useCallback(async () => {
    try {
      const reportsRes = await fetch("https://your-backend.up.railway.app/api/reports/all");

      if (!reportsRes.ok) {
        throw new Error("Failed to fetch reports");
      }

      const reportsPayload = await reportsRes.json();
      const reports = normalizeListResponse(reportsPayload, "reports");

      // Calculate status distribution
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

      // Calculate daily reports distribution
      const dailyCounts = reports.reduce((acc, report) => {
        const dateKey = getReportDateKey(report);
        if (dateKey) {
          acc[dateKey] = (acc[dateKey] || 0) + 1;
        }
        return acc;
      }, {});

      setDailyChartData(
        Object.keys(dailyCounts)
          .sort()
          .map((date) => ({
            date,
            count: dailyCounts[date],
          }))
      );
    } catch (error) {
      console.error("Error fetching charts data:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchChartsData();
    })();

    const interval = setInterval(fetchChartsData, 10000); // auto refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchChartsData]);

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