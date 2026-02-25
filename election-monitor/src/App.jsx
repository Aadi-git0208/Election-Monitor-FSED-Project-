import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CitizenForm from "./pages/citizen/CitizenForm";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "./App.css";

function AppContent() {
  const location = useLocation();

  // 🔥 Pages jaha global Navbar & Footer nahi chahiye
  const hideLayoutRoutes = [
    "/admin-dashboard",
    "/citizen-dashboard"
  ];

  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen-form" element={<CitizenForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
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