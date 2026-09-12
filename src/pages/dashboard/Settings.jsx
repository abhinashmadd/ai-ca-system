import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Toast from "../../components/common/Toast";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Shield,
  Bell,
  Globe,
  User,
  CheckCircle2,
  Save
} from "lucide-react";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const [toastMsg, setToastMsg] = useState("");

  const [name, setName] = useState(user?.name || "CA Abhinash Maddheshiya");
  const [firmName, setFirmName] = useState(user?.firmName || "Maddheshiya & Associates CA");
  const [membershipNo, setMembershipNo] = useState(user?.membershipNo || "FCA-849201");

  const [notifications, setNotifications] = useState({
    gstDeadlines: true,
    advanceTax: true,
    invoiceAlerts: true,
    aiAnomalyAlerts: true
  });

  const [language, setLanguage] = useState("en-IN");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, firmName, membershipNo });
    setToastMsg("Profile preferences saved successfully!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 840 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Firm Settings & Preferences</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Manage your CA practice profile, appearance themes, security configurations, and statutory notification thresholds.
        </p>
      </div>

      {/* 1. Theme Configuration */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <Sun size={18} color="var(--accent-secondary)" />
          <span>Interface Appearance Theme</span>
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div
            onClick={() => setTheme("midnight")}
            style={{
              padding: "16px",
              borderRadius: "var(--radius-md)",
              border: `2px solid ${theme === "midnight" ? "var(--accent-primary)" : "var(--border-subtle)"}`,
              background: "rgba(10, 6, 20, 0.8)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12
            }}
          >
            <Moon size={20} color="#a855f7" />
            <div>
              <div style={{ fontWeight: 700 }}>Midnight Violet (Default)</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Luxury royal orchid dark mode</div>
            </div>
          </div>

          <div
            onClick={() => setTheme("light")}
            style={{
              padding: "16px",
              borderRadius: "var(--radius-md)",
              border: `2px solid ${theme === "light" ? "var(--accent-primary)" : "var(--border-subtle)"}`,
              background: "rgba(255, 255, 255, 0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12
            }}
          >
            <Sun size={20} color="#f59e0b" />
            <div>
              <div style={{ fontWeight: 700 }}>Daylight High-Contrast</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Clean white corporate view</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile Details */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <User size={18} color="var(--accent-secondary)" />
          <span>Chartered Accountant Practice Profile</span>
        </h3>

        <form onSubmit={handleSaveProfile}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Principal Partner Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ICAI Membership Number</label>
              <input
                type="text"
                className="form-input"
                value={membershipNo}
                onChange={(e) => setMembershipNo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Registered CA Firm Name</label>
            <input
              type="text"
              className="form-input"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
            <Save size={15} /> Save Profile Changes
          </button>
        </form>
      </div>

      {/* 3. Statutory Notifications & Language */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={18} color="var(--accent-secondary)" />
          <span>Statutory Compliance Alerts & Regional Language</span>
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Object.entries({
            gstDeadlines: "GSTR-1 & GSTR-3B Statutory Deadline Countdown",
            advanceTax: "Quarterly Advance Tax 45% / 75% Reminders",
            invoiceAlerts: "Payment Overdue & Client Receivables Reminders",
            aiAnomalyAlerts: "AI Anomaly Flags on Bank Cash Deposits >₹50,000"
          }).map(([key, label]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{label}</span>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: "var(--accent-primary)", cursor: "pointer" }}
              />
            </div>
          ))}

          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 16, marginTop: 8 }}>
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Globe size={16} /> Regional Numeric & Tax Language
            </label>
            <select
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ maxWidth: 300 }}
            >
              <option value="en-IN">English (India — Lakhs / Crores ₹)</option>
              <option value="hi-IN">Hindi / Devanagari numerals</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
