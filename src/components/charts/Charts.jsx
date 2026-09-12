import React from "react";
import { formatINR } from "../../utils/formatters";

// Interactive Responsive SVG Revenue & Expense Area Chart
export function RevenueAreaChart({ data = [] }) {
  if (!data || !data.length) return null;

  const width = 600;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };

  const maxVal = Math.max(...data.map((d) => d.revenue)) * 1.15;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const getX = (idx) => padding.left + (idx / (data.length - 1)) * chartW;
  const getY = (val) => padding.top + chartH - (val / maxVal) * chartH;

  // Build SVG Path for Revenue
  const revPoints = data.map((d, i) => `${getX(i)},${getY(d.revenue)}`).join(" ");
  const revArea = `${getX(0)},${getY(0)} ${revPoints} ${getX(data.length - 1)},${getY(0)}`;

  // Build SVG Path for Expense
  const expPoints = data.map((d, i) => `${getX(i)},${getY(d.expense)}`).join(" ");
  const expArea = `${getX(0)},${getY(0)} ${expPoints} ${getX(data.length - 1)},${getY(0)}`;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", minWidth: 420 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = padding.top + chartH * (1 - pct);
          const val = maxVal * pct;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(168, 85, 247, 0.12)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                fill="var(--text-dim)"
                fontSize="11"
                textAnchor="end"
              >
                ₹{(val / 100000).toFixed(1)}L
              </text>
            </g>
          );
        })}

        {/* Areas */}
        <polygon points={revArea} fill="url(#revGrad)" />
        <polygon points={expArea} fill="url(#expGrad)" />

        {/* Lines */}
        <polyline
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={revPoints}
        />
        <polyline
          fill="none"
          stroke="#ec4899"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={expPoints}
        />

        {/* Points & X-Labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const yRev = getY(d.revenue);
          const yExp = getY(d.expense);
          return (
            <g key={i}>
              <circle cx={x} cy={yRev} r="4.5" fill="#c084fc" stroke="#0a0614" strokeWidth="2" />
              <circle cx={x} cy={yExp} r="3.5" fill="#f472b6" stroke="#0a0614" strokeWidth="2" />
              <text
                x={x}
                y={height - 12}
                fill="var(--text-muted)"
                fontSize="12"
                fontWeight="500"
                textAnchor="middle"
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8, fontSize: "0.825rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: "#a855f7" }}></span>
          <span style={{ color: "var(--text-secondary)" }}>Client Revenue</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: "#ec4899" }}></span>
          <span style={{ color: "var(--text-secondary)" }}>Audit & Operating Expenses</span>
        </div>
      </div>
    </div>
  );
}

// Expense Category Donut / Progress Distribution
export function ExpenseDonutChart({ items = [] }) {
  const defaultItems = [
    { label: "Payroll & Salaries", amount: 650000, color: "#a855f7" },
    { label: "Cloud & Tax Software", amount: 180000, color: "#ec4899" },
    { label: "Office Infrastructure", amount: 120000, color: "#3b82f6" },
    { label: "Compliance Penalties/Cess", amount: 45000, color: "#10b981" }
  ];

  const categories = items.length ? items : defaultItems;
  const total = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {categories.map((cat, idx) => {
        const pct = Math.round((cat.amount / total) * 100);
        return (
          <div key={idx}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 6 }}>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{cat.label}</span>
              <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {formatINR(cat.amount)} ({pct}%)
              </span>
            </div>
            <div style={{ width: "100%", height: 8, background: "rgba(168, 85, 247, 0.12)", borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: cat.color,
                  borderRadius: 999,
                  transition: "width 0.8s ease-in-out"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
