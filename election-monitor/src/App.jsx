import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

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

import "./App.css";

function AppContent() {
  const location = useLocation();

  // Only admin & citizen hide layout
  const hideLayout =
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/citizen-dashboard";

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* ✅ Nested Analyst Routing */}
        <Route path="/analyst" element={<AnalystLayout />}>
          <Route index element={<AnalystDashboard />} />
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