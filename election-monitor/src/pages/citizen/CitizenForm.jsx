import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CitizenForm.css";

function CitizenForm() {
  const navigate = useNavigate();

  // ✅ Get logged user first
  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  
  useEffect(() => {
    if (!currentUser) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (currentUser.role !== "citizen") {
      alert("Access Denied! Only Citizens can fill this form.");
      navigate("/login");
      return;
    }
  }, [navigate, currentUser]);

  // ✅ Initialize state with email already set
  const [formData, setFormData] = useState({
    fullName: "",
    guardianName: "",
    dob: "",
    age: "",
    gender: "",
    nationality: "Indian",
    email: currentUser ? currentUser.email : "",
    mobile: "",
    altMobile: "",
    aadhaar: "",
    voterId: "",
    idProofType: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    constituency: "",
    booth: "",
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const age = calculateAge(value);
      setFormData({ ...formData, dob: value, age });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingCitizens =
      JSON.parse(localStorage.getItem("citizens")) || [];

   
    const aadhaarExists = existingCitizens.find(
      (citizen) => citizen.aadhaar === formData.aadhaar
    );

    if (aadhaarExists) {
      alert("Citizen with this Aadhaar already registered!");
      return;
    }

    const alreadySubmitted = existingCitizens.find(
      (citizen) => citizen.userEmail === currentUser.email
    );

    if (alreadySubmitted) {
      alert("You have already submitted verification form!");
      return;
    }

    const newCitizen = {
      ...formData,
      userEmail: currentUser.email,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "citizens",
      JSON.stringify([...existingCitizens, newCitizen])
    );

    alert("Citizen Form Submitted Successfully ✅");

    navigate("/citizen-dashboard");
  };

  return (
    <div className="citizen-wrapper">
      <div className="citizen-form-container">
        <h2>Citizen Identity Verification</h2>

        <form onSubmit={handleSubmit}>
          <h3>Personal Details</h3>
          <div className="grid">
            <input name="fullName" value={formData.fullName} placeholder="Full Name" required onChange={handleChange} />
            <input name="guardianName" value={formData.guardianName} placeholder="Father / Guardian Name" required onChange={handleChange} />
            <input type="date" name="dob" value={formData.dob} required onChange={handleChange} />
            <input value={formData.age} placeholder="Age" readOnly />

            <select name="gender" value={formData.gender} required onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input value="Indian" readOnly />
          </div>

          <h3>Contact Details</h3>
          <div className="grid">
            <input type="email" value={formData.email} readOnly />
            <input type="tel" name="mobile" value={formData.mobile} placeholder="Mobile Number" required onChange={handleChange} />
            <input type="tel" name="altMobile" value={formData.altMobile} placeholder="Alternate Mobile" onChange={handleChange} />
          </div>

          <h3>Identity Verification</h3>
          <div className="grid">
            <input name="aadhaar" value={formData.aadhaar} placeholder="Aadhaar Number" required onChange={handleChange} />
            <input name="voterId" value={formData.voterId} placeholder="Voter ID Number" required onChange={handleChange} />

            <select name="idProofType" value={formData.idProofType} required onChange={handleChange}>
              <option value="">Select ID Proof Type</option>
              <option>Aadhaar</option>
              <option>Voter ID</option>
              <option>Passport</option>
            </select>

            <input type="file" />
          </div>

          <h3>Address Details</h3>
          <div className="grid">
            <input name="address" value={formData.address} placeholder="House / Street Address" required onChange={handleChange} />
            <input name="city" value={formData.city} placeholder="City / Town" required onChange={handleChange} />
            <input name="district" value={formData.district} placeholder="District" required onChange={handleChange} />
            <input name="state" value={formData.state} placeholder="State" required onChange={handleChange} />
            <input name="pincode" value={formData.pincode} placeholder="Pincode" required onChange={handleChange} />
            <input name="constituency" value={formData.constituency} placeholder="Constituency Name" required onChange={handleChange} />
            <input name="booth" value={formData.booth} placeholder="Polling Booth Number" required onChange={handleChange} />
          </div>

          <button type="submit" className="submit-btn">
            Submit Form
          </button>
        </form>
      </div>
    </div>
  );
}

export default CitizenForm;