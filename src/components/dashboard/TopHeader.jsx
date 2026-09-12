import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function TopHeader({ onToggleSidebar }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "GSTR-3B Filing Due", time: "In 8 days", type: "warning" },
    { id: 2, title: "Advance Tax Q2 Calculation", time: "In 3 days", type: "critical" },
    { id: 3, title: "Invoice INV-2026-089 Paid", time: "2 hours ago", type: "success" }
  ];

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button
          onClick={onToggleSidebar}
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="topbar-title">
          Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0] || "Partner"}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search" style={{ display: "none" }}>
          <Search size={16} className="search-icon-pos" />
          <input
            type="text"
            className="form-input"
            placeholder="Search clients, GSTIN, invoices..."
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => toggleTheme()}
          className="topbar-icon-btn"
          title="Toggle Light / Dark Mode"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="topbar-icon-btn"
            title="Compliance Alerts"
          >
            <Bell size={18} />
            <span className="icon-dot"></span>
          </button>

          {showNotifications && (
            <div
              className="glass-panel"
              style={{
                position: "absolute",
                top: 50,
                right: 0,
                width: 320,
                padding: "16px",
                zIndex: 100,
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Compliance Notifications</span>
                <span className="badge badge-purple">3 New</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "10px",
                      background: "rgba(168, 85, 247, 0.08)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.825rem"
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{n.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compliance Status Badge */}
        <div className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ShieldCheck size={14} />
          <span>GSTN Live</span>
        </div>
      </div>
    </header>
  );
}
