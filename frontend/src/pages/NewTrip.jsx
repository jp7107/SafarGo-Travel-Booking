import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { placeCards } from "../data/destinations";
import { showToast } from "../components/common/Toast";
import api from "../services/api";
import { FaPlus, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../components/common/AuthModal";
import "./NewTrip.css";

function NewTrip() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", place: "", days: "", budget: "", people: "1", notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    try {
      await api.submitTrip(formData);
      showToast("Trip request submitted! Check your email 📩", "success");
      setFormData({ name: "", email: "", place: "", days: "", budget: "", people: "1", notes: "" });
      setShowForm(false);
    } catch {
      showToast("Failed to submit trip request", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newtrip-page" id="new-trip-page">
      <Navbar />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="page container">
        <div className="newtrip-header animate-fade-in-up">
          <h1>Plan Your <span className="gradient-text">Dream Trip</span></h1>
          <p>Create a custom itinerary or explore recommended destinations</p>

          <button className="btn btn-primary btn-lg" onClick={() => setShowForm(!showForm)} id="toggle-trip-form">
            {showForm ? <><FaTimes /> Close Form</> : <><FaPlus /> Plan Your Own Trip</>}
          </button>
        </div>

        {/* Trip Form */}
        {showForm && (
          <div className="trip-form-wrapper animate-scale-in">
            <form className="trip-form glass-card" onSubmit={handleSubmit} id="trip-plan-form">
              <h2>📝 Trip Details</h2>

              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Your Name</label>
                  <input className="input" type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input className="input" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Destination</label>
                  <input className="input" type="text" name="place" placeholder="e.g. Goa, Manali" value={formData.place} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Days</label>
                  <input className="input" type="number" name="days" placeholder="5" min="1" value={formData.days} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Budget (₹)</label>
                  <input className="input" type="number" name="budget" placeholder="15000" min="0" value={formData.budget} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label className="input-label">People</label>
                  <input className="input" type="number" name="people" placeholder="2" min="1" value={formData.people} onChange={handleChange} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Special Notes (optional)</label>
                <input className="input" type="text" name="notes" placeholder="Any preferences, allergies, etc." value={formData.notes} onChange={handleChange} />
              </div>

              <button className="btn btn-amber btn-lg" type="submit" disabled={loading} id="submit-trip-btn">
                <FaPaperPlane /> {loading ? "Submitting..." : "Plan My Trip ✈️"}
              </button>
            </form>
          </div>
        )}

        {/* Destinations */}
        <h2 className="section-heading">🏔️ Recommended Destinations</h2>

        <div className="places-grid stagger-children">
          {placeCards.map((place) => (
            <div
              key={place.name}
              className="place-card"
              onClick={() => navigate(`/destination/${place.name}`)}
            >
              <img src={place.img} alt={place.name} loading="lazy" />
              <div className="place-card-overlay">
                <h3>{place.name}</h3>
                <span className="place-tag">{place.days}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NewTrip;
