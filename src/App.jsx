import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import LandingPage from "./pages/public/LandingPage";
import Login from "./pages/public/Login";
import SignUp from "./pages/public/SignUp";
import ForgotPassword from "./pages/public/ForgotPassword";

// Dashboard Pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import Invoices from "./pages/dashboard/Invoices";
import GST from "./pages/dashboard/GST";
import IncomeTax from "./pages/dashboard/IncomeTax";
import TDS from "./pages/dashboard/TDS";
import Payroll from "./pages/dashboard/Payroll";
import Clients from "./pages/dashboard/Clients";
import Employees from "./pages/dashboard/Employees";
import Reports from "./pages/dashboard/Reports";
import AIAssistant from "./pages/dashboard/AIAssistant";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="gst" element={<GST />} />
                <Route path="income-tax" element={<IncomeTax />} />
                <Route path="tds" element={<TDS />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="clients" element={<Clients />} />
                <Route path="employees" element={<Employees />} />
                <Route path="reports" element={<Reports />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
