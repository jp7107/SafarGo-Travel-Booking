import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../services/api";
import { FaSearch } from "react-icons/fa";
import "./Admin.css";

function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = async (s = "") => {
    try {
      const params = {};
      if (s) params.search = s;
      const data = await api.getAdminBookings(params);
      if (data.error) throw new Error(data.error);
      setBookings(data.bookings || []);
    } catch {
      navigate("/admin/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("safar_admin_token")) {
      navigate("/admin/login", { replace: true });
      return;
    }
    fetchBookings();
  }, [navigate]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchBookings(e.target.value);
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content" id="admin-bookings">
        <div className="admin-header">
          <h1>Bookings</h1>
          <p>View all trip bookings</p>
        </div>

        <div className="admin-search">
          <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
            <FaSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" style={{ paddingLeft: "40px" }} placeholder="Search by destination..." value={search} onChange={handleSearch} />
          </div>
        </div>

        <div className="glass-card admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Destination</th>
                <th>Start</th>
                <th>End</th>
                <th>Travelers</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.userId?.name || b.userId?.email || "—"}</td>
                  <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{b.destination}</td>
                  <td>{new Date(b.startDate).toLocaleDateString()}</td>
                  <td>{new Date(b.endDate).toLocaleDateString()}</td>
                  <td>{b.travelers}</td>
                  <td>₹{b.totalBudget?.toLocaleString()}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td><span className={`badge ${b.paymentStatus === "paid" ? "badge-approved" : "badge-pending"}`}>{b.paymentStatus}</span></td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminBookings;
