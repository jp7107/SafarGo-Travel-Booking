import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { showToast } from "../../components/common/Toast";
import api from "../../services/api";
import { FaSearch } from "react-icons/fa";
import "./Admin.css";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async (s = "") => {
    try {
      const data = await api.getAdminUsers({ search: s });
      if (data.error) throw new Error(data.error);
      setUsers(data.users || []);
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
    fetchUsers();
  }, [navigate]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchUsers(val);
  };

  const toggleUser = async (userId) => {
    try {
      const data = await api.toggleUserStatus(userId);
      showToast(data.message, "success");
      fetchUsers(search);
    } catch {
      showToast("Failed to toggle user", "error");
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content" id="admin-users">
        <div className="admin-header">
          <h1>Users</h1>
          <p>Manage registered users</p>
        </div>

        <div className="admin-search">
          <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
            <FaSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" style={{ paddingLeft: "40px" }} placeholder="Search by name or email..." value={search} onChange={handleSearch} />
          </div>
        </div>

        <div className="glass-card admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="panel-item-avatar">
                        {u.avatar ? <img src={u.avatar} alt={u.name} referrerPolicy="no-referrer" /> : <span>{u.name?.charAt(0) || "?"}</span>}
                      </div>
                      {u.name || "No name"}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.isActive ? "badge-approved" : "badge-rejected"}`}>{u.isActive ? "Active" : "Inactive"}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td><button className="action-btn action-btn-toggle" onClick={() => toggleUser(u._id)}>{u.isActive ? "Deactivate" : "Activate"}</button></td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminUsers;
