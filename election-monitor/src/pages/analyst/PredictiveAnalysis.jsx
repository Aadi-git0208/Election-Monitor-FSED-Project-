import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./PredictiveAnalysis.css";

const normalizeListResponse = (payload, listKey) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && Array.isArray(payload[listKey])) {
    return payload[listKey];
  }

  return [];
};

const PredictiveAnalysis = () => {
  const [reports, setReports] = useState([]);

  const fetchPredictiveData = useCallback(async () => {
    try {
      const reportsRes = await fetch("https://your-backend.up.railway.app/api/reports/all");

      if (!reportsRes.ok) {
        throw new Error("Failed to fetch reports");
      }

      const reportsPayload = await reportsRes.json();
      const fetchedReports = normalizeListResponse(reportsPayload, "reports");

      setReports(fetchedReports);
    } catch (error) {
      console.error("Error fetching predictive data:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchPredictiveData();
    })();

    const interval = setInterval(fetchPredictiveData, 10000); // auto refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchPredictiveData]);

  const analysis = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((report) => report.status === "Pending").length;
    const assigned = reports.filter((report) => report.status === "Assigned").length;
    const resolved = reports.filter((report) => report.status === "Resolved").length;
    const rejected = reports.filter((report) => report.status === "Rejected").length;

    const completionRate = total === 0 ? 0 : Math.round(((resolved + rejected) / total) * 100);

    const riskScore =
      total === 0
        ? 0
        : Math.round(((pending + rejected * 1.5) / total) * 50);

    let recommendation = "Data volume is low. Keep monitoring incoming reports.";

    if (riskScore >= 60) {
      recommendation = "High risk detected. Increase observer deployment in flagged areas.";
    } else if (riskScore >= 35) {
      recommendation = "Moderate risk. Prioritize assigned and pending reports.";
    } else if (total > 0) {
      recommendation = "Current trends are stable. Maintain review cadence.";
    }

    return {
      total,
      pending,
      assigned,
      resolved,
      rejected,
      completionRate,
      riskScore,
      recommendation,
    };
  }, [reports]);

  return (
    <div className="predictive-container analyst-module-card">
      <h2>Predictive Analysis</h2>

      <div className="predictive-grid">
        <div className="predictive-card">
          <h3>Report Completion Rate</h3>
          <p>{analysis.completionRate}%</p>
        </div>

        <div className="predictive-card">
          <h3>Operational Risk Score</h3>
          <p>{analysis.riskScore}%</p>
        </div>
      </div>

      <div className="predictive-summary">
        <h3>Current Distribution</h3>
        <p>Total Reports: {analysis.total}</p>
        <p>Pending: {analysis.pending}</p>
        <p>Assigned: {analysis.assigned}</p>
        <p>Resolved: {analysis.resolved}</p>
        <p>Rejected: {analysis.rejected}</p>
      </div>

      <div className="predictive-recommendation">
        <h3>Recommendation</h3>
        <p>{analysis.recommendation}</p>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;