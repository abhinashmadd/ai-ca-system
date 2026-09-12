import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Heart, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32 }} />
            <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>AI Chartered Accountant</span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 360, marginBottom: 20 }}>
            Next-generation autonomous financial intelligence and audit management platform engineered for modern CA firms, CFOs, and tax practitioners across India.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="https://github.com/abhinashmadd" target="_blank" rel="noreferrer" className="topbar-icon-btn" title="GitHub">
              <Github size={18} />
            </a>
            <a href="#twitter" className="topbar-icon-btn" title="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#linkedin" className="topbar-icon-btn" title="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="mailto:absmadd@gmail.com" className="topbar-icon-btn" title="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 18, color: "var(--accent-secondary)" }}>
            Modules
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: "0.875rem", color: "var(--text-muted)" }}>
            <li><Link to="/login">AI Invoice OCR</Link></li>
            <li><Link to="/login">GST Automation & Filing</Link></li>
            <li><Link to="/login">Income Tax & Slabs</Link></li>
            <li><Link to="/login">TDS Reconciliation</Link></li>
            <li><Link to="/login">Statutory Audit Engine</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 18, color: "var(--accent-secondary)" }}>
            Resources
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: "0.875rem", color: "var(--text-muted)" }}>
            <li><a href="#faq">Compliance Calendar</a></li>
            <li><a href="#faq">Tax Slab Comparison</a></li>
            <li><a href="#about">ICAI Standards Alignment</a></li>
            <li><a href="#pricing">Pricing Plans</a></li>
            <li><a href="#contact">Support Desk</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 18, color: "var(--accent-secondary)" }}>
            Security & Trust
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>256-bit AES Encryption</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>GSTN Sandbox Ready</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>ISO 27001 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} AI Chartered Accountant Automation Suite. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#security">Security Overview</a>
        </div>
      </div>
    </footer>
  );
}
