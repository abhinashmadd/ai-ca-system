import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { formatINR, formatDate } from "../../utils/formatters";
import { exportService } from "../../services/exportService";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import confetti from "canvas-confetti";
import {
  FileText,
  Plus,
  Printer,
  Download,
  UploadCloud,
  Search,
  CheckCircle,
  Eye,
  Trash2
} from "lucide-react";

export default function Invoices() {
  const { invoices, clients, addInvoice, updateInvoiceStatus } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [createModal, setCreateModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // Invoice creation form
  const [formClient, setFormClient] = useState(clients[0]?.name || "");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [items, setItems] = useState([
    { desc: "Statutory Tax Audit & GSTR-9 Filing", qty: 1, rate: 85000 }
  ]);
  const [gstRate, setGstRate] = useState(18);

  const addItem = () => {
    setItems([...items, { desc: "", qty: 1, rate: 0 }]);
  };

  const removeItem = (idx) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, field, val) => {
    const next = [...items];
    next[idx][field] = field === "desc" ? val : Number(val);
    setItems(next);
  };

  const subtotal = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
  const gstAmount = Math.round((subtotal * Number(gstRate)) / 100);
  const total = subtotal + gstAmount;

  const handleCreate = (e) => {
    e.preventDefault();
    if (subtotal <= 0) {
      setToastMsg("Invoice subtotal must be greater than zero.");
      return;
    }

    const created = addInvoice({
      client: formClient,
      date: formDate,
      dueDate: formDueDate,
      subtotal,
      gstRate: Number(gstRate),
      gstAmount,
      total,
      status: "Pending",
      items
    });

    setCreateModal(false);
    setToastMsg(`Invoice ${created.id} generated successfully!`);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handlePrint = (inv) => {
    exportService.printWindow();
  };

  const handleExportCSV = () => {
    const exportData = invoices.map((inv) => ({
      InvoiceID: inv.id,
      Client: inv.client,
      Date: inv.date,
      DueDate: inv.dueDate,
      Subtotal: inv.subtotal,
      GSTAmount: inv.gstAmount,
      Total: inv.total,
      Status: inv.status
    }));
    exportService.exportCSV(exportData, "invoices_ledger.csv");
    setToastMsg("Invoices ledger exported as CSV.");
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || inv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Invoicing & Billing Engine</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Generate compliant GST tax invoices, download PDF printouts, and manage accounts receivable.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => setCreateModal(true)} className="btn btn-primary btn-sm">
            <Plus size={16} /> New Tax Invoice
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: "16px", display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flexGrow: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search by Invoice ID or Client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Paid", "Pending", "Overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`btn btn-sm ${filterStatus === status ? "btn-primary" : "btn-outline"}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-panel" style={{ padding: "20px" }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Issued Date</th>
                <th>Due Date</th>
                <th>Taxable Value</th>
                <th>GST (18%)</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600, color: "#fff", fontFamily: "var(--font-mono)" }}>
                    {inv.id}
                  </td>
                  <td>{inv.client}</td>
                  <td>{formatDate(inv.date)}</td>
                  <td>{formatDate(inv.dueDate)}</td>
                  <td>{formatINR(inv.subtotal)}</td>
                  <td>{formatINR(inv.gstAmount)}</td>
                  <td style={{ fontWeight: 700, color: "var(--accent-secondary)" }}>
                    {formatINR(inv.total)}
                  </td>
                  <td>
                    <select
                      value={inv.status}
                      onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "0.75rem",
                        borderRadius: "var(--radius-sm)",
                        background:
                          inv.status === "Paid"
                            ? "var(--success-bg)"
                            : inv.status === "Pending"
                            ? "var(--warning-bg)"
                            : "var(--danger-bg)",
                        color:
                          inv.status === "Paid"
                            ? "var(--success)"
                            : inv.status === "Pending"
                            ? "var(--warning)"
                            : "var(--danger)",
                        border: "none",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => setPreviewModal(inv)}
                        className="topbar-icon-btn"
                        style={{ width: 32, height: 32 }}
                        title="View Invoice"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => {
                          setPreviewModal(inv);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="topbar-icon-btn"
                        style={{ width: 32, height: 32 }}
                        title="Print / PDF"
                      >
                        <Printer size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create Professional GST Invoice"
        maxWidth={700}
      >
        <form onSubmit={handleCreate}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Client</label>
              <select
                className="form-select"
                value={formClient}
                onChange={(e) => setFormClient(e.target.value)}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">GST Tax Rate</label>
              <select
                className="form-select"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
              >
                <option value={18}>18% (Standard Professional Services)</option>
                <option value={12}>12% (Specified Works Contract)</option>
                <option value={5}>5% (Special Freight/Transport)</option>
                <option value={0}>0% (Exempted/Export of Services)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Invoice Date</label>
              <input
                type="date"
                className="form-input"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Line items */}
          <div style={{ margin: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-secondary)" }}>
                Service Line Items
              </span>
              <button type="button" onClick={addItem} className="btn btn-secondary btn-sm" style={{ padding: "4px 8px" }}>
                <Plus size={14} /> Add Row
              </button>
            </div>

            {items.map((it, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 2fr auto", gap: 10, marginBottom: 8, alignItems: "center" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Service description"
                  value={it.desc}
                  onChange={(e) => updateItem(idx, "desc", e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Qty"
                  min="1"
                  value={it.qty}
                  onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Rate (₹)"
                  value={it.rate}
                  onChange={(e) => updateItem(idx, "rate", e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="topbar-icon-btn"
                  style={{ width: 36, height: 36, color: "#f87171" }}
                  disabled={items.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div style={{ padding: "14px", background: "rgba(168, 85, 247, 0.08)", borderRadius: "var(--radius-md)", marginBottom: 18, fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>Taxable Subtotal:</span>
              <span style={{ fontWeight: 600 }}>{formatINR(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>GST ({gstRate}%):</span>
              <span style={{ fontWeight: 600 }}>{formatINR(gstAmount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 800, color: "var(--accent-secondary)", borderTop: "1px solid var(--border-subtle)", paddingTop: 8 }}>
              <span>Grand Total:</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Generate & Issue Invoice
          </button>
        </form>
      </Modal>

      {/* Invoice Preview & Printable Voucher Modal */}
      {previewModal && (
        <Modal
          isOpen={!!previewModal}
          onClose={() => setPreviewModal(null)}
          title={`Tax Invoice — ${previewModal.id}`}
          maxWidth={650}
        >
          <div id="printable-invoice" style={{ padding: "20px", background: "rgba(10, 6, 20, 0.95)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid var(--accent-primary)", paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, marginBottom: 6 }} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Maddheshiya & Associates</h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Chartered Accountants | ICAI Reg: 028491N</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>GSTIN: 07AAAFM1948Q1ZV</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-secondary)" }}>TAX INVOICE</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{previewModal.id}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Date: {formatDate(previewModal.date)}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Due: {formatDate(previewModal.dueDate)}</div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>Billed To:</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{previewModal.client}</div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left" }}>
                  <th style={{ padding: "8px 0" }}>Description</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {previewModal.items?.map((it, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(168, 85, 247, 0.08)" }}>
                    <td style={{ padding: "10px 0" }}>{it.desc}</td>
                    <td style={{ padding: "10px 0", textAlign: "right", fontFamily: "var(--font-mono)" }}>
                      {formatINR((it.qty || 1) * (it.rate || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
              <div>Taxable Value: <strong>{formatINR(previewModal.subtotal)}</strong></div>
              <div>IGST / CGST+SGST (18%): <strong>{formatINR(previewModal.gstAmount)}</strong></div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-secondary)", marginTop: 6 }}>
                Total Payable: {formatINR(previewModal.total)}
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm" style={{ flexGrow: 1 }}>
                <Printer size={15} /> Print / Download PDF
              </button>
              <button onClick={() => setPreviewModal(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
