import { NavLink, useNavigate } from "react-router-dom";
import { FaChartBar, FaUsers, FaMapMarkerAlt, FaCalendarCheck, FaSignOutAlt, FaPlane } from "react-icons/fa";
import "./AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("safar_admin_token");
    localStorage.removeItem("safar_admin");
    navigate("/admin/login", { replace: true });
  };

  const links = [
    { to: "/admin/dashboard", icon: <FaChartBar />, label: "Dashboard" },
    { to: "/admin/users", icon: <FaUsers />, label: "Users" },
    { to: "/admin/trips", icon: <FaMapMarkerAlt />, label: "Trips" },
    { to: "/admin/bookings", icon: <FaCalendarCheck />, label: "Bookings" },
  ];

  return (
    <aside className="admin-sidebar" id="admin-sidebar">
      <div className="sidebar-brand">
        <FaPlane className="sidebar-brand-icon" />
        <span>Safar Admin</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout} id="admin-logout-btn">
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default AdminSidebar;
