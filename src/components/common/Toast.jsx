import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export default function Toast({ type = "success", message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} color="var(--success)" />,
    warning: <AlertTriangle size={18} color="var(--warning)" />,
    error: <XCircle size={18} color="var(--danger)" />,
    info: <Info size={18} color="var(--info)" />
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: "rgba(22, 13, 44, 0.95)",
        backdropFilter: "blur(16px)",
        border: "1px solid var(--border-focus)",
        boxShadow: "var(--shadow-lg), var(--shadow-neon)",
        borderRadius: "var(--radius-md)",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        maxWidth: 420,
        animation: "fadeIn 0.25s ease-out"
      }}
    >
      {icons[type] || icons.info}
      <span style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          marginLeft: "auto",
          display: "flex"
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
