import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Sparkles, Sun, Moon, ArrowRight, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="landing-nav">
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/logo.png"
          alt="AI Chartered Accountant Logo"
          style={{ width: 36, height: 36, objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.7))" }}
        />
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
            AI Chartered Accountant
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--accent-secondary)", fontWeight: 600, letterSpacing: "0.08em" }}>
            AUTONOMOUS FINANCIAL SUITE
          </div>
        </div>
      </Link>

      <nav className="landing-nav-links" style={{ display: mobileOpen ? "flex" : undefined }}>
        <a href="#about" className="landing-nav-link" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#features" className="landing-nav-link" onClick={() => setMobileOpen(false)}>Features</a>
        <a href="#how-it-works" className="landing-nav-link" onClick={() => setMobileOpen(false)}>Workflow</a>
        <a href="#pricing" className="landing-nav-link" onClick={() => setMobileOpen(false)}>Pricing</a>
        <a href="#faq" className="landing-nav-link" onClick={() => setMobileOpen(false)}>FAQ</a>
        <a href="#contact" className="landing-nav-link" onClick={() => setMobileOpen(false)}>Contact</a>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => toggleTheme()}
          className="btn-outline btn-sm"
          title="Toggle Dark / Light Theme"
          style={{ width: 36, height: 36, padding: 0 }}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Get Started <Sparkles size={14} />
            </Link>
          </div>
        )}

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: "none" }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
