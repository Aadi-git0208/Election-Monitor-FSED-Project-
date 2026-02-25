import React from "react";
import "./PredictiveAnalysis.css";

const PredictiveAnalysis = () => {
  return (
    <div className="predictive-container">

      <h3>🔮 Predictive Analysis</h3>

      <p>Expected Final Turnout: <b>78%</b></p>
      <p>Fraud Probability: <b style={{color:"red"}}>65%</b></p>
      <p>⚠ Anomaly detected in East Region</p>

    </div>
  );
};

export default PredictiveAnalysis;