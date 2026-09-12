import React, { useState } from "react";
import { TDS_SECTIONS } from "../../utils/mockData";
import { formatINR } from "../../utils/formatters";
import { Receipt, Calculator, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TDS() {
  const [selectedSec, setSelectedSec] = useState("194J");
  const [paymentAmount, setPaymentAmount] = useState(150000);
  const [panAvailable, setPanAvailable] = useState(true);

  // Determine TDS Rate
  let baseRate = 10;
  if (selectedSec === "194C") baseRate = 2;
  else if (selectedSec === "194J") baseRate = 10;
  else if (selectedSec === "194I") baseRate = 10;
  else if (selectedSec === "194Q") baseRate = 0.1;

  // Penalty rate under Sec 206AA if PAN is invalid/unavailable is 20%
  const effectiveRate = !panAvailable ? 20 : baseRate;
  const tdsAmount = Math.round((Number(paymentAmount) * effectiveRate) / 100);
  const netPayable = Math.max(0, Number(paymentAmount) - tdsAmount);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>TDS Calculator & Compliance Manager</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Compute Tax Deducted at Source across Sections 194C, 194J, 194I, and 194Q with Section 206AA penalty logic.
        </p>
      </div>

      {/* TDS Calculator */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
          <Calculator size={18} color="var(--accent-secondary)" />
          <span>Real-time TDS Deduction Simulator</span>
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
          <div>
            <div className="form-group">
              <label className="form-label">TDS Section Code</label>
              <select
                className="form-select"
                value={selectedSec}
                onChange={(e) => setSelectedSec(e.target.value)}
              >
                <option value="194J">Sec 194J — Professional & Technical Services (10%)</option>
                <option value="194C">Sec 194C — Contractor / Sub-Contractor Works (2%)</option>
                <option value="194I">Sec 194I — Rent of Land, Building or Furniture (10%)</option>
                <option value="194Q">Sec 194Q — Purchase of Goods exceeding ₹50L (0.1%)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Gross Payment / Invoice Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min="0"
                step="5000"
              />
            </div>

            <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}>
              <input
                type="checkbox"
                id="panCheck"
                checked={panAvailable}
                onChange={(e) => setPanAvailable(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--accent-primary)", cursor: "pointer" }}
              />
              <label htmlFor="panCheck" className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                Valid Deductee PAN Furnished (Checked = Standard Rate, Unchecked = 20% Section 206AA rate)
              </label>
            </div>
          </div>

          {/* Output Card */}
          <div
            style={{
              background: "rgba(18, 11, 36, 0.7)",
              border: "1px solid var(--border-focus)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="badge badge-purple">Section {selectedSec}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: panAvailable ? "var(--success)" : "var(--danger)" }}>
                  Rate: {effectiveRate}%
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Gross Amount:</span>
                  <span style={{ fontWeight: 600 }}>{formatINR(Number(paymentAmount))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>TDS to be Deducted:</span>
                  <span style={{ fontWeight: 700, color: "#ec4899", fontFamily: "var(--font-mono)" }}>
                    {formatINR(tdsAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 16, marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Net Pay to Deductee:</span>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-secondary)", fontFamily: "var(--font-mono)" }}>
                {formatINR(netPayable)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory TDS Rates Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>
          Statutory TDS Rates Reference Guide (FY 2026-27)
        </h3>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Nature of Payment</th>
                <th>Applicable TDS Rate</th>
                <th>Exemption Threshold</th>
              </tr>
            </thead>
            <tbody>
              {TDS_SECTIONS.map((sec, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: "var(--accent-secondary)", fontFamily: "var(--font-mono)" }}>
                    {sec.section}
                  </td>
                  <td>{sec.name}</td>
                  <td style={{ fontWeight: 600, color: "#fff" }}>{sec.rate}</td>
                  <td style={{ color: "var(--text-muted)" }}>{sec.threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
