import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content container">
        <div className="footer-brand">
          <h3>✈️ Safar</h3>
          <p>Safar khoobsurat hai... manzil se bhi</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Explore</h4>
            <Link to="/dashboard">Destinations</Link>
            <Link to="/new-trip">Plan a Trip</Link>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/">About Us</Link>
            <Link to="/">Contact</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} Safar. All rights reserved.</p>
        <p>Built with ❤️ for travelers</p>
      </div>
    </footer>
  );
}

export default Footer;
