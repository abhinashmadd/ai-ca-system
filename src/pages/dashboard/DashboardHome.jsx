import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatINR } from "../../utils/formatters";
import { REVENUE_MONTHLY_CHART } from "../../utils/mockData";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import ComplianceCalendar from "../../components/dashboard/ComplianceCalendar";
import { RevenueAreaChart, ExpenseDonutChart } from "../../components/charts/Charts";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import confetti from "canvas-confetti";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Wallet,
  PiggyBank,
  ShieldAlert,
  ArrowRight,
  FileText,
  PlusCircle,
  Eye,
  Check
} from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const { clients, invoices, gstRecords, addInvoice, addClient } = useData();

  const [newInvoiceModal, setNewInvoiceModal] = useState(false);
  const [newClientModal, setNewClientModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Invoice form state
  const [invClient, setInvClient] = useState(clients[0]?.name || "");
  const [invDesc, setInvDesc] = useState("Statutory Audit & Tax Representation");
  const [invAmount, setInvAmount] = useState(75000);

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: "",
    pan: "",
    gstin: "",
    type: "Private Limited",
    email: "",
    phone: "",
    turnover: "₹5.0 Cr"
  });

  // KPI Calculations
  const totalClients = clients.length;
  const pendingReturns = clients.reduce((acc, c) => acc + (c.pendingReturns || 0), 0) + 2;
  const gstFiledCount = gstRecords.filter((g) => g.status === "Filed").length;
  const monthlyRevenue = 1920000;
  const monthlyProfit = 1410000;
  const monthlyExpenses = 510000;
  const taxSaved = 684000;

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const base = Number(invAmount);
    const gst = Math.round(base * 0.18);
    const created = addInvoice({
      client: invClient,
      subtotal: base,
      gstRate: 18,
      gstAmount: gst,
      total: base + gst,
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      items: [{ desc: invDesc, qty: 1, rate: base }]
    });

    setNewInvoiceModal(false);
    setToastMsg(`Invoice ${created.id} generated for ${invClient}!`);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.pan) {
      setToastMsg("Client Name and PAN are required.");
      return;
    }
    const created = addClient(clientForm);
    setNewClientModal(false);
    setToastMsg(`Client ${created.name} registered successfully!`);
    setClientForm({
      name: "",
      pan: "",
      gstin: "",
      type: "Private Limited",
      email: "",
      phone: "",
      turnover: "₹5.0 Cr"
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      {/* Top Banner / Welcome */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          background: "linear-gradient(135deg, rgba(35, 18, 66, 0.85) 0%, rgba(18, 11, 36, 0.85) 100%)",
          borderColor: "var(--border-focus)"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="badge badge-purple">ICAI Practice Portal</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
              Firm: {user?.firmName || "Maddheshiya & Associates CA"}
            </span>
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>
            Financial Intelligence & Audit Radar
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            All systems synchronized with GSTN Sandbox and Income Tax E-filing API.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setNewInvoiceModal(true)} className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>Create Invoice</span>
          </button>
          <button onClick={() => setNewClientModal(true)} className="btn btn-secondary btn-sm">
            <Users size={15} />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Clients"
          value={totalClients}
          change="+18%"
          isPositive={true}
          icon={Users}
          color="#a855f7"
        />
        <StatCard
          title="Pending Returns"
          value={pendingReturns}
          change="-2"
          isPositive={true}
          icon={AlertTriangle}
          color="#f59e0b"
        />
        <StatCard
          title="GST Returns Filed"
          value={`${gstFiledCount}/4`}
          change="+100%"
          isPositive={true}
          icon={CheckCircle2}
          color="#10b981"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatINR(monthlyRevenue)}
          change="+24%"
          isPositive={true}
          icon={TrendingUp}
          color="#c084fc"
        />
        <StatCard
          title="Net Profit"
          value={formatINR(monthlyProfit)}
          change="+19%"
          isPositive={true}
          icon={Wallet}
          color="#10b981"
        />
        <StatCard
          title="Firm Expenses"
          value={formatINR(monthlyExpenses)}
          change="+6%"
          isPositive={false}
          icon={PiggyBank}
          color="#ec4899"
        />
        <StatCard
          title="Client Tax Saved"
          value={formatINR(taxSaved)}
          change="+32%"
          isPositive={true}
          icon={CheckCircle2}
          color="#06b6d4"
        />
        <StatCard
          title="Audit Flags"
          value="2 Pending"
          change="Urgent"
          isPositive={false}
          icon={ShieldAlert}
          color="#ef4444"
        />
      </div>

      {/* Quick Actions Shortcuts */}
      <QuickActions
        onOpenNewInvoice={() => setNewInvoiceModal(true)}
        onOpenNewClient={() => setNewClientModal(true)}
      />

      {/* Charts Row: Revenue & Expense Trends */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Revenue & Operating Cash Flow</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Past 6 months audit and consulting receivables</p>
            </div>
            <span className="badge badge-purple">FY 2026-27</span>
          </div>
          <RevenueAreaChart data={REVENUE_MONTHLY_CHART} />
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6 }}>Operating Expenses</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 24 }}>Disbursement distribution</p>
          <ExpenseDonutChart />
        </div>
      </div>

      {/* Compliance Calendar & Recent Activities */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <ComplianceCalendar />

        {/* Recent Invoices / Activity Table */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Recent Invoices & Filings</h3>
            <Link to="/dashboard/invoices" style={{ fontSize: "0.8rem", color: "var(--accent-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 4).map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600, color: "#fff", fontFamily: "var(--font-mono)" }}>
                      {inv.id}
                    </td>
                    <td>{inv.client}</td>
                    <td style={{ fontWeight: 600, color: "var(--accent-secondary)" }}>
                      {formatINR(inv.total)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          inv.status === "Paid"
                            ? "badge-success"
                            : inv.status === "Pending"
                            ? "badge-warning"
                            : "badge-danger"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Create Invoice */}
      <Modal
        isOpen={newInvoiceModal}
        onClose={() => setNewInvoiceModal(false)}
        title="Generate New GST Tax Invoice"
      >
        <form onSubmit={handleCreateInvoice}>
          <div className="form-group">
            <label className="form-label">Select Client</label>
            <select
              className="form-select"
              value={invClient}
              onChange={(e) => setInvClient(e.target.value)}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.gstin})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Service Description</label>
            <input
              type="text"
              className="form-input"
              value={invDesc}
              onChange={(e) => setInvDesc(e.target.value)}
              placeholder="e.g. Monthly GST Reconciliation & Form 3CD Audit"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Base Fee Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              value={invAmount}
              onChange={(e) => setInvAmount(e.target.value)}
              min="1000"
              step="1000"
              required
            />
          </div>

          <div
            style={{
              padding: "12px",
              background: "rgba(168, 85, 247, 0.08)",
              borderRadius: "var(--radius-md)",
              marginBottom: 20,
              fontSize: "0.85rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>Base Amount:</span>
              <span>{formatINR(Number(invAmount))}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>18% GST (CGST 9% + SGST 9%):</span>
              <span>{formatINR(Math.round(Number(invAmount) * 0.18))}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--accent-secondary)", paddingTop: 6, borderTop: "1px solid var(--border-subtle)" }}>
              <span>Total Receivable:</span>
              <span>{formatINR(Math.round(Number(invAmount) * 1.18))}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Generate & Issue Invoice
          </button>
        </form>
      </Modal>

      {/* Modal: Add Client */}
      <Modal
        isOpen={newClientModal}
        onClose={() => setNewClientModal(false)}
        title="Onboard New Corporate Client"
      >
        <form onSubmit={handleCreateClient}>
          <div className="form-group">
            <label className="form-label">Company / Entity Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bharat Logistics Private Limited"
              value={clientForm.name}
              onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="AAACB1234K"
                maxLength={10}
                value={clientForm.pan}
                onChange={(e) => setClientForm({ ...clientForm, pan: e.target.value.toUpperCase() })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">GSTIN</label>
              <input
                type="text"
                className="form-input"
                placeholder="07AAACB1234K1Z5"
                maxLength={15}
                value={clientForm.gstin}
                onChange={(e) => setClientForm({ ...clientForm, gstin: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="accounts@entity.in"
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Annual Turnover</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ₹12.5 Cr"
                value={clientForm.turnover}
                onChange={(e) => setClientForm({ ...clientForm, turnover: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 12 }}>
            Register Client Profile
          </button>
        </form>
      </Modal>
    </div>
  );
}
