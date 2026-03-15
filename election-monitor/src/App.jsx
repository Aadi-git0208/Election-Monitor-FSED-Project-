import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import AnalystLayout from "./pages/analyst/AnalystLayout";
import AnalystDashboard from "./pages/analyst/AnalystDashboard";
import DataOverview from "./pages/analyst/DataOverview";
import ChartsAnalytics from "./pages/analyst/ChartsAnalytics";
import PredictiveAnalysis from "./pages/analyst/PredictiveAnalysis";
import ExportReports from "./pages/analyst/ExportReports";
import NotificationsPanel from "./pages/analyst/NotificationsPanel";
import ObserverDashboard from "./pages/observer/ObserverDashboard";

import "./App.css";

function AppContent() {
  const location = useLocation();

  // Role dashboards hide global layout
  const hideLayout =
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/citizen-dashboard" ||
    location.pathname === "/observer-dashboard" ||
    location.pathname.startsWith("/analyst");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/observer-dashboard" element={<ObserverDashboard />} />

        {/* ✅ Nested Analyst Routing */}
        <Route path="/analyst" element={<AnalystLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AnalystDashboard />} />
          <Route path="data-overview" element={<DataOverview />} />
          <Route path="charts" element={<ChartsAnalytics />} />
          <Route path="predictive" element={<PredictiveAnalysis />} />
          <Route path="reports" element={<ExportReports />} />
          <Route path="notifications" element={<NotificationsPanel />} />
        </Route>

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;