import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenForm from "./pages/CitizenForm";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />

        <Route path="/citizen-form" element={<CitizenForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;