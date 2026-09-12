import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileText, Sparkles, Receipt, Calculator, Upload } from "lucide-react";

export default function QuickActions({ onOpenNewInvoice, onOpenNewClient }) {
  return (
    <div className="glass-panel" style={{ padding: "20px 24px" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-secondary)", letterSpacing: "0.08em", marginBottom: 16 }}>
        Instant Workflow Actions
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <button onClick={onOpenNewInvoice} className="btn btn-secondary btn-sm" style={{ padding: "10px", justifyContent: "center" }}>
          <FileText size={16} />
          <span>New Invoice</span>
        </button>

        <button onClick={onOpenNewClient} className="btn btn-secondary btn-sm" style={{ padding: "10px", justifyContent: "center" }}>
          <PlusCircle size={16} />
          <span>Add Client</span>
        </button>

        <Link to="/dashboard/ai-assistant" className="btn btn-primary btn-sm" style={{ padding: "10px", justifyContent: "center" }}>
          <Sparkles size={16} />
          <span>AI OCR Scan</span>
        </Link>

        <Link to="/dashboard/gst" className="btn btn-secondary btn-sm" style={{ padding: "10px", justifyContent: "center" }}>
          <Receipt size={16} />
          <span>GST 3B Check</span>
        </Link>

        <Link to="/dashboard/income-tax" className="btn btn-secondary btn-sm" style={{ padding: "10px", justifyContent: "center" }}>
          <Calculator size={16} />
          <span>Tax Slabs</span>
        </Link>
      </div>
    </div>
  );
}
