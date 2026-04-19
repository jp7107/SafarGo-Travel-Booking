import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/common/Toast";
import api from "../../services/api";
import { FaShieldAlt, FaLock, FaEnvelope } from "react-icons/fa";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.adminLogin(form.email, form.password);
      localStorage.setItem("safar_admin_token", data.token);
      localStorage.setItem("safar_admin", JSON.stringify(data.admin));
      showToast("Admin login successful!", "success");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      showToast(err.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page" id="admin-login-page">
      <div className="admin-login-card animate-scale-in">
        <div className="admin-login-header">
          <div className="admin-shield"><FaShieldAlt /></div>
          <h1>Admin Login</h1>
          <p>Safar Management Console</p>
        </div>

        <form onSubmit={handleSubmit} id="admin-login-form">
          <div className="input-group">
            <label className="input-label"><FaEnvelope /> Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@safar.com" required />
          </div>
          <div className="input-group">
            <label className="input-label"><FaLock /> Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: "100%" }} id="admin-login-btn">
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <button className="btn btn-ghost" onClick={() => navigate("/")} style={{ width: "100%", marginTop: "16px" }}>
          ← Back to Safar
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
