import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import Navbar from "../components/common/Navbar";
import api from "../services/api";
import { FcGoogle } from "react-icons/fc";
import { FaShieldAlt } from "react-icons/fa";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = api.getGoogleAuthUrl();
  };

  return (
    <div className="signin-page" id="signin-page">
      <Navbar />

      <div className="signin-bg">
        <video autoPlay muted loop playsInline className="signin-video">
          <source src="/SignIn.mp4" type="video/mp4" />
        </video>
        <div className="signin-overlay" />
      </div>

      <div className="signin-content">
        <div className="signin-card animate-scale-in">
          <div className="signin-brand">
            <span className="signin-icon">✈️</span>
            <h1>Welcome to Safar</h1>
            <p>Sign in to plan your perfect trip</p>
          </div>

          <button className="google-btn" onClick={handleGoogleLogin} id="google-signin-btn">
            <FcGoogle size={22} />
            <span>Continue with Google</span>
          </button>

          <div className="signin-divider">
            <span>or</span>
          </div>

          <button className="admin-btn btn btn-ghost" onClick={() => navigate("/admin/login")} id="admin-login-link">
            <FaShieldAlt /> Admin Login
          </button>

          <p className="signin-terms">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
