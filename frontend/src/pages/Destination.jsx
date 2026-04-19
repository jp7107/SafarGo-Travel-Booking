import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { destinations } from "../data/destinations";
import { showToast } from "../components/common/Toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import api from "../services/api";
import { FaCloudSun, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaStar } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../components/common/AuthModal";
import "./Destination.css";

function Destination() {
  const { name } = useParams();
  const place = destinations[name];
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", place: name, days: "", budget: "",
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=a617b01ce7d24b35932111358262903&q=${name}&aqi=no`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather error:", err);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [name]);

  if (!place) {
    return (
      <div className="dest-page">
        <Navbar />
        <div className="page container" style={{ textAlign: "center", paddingTop: "120px" }}>
          <h1>Destination not found</h1>
          <p>The destination "{name}" doesn't exist in our records.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSubmitting(true);
    try {
      await api.submitTrip(formData);
      setSuccess(true);
      showToast("Trip plan sent to your email! 🎉", "success");
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dest-page" id="destination-page">
      <Navbar />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="page container">
        {/* Hero */}
        <div className="dest-hero animate-fade-in-up">
          <div className="dest-hero-badge">
            <FaMapMarkerAlt /> {name}
          </div>
          <h1>{name}</h1>
          <p className="dest-description">{place.description}</p>

          {place.highlight && (
            <div className="dest-highlight">
              <FaStar className="highlight-icon" /> Must see: {place.highlight}
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className="dest-info-grid animate-fade-in-up">
          <div className="info-card glass-card">
            <FaCalendarAlt className="info-icon" />
            <div>
              <span className="info-label">Recommended</span>
              <span className="info-value">{place.days}</span>
            </div>
          </div>
          <div className="info-card glass-card">
            <FaRupeeSign className="info-icon" />
            <div>
              <span className="info-label">Budget / person</span>
              <span className="info-value">{place.budget}</span>
            </div>
          </div>

          {/* Weather */}
          {weatherLoading ? (
            <div className="info-card glass-card">
              <LoadingSpinner size="sm" />
            </div>
          ) : weather?.current ? (
            <div className="info-card glass-card weather-card">
              <img src={weather.current.condition.icon} alt="weather" className="weather-icon" />
              <div>
                <span className="info-label">Right Now</span>
                <span className="info-value">{weather.current.temp_c}°C · {weather.current.condition.text}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Gallery */}
        <div className="dest-gallery animate-fade-in">
          <Swiper
            navigation
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1,  },
              900: { slidesPerView: place.images.length > 1 ? 2 : 1 },
            }}
          >
            {place.images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="gallery-slide">
                  <img src={img.src} alt={img.title} loading="lazy" />
                  <div className="gallery-title">{img.title}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Trip Form */}
        <div className="dest-form-section">
          <form className="dest-form glass-card" onSubmit={handleSubmit} id="destination-trip-form">
            <h2>✈️ Plan your {name} trip</h2>

            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Your Name</label>
                <input className="input" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input className="input" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Days</label>
                <input className="input" name="days" type="number" placeholder="Number of days" min="1" value={formData.days} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label className="input-label">Budget (₹)</label>
                <input className="input" name="budget" type="number" placeholder="Your budget" min="0" value={formData.budget} onChange={handleChange} required />
              </div>
            </div>

            {success && (
              <div className="success-banner animate-scale-in">
                🎉 Your trip plan has been sent to your email!
              </div>
            )}

            <button className="btn btn-amber btn-lg" type="submit" disabled={submitting} id="dest-submit-btn">
              <FaCloudSun /> {submitting ? "Planning your trip..." : "Plan My Trip ✈️"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Destination;
