import React from "react";
import { formatINR } from "../../utils/formatters";
import { REVENUE_MONTHLY_CHART } from "../../utils/mockData";
import { RevenueAreaChart, ExpenseDonutChart } from "../../components/charts/Charts";
import { LineChart, TrendingUp, ShieldCheck, Activity, Users, FileCheck } from "lucide-react";

export default function Analytics() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Practice Analytics & Audit Trail</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          In-depth financial health metrics, client compliance distributions, and historical practice margins.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>Multi-Quarter Firm Turnover Trend</h3>
          <RevenueAreaChart data={REVENUE_MONTHLY_CHART} />
        </div>

        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 }}>Disbursement Profile</h3>
          <ExpenseDonutChart />
        </div>
      </div>

      {/* Audit Trail Log */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={18} color="var(--accent-secondary)" />
          <span>Real-time Statutory Activity Log</span>
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.85rem" }}>
          {[
            { action: "GSTR-1 JSON Schema Exported", client: "Apex Global Technologies", time: "10 minutes ago", user: "CA Ashish" },
            { action: "Invoice INV-2026-089 marked Paid", client: "Apex Global Technologies", time: "2 hours ago", user: "Billing Desk" },
            { action: "New Client Onboarded (LLP)", client: "Sharma & Brothers Logistics", time: "5 hours ago", user: "CA Ashish" },
            { action: "Form 3CD Tax Audit Clauses Generated", client: "Zenith Cloud Solutions", time: "1 day ago", user: "AI Assistant" }
          ].map((log, i) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                background: "rgba(18, 11, 36, 0.6)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: "#fff" }}>{log.action}</span>
                <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>• {log.client}</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                {log.time} ({log.user})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
