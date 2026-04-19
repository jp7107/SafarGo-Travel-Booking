import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../services/api";
import { FaUsers, FaMapMarkerAlt, FaClock, FaCheck, FaTimes } from "react-icons/fa";
import "./Admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("safar_admin_token");
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    api.getAdminDashboard()
      .then((d) => { if (d.error) throw new Error(d.error); setData(d); })
      .catch(() => navigate("/admin/login", { replace: true }))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <LoadingSpinner fullPage text="Loading dashboard..." />;
  if (!data) return null;

  const { stats, recentUsers, recentTrips } = data;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: <FaUsers />, color: "#3b82f6" },
    { label: "Total Trips", value: stats.totalTrips, icon: <FaMapMarkerAlt />, color: "#8b5cf6" },
    { label: "Pending Approvals", value: stats.pendingTrips, icon: <FaClock />, color: "#f59e0b" },
    { label: "Approved Trips", value: stats.approvedTrips, icon: <FaCheck />, color: "#10b981" },
    { label: "Rejected", value: stats.rejectedTrips, icon: <FaTimes />, color: "#f43f5e" },
    { label: "Total Bookings", value: stats.totalBookings, icon: <FaMapMarkerAlt />, color: "#06b6d4" },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content" id="admin-dashboard">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome back, Admin</p>
        </div>

        <div className="stats-grid stagger-children">
          {statCards.map((s) => (
            <div key={s.label} className="stat-card glass-card">
              <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
              <div>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-panels">
          <div className="admin-panel glass-card">
            <h3>Recent Users</h3>
            <div className="panel-list">
              {recentUsers?.map((u) => (
                <div key={u._id} className="panel-item">
                  <div className="panel-item-avatar">
                    {u.avatar ? <img src={u.avatar} alt={u.name} referrerPolicy="no-referrer" /> : <span>{u.name?.charAt(0) || "?"}</span>}
                  </div>
                  <div className="panel-item-info">
                    <span className="panel-item-name">{u.name || "No name"}</span>
                    <span className="panel-item-meta">{u.email}</span>
                  </div>
                  <span className="panel-item-date">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-panel glass-card">
            <h3>Recent Trips</h3>
            <div className="panel-list">
              {recentTrips?.map((t) => (
                <div key={t._id} className="panel-item">
                  <div className="panel-item-info">
                    <span className="panel-item-name">{t.name}</span>
                    <span className="panel-item-meta">{t.place}</span>
                  </div>
                  <span className={`badge badge-${t.status}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
