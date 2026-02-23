import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="hero">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src="/VoteVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Content */}
        <div className="hero-overlay">
          <h1>Ensuring Transparent & Fair Elections</h1>
          <p>
            Real-time monitoring, issue reporting, and transparent election analytics for upcoming voters.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => alert("View Live Data Clicked")}
            >
              View Live Data
            </button>

            <button
              className="secondary-btn"
              onClick={() => alert("Report Issue Clicked")}
            >
              Report Issue
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Choose Our Election Monitoring System?</h2>

        <div className="feature-cards">
          <div className="card">
            <h3>Real-Time Monitoring</h3>
            <p>
              Track election activities and live updates securely and transparently.
            </p>
          </div>

          <div className="card">
            <h3>Secure Reporting</h3>
            <p>
              Report issues anonymously with end-to-end encrypted data submission.
            </p>
          </div>

          <div className="card">
            <h3>Data Transparency</h3>
            <p>
              Access transparent election analytics and public audit reports easily.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <h2>How It Works</h2>
        <p>Simple 3-step process to monitor elections efficiently.</p>

        <div className="steps">
          <div>
            <div className="icon">👤</div>
            <h4>Register & Login</h4>
          </div>
          <div>
            <div className="icon">⚠️</div>
            <h4>Report Issues</h4>
          </div>
          <div>
            <div className="icon">📊</div>
            <h4>View Analytics</h4>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
<section className="cta">
  <h2>Ready to Monitor Elections Transparently?</h2>
  <p>
    Join our secure platform and ensure fair, transparent election processes today.
  </p>

  <button
    className="cta-btn"
    onClick={() => navigate("/signup")}
  >
    Get Started Now
  </button>
</section>
    </>
  );
};

export default Home;
