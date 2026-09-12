import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ title, value, change, isPositive, icon: Icon, color = "#a855f7" }) {
  return (
    <div className="glass-panel stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{title}</span>
        <div
          className="stat-card-icon"
          style={{
            background: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.15)`,
            color: color
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="stat-card-value">{value}</div>

      {change && (
        <div
          className="stat-card-trend"
          style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}
        >
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{change}</span>
          <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>vs last month</span>
        </div>
      )}
    </div>
  );
}
