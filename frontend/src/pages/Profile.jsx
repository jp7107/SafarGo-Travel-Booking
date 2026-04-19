import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { showToast } from "../components/common/Toast";
import api from "../services/api";
import { FaUser, FaEnvelope, FaPhone, FaSave } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(form);
      await refreshUser();
      showToast("Profile updated!", "success");
      setEditing(false);
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page" id="profile-page">
      <Navbar />
      <div className="page container">
        <div className="profile-card glass-card animate-fade-in-up">
          <div className="profile-header">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="profile-avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="profile-avatar-placeholder">{user.name?.charAt(0) || "U"}</div>
            )}
            <h1>{user.name}</h1>
            <p className="profile-email"><FaEnvelope /> {user.email}</p>
          </div>

          <div className="profile-details">
            {editing ? (
              <div className="profile-form">
                <div className="input-group">
                  <label className="input-label"><FaUser /> Name</label>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="input-label"><FaPhone /> Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Add phone number" />
                </div>
                <div className="profile-actions">
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    <FaSave /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <div className="info-row"><span className="info-key"><FaUser /> Name</span><span>{user.name}</span></div>
                <div className="info-row"><span className="info-key"><FaEnvelope /> Email</span><span>{user.email}</span></div>
                <div className="info-row"><span className="info-key"><FaPhone /> Phone</span><span>{user.phone || "Not set"}</span></div>
                <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
