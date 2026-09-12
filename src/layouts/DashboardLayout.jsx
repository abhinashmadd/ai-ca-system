import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import TopHeader from "../components/dashboard/TopHeader";

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <img src="/logo.png" alt="Logo" style={{ width: 64, height: 64, animation: "pulseGlow 2s infinite" }} />
          <div style={{ marginTop: 16, color: "var(--accent-secondary)", fontWeight: 600 }}>
            Initializing CA Financial Cloud...
          </div>
        </div>
      </div>
    );
  }

  // Auth Guard: redirect to login if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="dashboard-container">
      <div className="bg-ambient" />
      <div className="bg-ambient-overlay" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="dashboard-main">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
