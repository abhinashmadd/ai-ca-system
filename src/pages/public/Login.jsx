import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("ca.abhinash@firm.com");
  const [password, setPassword] = useState("SecureCA@2026");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    }
  };

  return (
    <div style={{ padding: "60px 24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: 460, padding: "40px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 54, height: 54, marginBottom: 12, filter: "drop-shadow(0 0 12px rgba(168, 85, 247, 0.7))" }}
          />
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: 4 }}>
            Sign in to access your Chartered Accountant workspace
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
            <label className="form-label">Registered Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="ca.partner@firm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: "0.75rem", color: "var(--accent-secondary)", fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Verifying Credentials..." : "Authenticate & Enter"} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Don't have a firm account?{" "}
          <Link to="/signup" style={{ color: "var(--accent-secondary)", fontWeight: 700 }}>
            Register New CA Firm
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28, fontSize: "0.75rem", color: "var(--text-dim)" }}>
          <ShieldCheck size={14} color="var(--success)" />
          <span>Encrypted with ICAI compliance guidelines</span>
        </div>
      </div>
    </div>
  );
}
