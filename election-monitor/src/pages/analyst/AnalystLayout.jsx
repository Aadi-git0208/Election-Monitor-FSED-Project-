import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./AnalystDashboard.css";

const AnalystLayout = () => {
  return (
    <div className="analyst-page">

      {/* Sidebar */}
      <div className="analyst-sidebar">
        <div className="sidebar-header">
          <h3>📊 Analyst Panel</h3>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="dashboard" className="sidebar-link">
            🏠 Dashboard
          </NavLink>

          <NavLink to="data-overview" className="sidebar-link">
            📋 Data Overview
          </NavLink>

          <NavLink to="charts" className="sidebar-link">
            📈 Charts & Analytics
          </NavLink>

          <NavLink to="predictive" className="sidebar-link">
            🔮 Predictive Analysis
          </NavLink>

          <NavLink to="reports" className="sidebar-link">
            📄 Reports
          </NavLink>

          <NavLink to="notifications" className="sidebar-link">
            🔔 Notifications
          </NavLink>
        </nav>
      </div>

      {/* Content */}
      <div className="analyst-content">
        <Outlet />
      </div>

    </div>
  );
};

export default AnalystLayout;