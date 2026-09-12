import React from "react";
import { useData } from "../../context/DataContext";
import { Calendar, AlertCircle, CheckCircle } from "lucide-react";

export default function ComplianceCalendar() {
  const { complianceList } = useData();

  return (
    <div className="glass-panel" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Calendar size={20} color="var(--accent-secondary)" />
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Statutory Due Dates</h3>
        </div>
        <span className="badge badge-purple">FY 2026-27</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {complianceList.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px 14px",
              background: "rgba(18, 11, 36, 0.6)",
              border: `1px solid ${item.daysLeft <= 5 ? "rgba(239, 68, 68, 0.4)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                {item.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                {item.desc}
              </div>
            </div>

            <div style={{ textAlign: "right", minWidth: 90 }}>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: item.daysLeft <= 5 ? "#f87171" : "var(--accent-secondary)"
                }}
              >
                {item.dueDate}
              </div>
              <div
                style={{
                  fontSize: "0.725rem",
                  color: item.daysLeft <= 5 ? "var(--danger)" : "var(--text-dim)",
                  fontWeight: 600
                }}
              >
                {item.daysLeft} days left
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
