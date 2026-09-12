import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Percent,
  Calculator,
  Receipt,
  Users,
  UserCheck,
  BarChart3,
  Sparkles,
  LineChart,
  Settings,
  LogOut,
  X,
  CreditCard
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/dashboard/invoices", label: "Invoices", icon: FileText },
    { to: "/dashboard/gst", label: "GST Portal", icon: Percent, badge: "Due" },
    { to: "/dashboard/income-tax", label: "Income Tax", icon: Calculator },
    { to: "/dashboard/tds", label: "TDS Module", icon: Receipt },
    { to: "/dashboard/payroll", label: "Payroll", icon: CreditCard },
    { to: "/dashboard/clients", label: "Clients", icon: Users },
    { to: "/dashboard/employees", label: "Employees", icon: UserCheck },
    { to: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    { to: "/dashboard/ai-assistant", label: "AI Assistant", icon: Sparkles, badge: "AI" },
    { to: "/dashboard/analytics", label: "Analytics", icon: LineChart },
    { to: "/dashboard/settings", label: "Settings", icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo" className="sidebar-brand-img" />
        <div style={{ flexGrow: 1 }}>
          <div className="sidebar-brand-text">AI CA Platform</div>
          <div style={{ fontSize: "0.7rem", color: "var(--accent-secondary)", fontWeight: 600 }}>
            v2.4 ENTERPRISE
          </div>
        </div>
        <button
          onClick={onClose}
          className="topbar-icon-btn"
          style={{ width: 28, height: 28, display: isOpen ? "flex" : "none" }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-chip">
          <div className="user-avatar-chip">
            {user?.name ? user.name.charAt(0) : "A"}
          </div>
          <div className="user-info-chip">
            <div className="user-name-chip">{user?.name || "Abhinash CA"}</div>
            <div className="user-role-chip">{user?.role || "FCA Member"}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm"
          style={{ width: "100%", justifyContent: "flex-start", color: "#f87171" }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
