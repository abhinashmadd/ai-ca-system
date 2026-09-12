import React, { useState } from "react";
import { formatINR } from "../../utils/formatters";
import { exportService } from "../../services/exportService";
import Toast from "../../components/common/Toast";
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Printer,
  Scale,
  TrendingUp,
  FileText,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("balanceSheet");
  const [toastMsg, setToastMsg] = useState("");

  const handleExportCSV = () => {
    let reportData = [];
    if (activeTab === "balanceSheet") {
      reportData = [
        { Classification: "Equity Share Capital", Note: "1", Amount: 5000000 },
        { Classification: "Reserves and Surplus", Note: "2", Amount: 14200000 },
        { Classification: "Long-Term Borrowings", Note: "3", Amount: 3800000 },
        { Classification: "Trade Payables", Note: "4", Amount: 2450000 },
        { Classification: "Property, Plant & Equipment", Note: "5", Amount: 12500000 },
        { Classification: "Current Financial Assets & Cash", Note: "6", Amount: 12950000 }
      ];
    } else {
      reportData = [
        { LineItem: "Revenue from Operations", Amount: 28400000 },
        { LineItem: "Other Income", Amount: 650000 },
        { LineItem: "Employee Benefits Expense", Amount: 8400000 },
        { LineItem: "Finance Costs & Depreciation", Amount: 1950000 },
        { LineItem: "Profit Before Tax (PBT)", Amount: 18700000 },
        { LineItem: "Current Tax Expense (25%)", Amount: 4675000 },
        { LineItem: "Profit After Tax (PAT)", Amount: 14025000 }
      ];
    }
    exportService.exportCSV(reportData, `${activeTab}_financial_report.csv`);
    setToastMsg("Financial statement exported as CSV.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Statutory Financial Reporting Center</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Schedule III compliant Balance Sheets, Profit & Loss accounts, and multi-tier tax audit workpapers.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handlePrint} className="btn btn-outline btn-sm">
            <Printer size={15} /> Print Report
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary btn-sm">
            <Download size={15} /> Export Excel/CSV
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="glass-panel" style={{ padding: "8px 12px", display: "flex", gap: 8, overflowX: "auto" }}>
        {[
          { id: "balanceSheet", label: "Balance Sheet (Schedule III)", icon: Scale },
          { id: "pnl", label: "Profit & Loss Account", icon: TrendingUp },
          { id: "cashflow", label: "Cash Flow Statement", icon: FileSpreadsheet },
          { id: "taxAudit", label: "Tax Audit (Form 3CD)", icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${activeTab === tab.id ? "btn-primary" : "btn-outline"}`}
              style={{ whiteSpace: "nowrap" }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Balance Sheet View */}
      {activeTab === "balanceSheet" && (
        <div className="glass-panel" style={{ padding: "28px" }}>
          <div style={{ textAlign: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 16, marginBottom: 24 }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>APEX GLOBAL TECHNOLOGIES PRIVATE LIMITED</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              BALANCE SHEET AS AT 31ST MARCH 2026 (In compliance with Schedule III, Companies Act 2013)
            </p>
            <span className="badge badge-purple" style={{ marginTop: 8 }}>Figures in INR (₹)</span>
          </div>

          <table className="data-table" style={{ fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th>Particulars</th>
                <th>Note No.</th>
                <th style={{ textAlign: "right" }}>As at 31-Mar-2026</th>
                <th style={{ textAlign: "right" }}>As at 31-Mar-2025</th>
              </tr>
            </thead>
            <tbody>
              {/* Equity & Liabilities */}
              <tr style={{ background: "rgba(168, 85, 247, 0.08)", fontWeight: 700 }}>
                <td colSpan={4}>I. EQUITY AND LIABILITIES</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 28 }}>(1) Shareholders' Funds</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 44 }}> (a) Share Capital</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>1</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>50,00,000</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>50,00,000</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 44 }}> (b) Reserves and Surplus</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>2</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1,42,00,000</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1,12,50,000</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 28 }}>(2) Non-Current Liabilities (Term Borrowings)</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>3</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>38,00,000</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>45,00,000</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 28 }}>(3) Current Liabilities (Trade Payables)</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>4</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>24,50,000</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>18,20,000</td>
              </tr>
              <tr style={{ fontWeight: 800, color: "var(--accent-secondary)", borderTop: "2px solid var(--border-focus)", borderBottom: "2px solid var(--border-focus)" }}>
                <td>TOTAL EQUITY & LIABILITIES</td>
                <td></td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>₹2,54,50,000</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>₹2,25,70,000</td>
              </tr>

              {/* Assets */}
              <tr style={{ background: "rgba(168, 85, 247, 0.08)", fontWeight: 700 }}>
                <td colSpan={4}>II. ASSETS</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 28 }}>(1) Non-Current Assets (Property, Plant & Equip)</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>5</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1,25,00,000</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1,10,00,000</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: 28 }}>(2) Current Assets (Cash & Receivables)</td>
                <td style={{ fontFamily: "var(--font-mono)" }}>6</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1,29,50,000</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1,15,70,000</td>
              </tr>
              <tr style={{ fontWeight: 800, color: "var(--accent-secondary)", borderTop: "2px solid var(--border-focus)", borderBottom: "2px solid var(--border-focus)" }}>
                <td>TOTAL ASSETS</td>
                <td></td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>₹2,54,50,000</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>₹2,25,70,000</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, color: "var(--success)", fontSize: "0.85rem" }}>
            <CheckCircle2 size={18} />
            <span>Dual-Entry Validation: Assets = Liabilities. Reconciled with Trial Ledger with zero variance.</span>
          </div>
        </div>
      )}

      {/* P&L View */}
      {activeTab === "pnl" && (
        <div className="glass-panel" style={{ padding: "28px" }}>
          <div style={{ textAlign: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 16, marginBottom: 24 }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>STATEMENT OF PROFIT AND LOSS</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              FOR THE YEAR ENDED 31ST MARCH 2026
            </p>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th style={{ textAlign: "right" }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>I. Revenue from Operations</td>
                <td style={{ textAlign: "right", fontWeight: 700, fontFamily: "var(--font-mono)" }}>2,84,00,000</td>
              </tr>
              <tr>
                <td>II. Other Income</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>6,50,000</td>
              </tr>
              <tr style={{ fontWeight: 700, background: "rgba(168, 85, 247, 0.08)" }}>
                <td>III. Total Income (I + II)</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--accent-secondary)" }}>2,90,50,000</td>
              </tr>
              <tr>
                <td>IV. Employee Benefits Expense</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>84,00,000</td>
              </tr>
              <tr>
                <td>V. Finance Costs & Depreciation</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>19,50,000</td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td>VI. Profit Before Tax (PBT)</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>1,87,00,000</td>
              </tr>
              <tr>
                <td>VII. Tax Expense (Corporate Tax 25% + Cess)</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "#f87171" }}>48,62,000</td>
              </tr>
              <tr style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--success)" }}>
                <td>VIII. Profit for the Period (PAT)</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>₹1,38,38,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Cash Flow View */}
      {activeTab === "cashflow" && (
        <div className="glass-panel" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>Statement of Cash Flows (Direct Method)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "rgba(168, 85, 247, 0.05)", borderRadius: "var(--radius-md)" }}>
              <span>Operating Cash Inflow:</span>
              <strong style={{ color: "var(--success)" }}>+₹1,42,80,000</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "rgba(168, 85, 247, 0.05)", borderRadius: "var(--radius-md)" }}>
              <span>Capital Investments (CAPEX):</span>
              <strong style={{ color: "var(--danger)" }}>-₹35,00,000</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "rgba(168, 85, 247, 0.05)", borderRadius: "var(--radius-md)" }}>
              <span>Financing Cash Outflows (Loan Repayment):</span>
              <strong style={{ color: "var(--danger)" }}>-₹18,00,000</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderTop: "2px solid var(--border-focus)", fontWeight: 800, fontSize: "1.1rem" }}>
              <span>Net Increase in Cash & Equivalents:</span>
              <strong style={{ color: "var(--accent-secondary)" }}>+₹89,80,000</strong>
            </div>
          </div>
        </div>
      )}

      {/* Form 3CD View */}
      {activeTab === "taxAudit" && (
        <div className="glass-panel" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>
            Form 3CD Tax Audit Workpaper Clauses
          </h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: "0.875rem" }}>
            <li style={{ padding: "10px", background: "rgba(18, 11, 36, 0.6)", borderRadius: "var(--radius-sm)" }}>
              <strong>Clause 13:</strong> Method of accounting employed — Mercantile System (AS/IndAS compliant).
            </li>
            <li style={{ padding: "10px", background: "rgba(18, 11, 36, 0.6)", borderRadius: "var(--radius-sm)" }}>
              <strong>Clause 21(a):</strong> Amounts debited to P&L being expenditure of capital/personal nature — NIL.
            </li>
            <li style={{ padding: "10px", background: "rgba(18, 11, 36, 0.6)", borderRadius: "var(--radius-sm)" }}>
              <strong>Clause 34(a):</strong> TDS compliance report — All payments under 194C, 194J deducted and deposited on time.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
