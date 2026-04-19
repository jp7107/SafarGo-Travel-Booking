import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { placeCards } from "../data/destinations";
import { FaSearch, FaMapMarkerAlt, FaClock, FaRupeeSign } from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = placeCards.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page" id="dashboard-page">
      <Navbar />

      <div className="page container">
        {/* Header */}
        <div className="dash-header animate-fade-in-up">
          <h1>Explore <span className="gradient-text">Destinations</span></h1>
          <p>Discover the most beautiful places across India</p>

          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              id="destination-search"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="destinations-grid stagger-children">
          {filtered.map((place) => (
            <div
              key={place.name}
              className="dest-card"
              onClick={() => navigate(`/destination/${place.name}`)}
              id={`card-${place.name.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="dest-card-img-wrap">
                <img src={place.img} alt={place.name} loading="lazy" />
                <div className="dest-card-overlay">
                  <div className="dest-card-info">
                    <h3>{place.name}</h3>
                    <div className="dest-card-meta">
                      <span><FaClock /> {place.days}</span>
                      <span><FaRupeeSign /> {place.budget}</span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm">Explore →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="no-results">
            <FaMapMarkerAlt size={40} />
            <h3>No destinations found</h3>
            <p>Try searching for a different location</p>
          </div>
        )}

        {/* Map */}
        <div className="map-section glass-card">
          <h2>📍 Explore Destinations Across India</h2>
          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=India&t=&z=5&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "12px" }}
              loading="lazy"
              title="India Map"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
