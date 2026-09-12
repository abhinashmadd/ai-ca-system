import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function PublicLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="bg-ambient" />
      <div className="bg-ambient-overlay" />
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
