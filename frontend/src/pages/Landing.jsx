import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page" id="landing-page">
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/Landing_page.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-badge animate-fade-in-down">
            <span>🌏</span> Discover India's Hidden Gems
          </div>

          <h1 className="hero-title">
            <span className="hero-line-1">Safar khoobsurat hai...</span>
            <span className="hero-line-2">manzil se bhi</span>
          </h1>

          <p className="hero-subtitle">
            Plan your perfect Indian getaway. Explore breathtaking destinations, 
            craft custom itineraries, and create memories that last forever.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg hero-cta"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/dashboard")}
              id="hero-explore-btn"
            >
              Explore Destinations ✈️
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate("/new-trip")}
              id="hero-plan-btn"
            >
              Plan Your Trip
            </button>
          </div>

          <div className="hero-stats animate-fade-in">
            <div className="stat-item">
              <span className="stat-number">12+</span>
              <span className="stat-label">Destinations</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Trips Planned</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </section>

      {/* Features */}
      <section className="features-section container">
        <h2 className="section-title">Why Travel with Safar?</h2>
        <p className="section-subtitle">We make travel planning simple, smart, and unforgettable</p>

        <div className="features-grid stagger-children">
          <div className="feature-card glass-card">
            <div className="feature-icon">🗺️</div>
            <h3>Curated Destinations</h3>
            <p>Hand-picked Indian destinations with real photos, weather data, and local insights.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">💰</div>
            <h3>Budget Planning</h3>
            <p>Get accurate budget estimates and plan trips that fit your wallet perfectly.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">📧</div>
            <h3>Instant Itineraries</h3>
            <p>Receive detailed trip plans straight to your inbox within minutes.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">🌤️</div>
            <h3>Live Weather</h3>
            <p>Real-time weather updates for every destination to help you pack right.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
