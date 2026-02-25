import React from "react";
import "./ExportReports.css";

const ExportReports = () => {

  const exportCSV = () => {
    const data = "Region, Votes\nNorth, 2000\nSouth, 1500";
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };

  return (
    <div className="export-container">

      <button>Download PDF</button>
      <button onClick={exportCSV}>Export CSV</button>
      <button>Share to Admin</button>

    </div>
  );
};

export default ExportReports;