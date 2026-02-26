import React from "react";
import DataOverview from "./DataOverview";
import ChartsAnalytics from "./ChartsAnalytics";
import PredictiveAnalysis from "./PredictiveAnalysis";
import ExportReports from "./ExportReports";
import NotificationsPanel from "./NotificationsPanel";

const AnalystDashboard = () => {
  return (
    <>
      <h2>📊 Data Analyst Dashboard</h2>

      <DataOverview />
      <ChartsAnalytics />
      <PredictiveAnalysis />
      <ExportReports />
      <NotificationsPanel />
    </>
  );
};

export default AnalystDashboard;