import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Lock, Mail, Building2, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    firmName: "",
    role: "Chartered Accountant"
  });
  const [error, setError] = useState("");
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.firmName) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div style={{ padding: "60px 24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: 500, padding: "40px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 50, height: 50, marginBottom: 12, filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.7))" }}
          />
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Create CA Firm Account</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: 4 }}>
            Deploy autonomous financial intelligence for your practice
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "12px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--radius-md)",
              color: "#f87171",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name & ICAI Designation</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="e.g. CA Abhinash Maddheshiya"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Chartered Accountant Firm Name</label>
            <div style={{ position: "relative" }}>
              <Building2 size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="e.g. Maddheshiya & Associates CA"
                value={formData.firmName}
                onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Practice Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="partner@ca-firm.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min 6 Characters)</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Creating Firm Account..." : "Complete Registration"} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Already have an active account?{" "}
          <Link to="/login" style={{ color: "var(--accent-secondary)", fontWeight: 700 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
