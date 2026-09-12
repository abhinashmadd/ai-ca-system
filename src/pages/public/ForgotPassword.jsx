import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { forgotPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to initiate password reset.");
    }
  };

  return (
    <div style={{ padding: "60px 24px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: 440, padding: "40px 32px" }}>
        <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent-secondary)", fontSize: "0.85rem", marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>Reset Credentials</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: 24, lineHeight: 1.6 }}>
          Enter your registered CA practice email and we'll send a secure one-time password recovery verification link.
        </p>

        {submitted ? (
          <div
            style={{
              padding: "20px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "var(--radius-md)",
              color: "#34d399",
              textAlign: "center"
            }}
          >
            <CheckCircle2 size={36} style={{ margin: "0 auto 12px" }} />
            <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Reset Instructions Dispatched</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              We've dispatched recovery steps to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  padding: "10px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-md)",
                  color: "#f87171",
                  fontSize: "0.85rem",
                  marginBottom: 16
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Practice Email Address</label>
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 8 }}
              disabled={loading}
            >
              {loading ? "Sending Recovery Link..." : "Send Reset Instructions"} <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
