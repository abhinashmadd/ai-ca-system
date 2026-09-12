import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { formatINR } from "../../utils/formatters";
import Toast from "../../components/common/Toast";
import confetti from "canvas-confetti";
import {
  Percent,
  Calculator,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  Calendar
} from "lucide-react";

export default function GST() {
  const { gstRecords, markGstFiled } = useData();
  const [toastMsg, setToastMsg] = useState("");

  // GST Calculator State
  const [baseAmount, setBaseAmount] = useState(100000);
  const [selectedRate, setSelectedRate] = useState(18);
  const [supplyType, setSupplyType] = useState("intra"); // intra = CGST+SGST, inter = IGST
  const [taxInclusive, setTaxInclusive] = useState(false);

  // Compute GST
  const amount = Number(baseAmount) || 0;
  const rate = Number(selectedRate) || 0;

  let taxable = 0;
  let tax = 0;
  let total = 0;

  if (taxInclusive) {
    taxable = Math.round((amount * 100) / (100 + rate));
    tax = amount - taxable;
    total = amount;
  } else {
    taxable = amount;
    tax = Math.round((amount * rate) / 100);
    total = amount + tax;
  }

  const cgst = supplyType === "intra" ? Math.round(tax / 2) : 0;
  const sgst = supplyType === "intra" ? Math.round(tax / 2) : 0;
  const igst = supplyType === "inter" ? tax : 0;

  const handleSimulateFiling = (period, form) => {
    markGstFiled(period, form);
    setToastMsg(`${form} for ${period} submitted to GSTN with ARN generation!`);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      {/* Header */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>GST Automation & Compliance Hub</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Interactive GST calculator, return tracking (GSTR-1/3B/9), input tax credit reconciliation, and filing reminders.
        </p>
      </div>

      {/* GST Calculator Section */}
      <div className="glass-panel" style={{ padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Calculator size={22} color="var(--accent-secondary)" />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Interactive GST Tax Computation Engine</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Controls */}
          <div>
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
                min="0"
                step="1000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">GST Tax Slab</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {[0, 5, 12, 18, 28].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRate(r)}
                    className={`btn btn-sm ${selectedRate === r ? "btn-primary" : "btn-outline"}`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Transaction Nature</label>
                <select
                  className="form-select"
                  value={supplyType}
                  onChange={(e) => setSupplyType(e.target.value)}
                >
                  <option value="intra">Intra-State (CGST + SGST)</option>
                  <option value="inter">Inter-State (IGST)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tax Mode</label>
                <select
                  className="form-select"
                  value={taxInclusive ? "inc" : "exc"}
                  onChange={(e) => setTaxInclusive(e.target.value === "inc")}
                >
                  <option value="exc">Exclusive of GST (+ Tax)</option>
                  <option value="inc">Inclusive of GST (- Tax)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div
            style={{
              background: "rgba(18, 11, 36, 0.7)",
              border: "1px solid var(--border-focus)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <span className="badge badge-purple" style={{ marginBottom: 12 }}>
                {supplyType === "intra" ? "Intra-State Supply Breakdown" : "Inter-State (IGST) Supply"}
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Taxable Value:</span>
                  <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{formatINR(taxable)}</span>
                </div>

                {supplyType === "intra" ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>CGST ({rate / 2}%):</span>
                      <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{formatINR(cgst)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>SGST ({rate / 2}%):</span>
                      <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{formatINR(sgst)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Integrated GST (IGST {rate}%):</span>
                    <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{formatINR(igst)}</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total GST Liability:</span>
                  <span style={{ fontWeight: 600, color: "#ec4899", fontFamily: "var(--font-mono)" }}>
                    {formatINR(tax)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 16, marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1rem", fontWeight: 700 }}>Total Final Invoice Value:</span>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-secondary)", fontFamily: "var(--font-mono)" }}>
                {formatINR(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GST Return Status Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>GST Returns Filing Status</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Direct filing status with Acknowledgement Reference Numbers (ARN)
            </p>
          </div>
          <span className="badge badge-success">GSTN Connected</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Return Form</th>
                <th>Tax Period</th>
                <th>Tax Liability</th>
                <th>ITC Claimed</th>
                <th>Net Payable</th>
                <th>Filing ARN</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gstRecords.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: "#fff" }}>{r.form}</td>
                  <td>{r.period}</td>
                  <td>{r.taxLiability}</td>
                  <td>{r.itcClaimed}</td>
                  <td style={{ fontWeight: 600, color: "var(--accent-secondary)" }}>{r.netPayable}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {r.arn}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "Filed"
                          ? "badge-success"
                          : r.status === "Ready to File"
                          ? "badge-warning"
                          : "badge-purple"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status !== "Filed" ? (
                      <button
                        onClick={() => handleSimulateFiling(r.period, r.form)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                      >
                        <Send size={12} /> File Now
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={14} color="var(--success)" /> {r.filedOn}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
