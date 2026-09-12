import React, { useState } from "react";
import { computeTaxRegimes, formatINR } from "../../utils/formatters";
import { Calculator, CheckCircle2, TrendingDown, Info, ShieldCheck } from "lucide-react";

export default function IncomeTax() {
  const [grossIncome, setGrossIncome] = useState(1200000);
  const [deductions, setDeductions] = useState({
    sec80C: 150000,
    sec80D: 25000,
    hra: 120000,
    homeLoan: 0
  });

  const res = computeTaxRegimes(Number(grossIncome) || 0, deductions);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Income Tax Advisory & Regime Analyzer</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Comparative simulation between Old vs New Tax Regime under the latest Finance Act with Section 87A rebate calculations.
        </p>
      </div>

      {/* Calculator Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
        {/* Inputs */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 18 }}>Taxpayer Income & Deductions</h3>

          <div className="form-group">
            <label className="form-label">Annual Gross Total Income (₹)</label>
            <input
              type="number"
              className="form-input"
              value={grossIncome}
              onChange={(e) => setGrossIncome(e.target.value)}
              step="50000"
              min="0"
            />
          </div>

          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-secondary)", margin: "16px 0 10px" }}>
            Old Regime Allowable Deductions (Chapter VI-A)
          </div>

          <div className="form-group">
            <label className="form-label">Section 80C (PPF, ELSS, EPF, LIC - Max ₹1.5L)</label>
            <input
              type="number"
              className="form-input"
              value={deductions.sec80C}
              onChange={(e) => setDeductions({ ...deductions, sec80C: e.target.value })}
              max="150000"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Section 80D (Health Insurance Premium - Max ₹75k)</label>
            <input
              type="number"
              className="form-input"
              value={deductions.sec80D}
              onChange={(e) => setDeductions({ ...deductions, sec80D: e.target.value })}
              max="75000"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">HRA Exemption / Rent Paid (Sec 10(13A))</label>
            <input
              type="number"
              className="form-input"
              value={deductions.hra}
              onChange={(e) => setDeductions({ ...deductions, hra: e.target.value })}
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Home Loan Interest (Sec 24(b) - Max ₹2.0L)</label>
            <input
              type="number"
              className="form-input"
              value={deductions.homeLoan}
              onChange={(e) => setDeductions({ ...deductions, homeLoan: e.target.value })}
              max="200000"
              min="0"
            />
          </div>
        </div>

        {/* Comparison Result */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Recommendation Banner */}
          <div
            className="glass-panel"
            style={{
              padding: "20px 24px",
              background: "linear-gradient(135deg, rgba(35, 18, 66, 0.9) 0%, rgba(18, 11, 36, 0.9) 100%)",
              borderColor: "var(--accent-primary)",
              display: "flex",
              alignItems: "center",
              gap: 16
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingDown size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                AI Recommendation Engine
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                Adopt <span className="text-gradient">{res.recommended}</span> — Saves {formatINR(res.savings)}!
              </div>
            </div>
          </div>

          {/* Slabs Breakdown Side by Side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* New Regime Card */}
            <div
              className="glass-panel"
              style={{
                padding: "20px",
                borderColor: res.recommended === "New Regime" ? "var(--accent-primary)" : "var(--border-subtle)",
                background: res.recommended === "New Regime" ? "rgba(32, 19, 58, 0.75)" : "var(--bg-card)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: "1rem" }}>New Tax Regime</span>
                {res.recommended === "New Regime" && <span className="badge badge-success">Recommended</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Std. Deduction:</span>
                  <span>₹75,000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Taxable Income:</span>
                  <span style={{ fontWeight: 600 }}>{formatINR(res.newRegime.taxable)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Basic Income Tax:</span>
                  <span>{formatINR(res.newRegime.tax)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Health & Edu Cess (4%):</span>
                  <span>{formatINR(res.newRegime.cess)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: 10, marginTop: 4, fontWeight: 800, fontSize: "1.05rem", color: "var(--accent-secondary)" }}>
                  <span>Net Payable:</span>
                  <span>{formatINR(res.newRegime.total)}</span>
                </div>
              </div>
            </div>

            {/* Old Regime Card */}
            <div
              className="glass-panel"
              style={{
                padding: "20px",
                borderColor: res.recommended === "Old Regime" ? "var(--accent-primary)" : "var(--border-subtle)",
                background: res.recommended === "Old Regime" ? "rgba(32, 19, 58, 0.75)" : "var(--bg-card)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: "1rem" }}>Old Tax Regime</span>
                {res.recommended === "Old Regime" && <span className="badge badge-success">Recommended</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total Deductions:</span>
                  <span>{formatINR(res.oldRegime.deductions)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Taxable Income:</span>
                  <span style={{ fontWeight: 600 }}>{formatINR(res.oldRegime.taxable)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Basic Income Tax:</span>
                  <span>{formatINR(res.oldRegime.tax)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Health & Edu Cess (4%):</span>
                  <span>{formatINR(res.oldRegime.cess)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: 10, marginTop: 4, fontWeight: 800, fontSize: "1.05rem", color: "var(--accent-secondary)" }}>
                  <span>Net Payable:</span>
                  <span>{formatINR(res.oldRegime.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slabs Reference */}
          <div className="glass-panel" style={{ padding: "18px" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Info size={15} color="var(--info)" />
              <span>Key Statutory Rules (Budget 2025/2026)</span>
            </div>
            <ul style={{ listStyle: "disc", paddingLeft: 20, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <li>New Tax Regime standard deduction enhanced to ₹75,000 for salaried employees and pensioners.</li>
              <li>Rebate under Section 87A ensures ZERO tax liability up to ₹7,00,000 taxable income in New Regime.</li>
              <li>Surcharge rates capped at a maximum of 25% under the default New Regime structure.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
