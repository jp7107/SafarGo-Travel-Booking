import { useNavigate } from "react-router-dom";
import { FaTimes, FaUserCircle, FaUserPlus } from "react-icons/fa";
import "./AuthModal.css";

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="auth-modal-card animate-scale-in glass-card"
        onClick={(e) => e.stopPropagation()} 
      >
        <button className="auth-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="auth-modal-icon-wrapper">
          <span className="auth-modal-icon">🔒</span>
        </div>
        
        <h2>Authentication Required</h2>
        <p>You must log in or create an account to continue planning your trip.</p>
        
        <div className="auth-modal-actions">
          <button 
            className="btn btn-primary auth-btn" 
            onClick={() => navigate("/signin")}
          >
            <FaUserCircle /> Login
          </button>
          
          <button 
            className="btn btn-secondary auth-btn" 
            onClick={() => navigate("/signin")}
          >
            <FaUserPlus /> Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
