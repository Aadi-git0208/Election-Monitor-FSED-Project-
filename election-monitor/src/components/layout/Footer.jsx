import React from 'react';
import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>Election Monitor</h3>
          <p>Ensuring fair, transparent elections through secure monitoring.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>Reports</p>
          <p>Dashboard</p>
          <p>Login</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>support@electionmonitor.com</p>
          <p>+91 98765 43210</p>
        </div>
      </div>

      <div className="copyright">
        © 2026 Election Monitor. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
