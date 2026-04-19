import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { FaHome, FaPlus, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`} id="main-navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">✈️</span>
        <span className="brand-text">Safar</span>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        id="menu-toggle-btn"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`} id="nav-home">
          <FaHome /> <span>Explore</span>
        </Link>
        <Link to="/new-trip" className={`nav-link ${isActive("/new-trip") ? "active" : ""}`} id="nav-new-trip">
          <FaPlus /> <span>Plan Trip</span>
        </Link>

        {isAuthenticated && user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)} id="user-menu-btn">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="user-avatar" referrerPolicy="no-referrer" />
              ) : (
                <div className="user-avatar-placeholder">{user.name?.charAt(0) || "U"}</div>
              )}
              <span className="user-name">{user.name?.split(" ")[0]}</span>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu animate-fade-in-down">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">{user.name}</p>
                  <p className="dropdown-user-email">{user.email}</p>
                </div>
                <div className="dropdown-divider" />
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FaUser /> Profile
                </Link>
                <button className="dropdown-item dropdown-logout" onClick={handleLogout} id="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="nav-link nav-signin" id="nav-signin">
            <FaUser /> <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
