import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { showToast } from "../../components/common/Toast";
import api from "../../services/api";
import { FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import "./Admin.css";

function AdminTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTrips = async (s = "", status = "") => {
    try {
      const params = {};
      if (s) params.search = s;
      if (status) params.status = status;
      const data = await api.getAdminTrips(params);
      if (data.error) throw new Error(data.error);
      setTrips(data.trips || []);
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
    fetchTrips();
  }, [navigate]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchTrips(e.target.value, statusFilter);
  };

  const handleFilter = (status) => {
    const newStatus = statusFilter === status ? "" : status;
    setStatusFilter(newStatus);
    fetchTrips(search, newStatus);
  };

  const updateStatus = async (tripId, status) => {
    try {
      await api.updateTripStatus(tripId, status);
      showToast(`Trip ${status}!`, "success");
      fetchTrips(search, statusFilter);
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content" id="admin-trips">
        <div className="admin-header">
          <h1>Trip Requests</h1>
          <p>Manage and approve trip submissions</p>
        </div>

        <div className="admin-search">
          <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
            <FaSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" style={{ paddingLeft: "40px" }} placeholder="Search trips..." value={search} onChange={handleSearch} />
          </div>
          <button className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`} onClick={() => handleFilter("pending")}>Pending</button>
          <button className={`filter-btn ${statusFilter === "approved" ? "active" : ""}`} onClick={() => handleFilter("approved")}>Approved</button>
          <button className={`filter-btn ${statusFilter === "rejected" ? "active" : ""}`} onClick={() => handleFilter("rejected")}>Rejected</button>
        </div>

        <div className="glass-card admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Destination</th>
                <th>Days</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.place}</td>
                  <td>{t.days}</td>
                  <td>₹{t.budget?.toLocaleString()}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {t.status !== "approved" && (
                        <button className="action-btn action-btn-approve" onClick={() => updateStatus(t._id, "approved")} title="Approve"><FaCheck /></button>
                      )}
                      {t.status !== "rejected" && (
                        <button className="action-btn action-btn-reject" onClick={() => updateStatus(t._id, "rejected")} title="Reject"><FaTimes /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No trips found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminTrips;
