import React, { useState } from "react";
import { aiService } from "../../services/aiService";
import { formatINR } from "../../utils/formatters";
import Toast from "../../components/common/Toast";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ScanText,
  Bot,
  Landmark,
  ShieldAlert,
  Send,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  AlertCircle
} from "lucide-react";

export default function AIAssistant() {
  const [activeTool, setActiveTool] = useState("ocr"); // ocr, chat, bank
  const [toastMsg, setToastMsg] = useState("");

  // OCR state
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Namaste! I am your AI Chartered Accountant Assistant. Ask me anything regarding GST rules, Section 194 TDS rates, Old vs New Tax regimes, or Section 44AB tax audit thresholds.",
      time: "Just now"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Bank Statement state
  const [isBankLoading, setIsBankLoading] = useState(false);
  const [bankAnalysis, setBankAnalysis] = useState(null);

  // Handle OCR
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setOcrResult(null);

    try {
      const result = await aiService.scanInvoice(file);
      setOcrResult(result);
      setToastMsg("Invoice successfully parsed by AI Vision OCR!");
      confetti({ particleCount: 60, spread: 60 });
    } catch {
      setToastMsg("Failed to scan invoice.");
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Chatbot
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput;
    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [...prev, { sender: "user", text: userText, time: userTime }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await aiService.askAIAssistant(userText);
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.reply, time: response.timestamp, sources: response.sources }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error processing query. Please check your statutory parameters.", time: "Now" }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Bank Statement Analysis
  const handleRunBankAnalysis = async () => {
    setIsBankLoading(true);
    try {
      const data = await aiService.analyzeBankStatement("HDFC_Current_Account_Aug2026.pdf");
      setBankAnalysis(data);
      setToastMsg("Bank Statement audited with 2 anomaly flags identified!");
    } finally {
      setIsBankLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={24} color="var(--accent-secondary)" />
          <span>Autonomous AI Financial Intelligence Modules</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Machine vision invoice OCR scanner, interactive ICAI regulatory chatbot, and forensic bank statement analyzer.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="glass-panel" style={{ padding: "8px 12px", display: "flex", gap: 10 }}>
        <button
          onClick={() => setActiveTool("ocr")}
          className={`btn btn-sm ${activeTool === "ocr" ? "btn-primary" : "btn-outline"}`}
        >
          <ScanText size={16} /> AI Invoice OCR Scanner
        </button>
        <button
          onClick={() => setActiveTool("chat")}
          className={`btn btn-sm ${activeTool === "chat" ? "btn-primary" : "btn-outline"}`}
        >
          <Bot size={16} /> AI CA Legal Chatbot
        </button>
        <button
          onClick={() => setActiveTool("bank")}
          className={`btn btn-sm ${activeTool === "bank" ? "btn-primary" : "btn-outline"}`}
        >
          <Landmark size={16} /> Bank Statement Analyzer
        </button>
      </div>

      {/* 1. OCR Tool View */}
      {activeTool === "ocr" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
          {/* Upload Area */}
          <div className="glass-panel" style={{ padding: "28px", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}>Upload Invoice / Receipt</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 24 }}>
              Supports PDF, PNG, JPG scans of supplier bills and tax invoices.
            </p>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                border: "2px dashed var(--border-focus)",
                borderRadius: "var(--radius-lg)",
                cursor: "pointer",
                background: "rgba(168, 85, 247, 0.04)",
                transition: "all 0.2s"
              }}
            >
              <UploadCloud size={44} color="var(--accent-secondary)" style={{ marginBottom: 12 }} />
              <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                {isScanning ? "AI Neural Vision Processing..." : "Click to select or drop invoice"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: 6 }}>
                Max file size: 25MB • Auto GSTR-2B validation
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                disabled={isScanning}
                style={{ display: "none" }}
              />
            </label>

            {isScanning && (
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ width: "100%", height: 6, background: "rgba(168, 85, 247, 0.15)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                  <div style={{ width: "60%", height: "100%", background: "var(--accent-gradient)", animation: "scanLine 2s infinite" }} />
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--accent-secondary)", marginTop: 8 }}>
                  Extracting line items, HSN codes, and verifying GSTIN checksum...
                </div>
              </div>
            )}
          </div>

          {/* OCR Extracted Results */}
          <div className="glass-panel" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>AI Extracted Structured Data</h3>
              {ocrResult && <span className="badge badge-success">{ocrResult.confidence}% Accuracy</span>}
            </div>

            {ocrResult ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(18, 11, 36, 0.6)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Vendor:</span>
                  <strong>{ocrResult.vendor}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(18, 11, 36, 0.6)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Vendor GSTIN:</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent-secondary)" }}>
                    {ocrResult.gstin}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(18, 11, 36, 0.6)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Invoice Ref & Date:</span>
                  <span>{ocrResult.invoiceNumber} • {ocrResult.invoiceDate}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(18, 11, 36, 0.6)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Subtotal & GST:</span>
                  <span>{formatINR(ocrResult.subtotal)} + {formatINR(ocrResult.cgst + ocrResult.sgst)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "14px", borderTop: "2px solid var(--border-focus)", fontSize: "1.1rem", fontWeight: 800 }}>
                  <span>Total Payable:</span>
                  <span style={{ color: "var(--accent-secondary)" }}>{formatINR(ocrResult.totalAmount)}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--success)", fontSize: "0.8rem", marginTop: 4 }}>
                  <CheckCircle2 size={16} />
                  <span>{ocrResult.taxComplianceCheck}</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-dim)" }}>
                <ScanText size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
                <p>Upload an invoice on the left to see live AI field extraction.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Chatbot Tool View */}
      {activeTool === "chat" && (
        <div className="glass-panel" style={{ height: "620px", display: "flex", flexDirection: "column" }}>
          {/* Chat Header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 12 }}>
            <Bot size={24} color="var(--accent-secondary)" />
            <div>
              <div style={{ fontWeight: 700 }}>AI Chartered Accountant Advisory Copilot</div>
              <div style={{ fontSize: "0.75rem", color: "var(--success)" }}>Online • Direct Indian Tax Law Knowledge Base</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flexGrow: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: "var(--radius-lg)",
                    background: msg.sender === "user" ? "var(--accent-gradient)" : "rgba(26, 17, 48, 0.9)",
                    border: msg.sender === "user" ? "none" : "1px solid var(--border-subtle)",
                    color: "#fff",
                    fontSize: "0.9rem",
                    lineHeight: 1.6
                  }}
                >
                  {msg.text}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", alignSelf: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                  {msg.time}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div style={{ alignSelf: "flex-start", color: "var(--accent-secondary)", fontSize: "0.85rem", fontStyle: "italic" }}>
                AI Assistant is analyzing statutory sections...
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} style={{ padding: "16px 20px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 12 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Ask a question (e.g. 'What is the TDS rate under 194J for technical services?')"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={isChatLoading || !chatInput.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* 3. Bank Statement Analyzer */}
      {activeTool === "bank" && (
        <div className="glass-panel" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Forensic Bank Statement & UPI Audit</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Scans bulk bank statement transactions and highlights audit risks and non-compliances.
              </p>
            </div>
            <button onClick={handleRunBankAnalysis} className="btn btn-primary btn-sm" disabled={isBankLoading}>
              {isBankLoading ? "Auditing Statement..." : "Scan Sample August Statement"}
            </button>
          </div>

          {bankAnalysis ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <div className="glass-panel" style={{ padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Credits</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--success)" }}>
                    {formatINR(bankAnalysis.totalCredits)}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Debits</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f87171" }}>
                    {formatINR(bankAnalysis.totalDebits)}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Net Inflow</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-secondary)" }}>
                    {formatINR(bankAnalysis.netCashFlow)}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Audit Flags</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f59e0b" }}>
                    {bankAnalysis.suspiciousFlags.length} Warnings
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12, color: "#f59e0b", display: "flex", alignItems: "center", gap: 8 }}>
                  <ShieldAlert size={18} /> Statutory Anomaly Alerts
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {bankAnalysis.suspiciousFlags.map((flag) => (
                    <div
                      key={flag.id}
                      style={{
                        padding: "14px 18px",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#fff" }}>
                          {flag.type} — {formatINR(flag.amount)} on {flag.date}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 2 }}>
                          {flag.note}
                        </div>
                      </div>
                      <span className="badge badge-warning">{flag.risk} Risk</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-dim)" }}>
              <Landmark size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p>Click "Scan Sample August Statement" above to run forensic financial analysis.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
