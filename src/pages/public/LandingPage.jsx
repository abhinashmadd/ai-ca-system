import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ScanText,
  Percent,
  Receipt,
  Calculator,
  CreditCard,
  LayoutDashboard,
  FileSpreadsheet,
  UploadCloud,
  BellRing,
  FileSearch,
  Wallet,
  TrendingUp,
  Scale,
  Landmark,
  BrainCircuit,
  HelpCircle,
  Mail,
  Send,
  Check
} from "lucide-react";
import Toast from "../../components/common/Toast";

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });

  const toggleFaq = (idx) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setToastMsg("Please fill in all required fields.");
      return;
    }
    setToastMsg("Thank you! Our Chartered Accountant advisory team will connect shortly.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  // 15 requested features
  const features = [
    {
      icon: ScanText,
      title: "AI Invoice Scanner (OCR)",
      desc: "Instant machine-vision parsing of paper & digital bills with 99.4% confidence and auto GSTR-2B matching."
    },
    {
      icon: Percent,
      title: "GST Automation",
      desc: "Automated calculation and JSON schema generation for GSTR-1, GSTR-3B, and annual GSTR-9 reconciliation."
    },
    {
      icon: Receipt,
      title: "TDS Calculator",
      desc: "Multi-section deduction engine (194C, 194J, 194I, 194Q) with Challan 281 tracking and quarterly 26Q filing."
    },
    {
      icon: Calculator,
      title: "Income Tax Calculator",
      desc: "Real-time comparative computation between Old vs New Tax Regimes under the latest Union Budget slabs."
    },
    {
      icon: CreditCard,
      title: "Payroll Management",
      desc: "Complete employee attendance, HRA, Provident Fund, professional tax, and one-click encrypted PDF payslips."
    },
    {
      icon: LayoutDashboard,
      title: "Financial Dashboard",
      desc: "Unified mission control showing real-time revenue, cash velocity, pending returns, and audit trails."
    },
    {
      icon: FileSpreadsheet,
      title: "AI Report Generator",
      desc: "Generates board-ready audit opinions, notes to accounts, and statutory financial disclosures instantly."
    },
    {
      icon: UploadCloud,
      title: "Document Upload",
      desc: "Secure 256-bit encrypted vault for PAN, GST certificates, challans, board resolutions, and bank statements."
    },
    {
      icon: BellRing,
      title: "Compliance Reminder",
      desc: "Smart proactive statutory alert calendar preventing penal interest and late fees across MCA, CBDT, and CBIC."
    },
    {
      icon: FileSearch,
      title: "Audit Management",
      desc: "Automated sampling, IFC controls evaluation, and Form 3CA/3CB-3CD tax audit workpapers."
    },
    {
      icon: Wallet,
      title: "Expense Tracker",
      desc: "Categorization of operating disbursements, input tax credits, and non-allowable expenses under Section 40(a)."
    },
    {
      icon: TrendingUp,
      title: "Profit & Loss Reports",
      desc: "Dynamic P&L generation adhering strictly to Schedule III of Companies Act 2013."
    },
    {
      icon: Scale,
      title: "Balance Sheet Generator",
      desc: "Automated trial balance consolidation, asset depreciation schedule, and dual-entry ledger validation."
    },
    {
      icon: Landmark,
      title: "Bank Statement Analysis",
      desc: "Scans 1000+ line transaction statements, flags cash deposits >₹50k, and detects unmapped vendor UPI outlays."
    },
    {
      icon: BrainCircuit,
      title: "AI Financial Insights",
      desc: "Predictive cash flow modeling, working capital stress testing, and proactive tax-saving recommendations."
    }
  ];

  const workflowSteps = [
    {
      num: "01",
      title: "Connect or Upload",
      desc: "Ingest invoices, bank statements, or trial balances via our drag-and-drop portal or accounting API."
    },
    {
      num: "02",
      title: "AI OCR & Validation",
      desc: "Our neural engine extracts line items, verifies GSTINs against GSTN, and flags TDS liabilities."
    },
    {
      num: "03",
      title: "Auto-Reconciliation",
      desc: "Cross-checks input tax credit with GSTR-2B, identifies mismatches, and balances ledger entries."
    },
    {
      num: "04",
      title: "Filing & Disclosures",
      desc: "Generate ready-to-upload JSON files, Schedule III balance sheets, and audit-certified reports."
    }
  ];

  const pricingTiers = [
    {
      name: "Starter Practitioner",
      price: "₹2,499",
      period: "/month",
      desc: "Ideal for solo practicing Chartered Accountants and boutique tax consultants.",
      features: [
        "Up to 25 Active Client Profiles",
        "AI Invoice OCR (250 scans/mo)",
        "GSTR-1 & 3B Calculation Engine",
        "Income Tax Old vs New Analyzer",
        "Standard Email Support"
      ],
      cta: "Start Free Trial",
      featured: false
    },
    {
      name: "Featured CA Firm",
      price: "₹6,999",
      period: "/month",
      desc: "Engineered for growing audit firms, multi-partner practices, and corporate tax teams.",
      features: [
        "Unlimited Client Profiles",
        "Unlimited AI Invoice & OCR Scans",
        "Bank Statement Anomaly Detection",
        "Automated Schedule III Balance Sheets",
        "Payroll, TDS & Form 26Q Generator",
        "Priority 24/7 Statutory Support"
      ],
      cta: "Upgrade to Firm Pro",
      featured: true
    },
    {
      name: "Enterprise & CFO",
      price: "₹18,500",
      period: "/month",
      desc: "For large audit corporations, multinational subsidiaries, and venture CFO offices.",
      features: [
        "Everything in Firm Pro",
        "Custom ERP (SAP/Tally/Zoho) API Sync",
        "Dedicated Chartered Accountant Liaison",
        "On-premise / Private Cloud Deployment",
        "Multi-branch GSTN Consolidation"
      ],
      cta: "Schedule Consultation",
      featured: false
    }
  ];

  const faqs = [
    {
      q: "Does this platform replace a practicing Chartered Accountant?",
      a: "No. It is an intelligent co-pilot built specifically to eliminate repetitive manual computation, invoice data entry, and reconciliation—allowing CAs to focus on strategic advisory, forensic audit, and client consultation."
    },
    {
      q: "How accurate is the AI Invoice OCR Scanner?",
      a: "Our specialized model achieves over 99.4% field-level accuracy on standard Indian GST tax invoices, identifying GSTIN, HSN codes, taxable values, CGST, SGST, and IGST breakdowns."
    },
    {
      q: "Is client financial data encrypted and secure?",
      a: "Yes. All stored records utilize bank-grade AES-256 bit encryption at rest and TLS 1.3 in transit. We maintain strict compliance with Indian data sovereignty principles and ICAI confidentiality ethics."
    },
    {
      q: "Does the platform support both Old and New Income Tax Regimes?",
      a: "Yes, our engine automatically computes comparative liabilities under both regimes taking into account updated standard deductions (₹75,000 for salaried individuals) and Section 87A rebate limits."
    }
  ];

  return (
    <div>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge pulse-glow">
          <Sparkles size={14} />
          <span>AUTONOMOUS FINANCIAL INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="hero-title">
          AI Powered <span className="text-gradient">Chartered Accountant</span> Automation Platform
        </h1>

        <p className="hero-desc">
          Automate accounting, taxation, GST, TDS, payroll, auditing, invoice management, financial reporting, compliance tracking, and document analysis using state-of-the-art Artificial Intelligence.
        </p>

        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Access Portal
          </Link>
        </div>

        {/* Live Counters */}
        <div className="hero-stats-row">
          <div className="glass-panel hero-stat-card">
            <div className="hero-stat-num text-gradient">99.4%</div>
            <div className="hero-stat-label">AI OCR Extraction Accuracy</div>
          </div>
          <div className="glass-panel hero-stat-card">
            <div className="hero-stat-num text-gradient">10x Faster</div>
            <div className="hero-stat-label">GST & TDS Reconciliation</div>
          </div>
          <div className="glass-panel hero-stat-card">
            <div className="hero-stat-num text-gradient">₹140+ Cr</div>
            <div className="hero-stat-label">Statutory Filings Processed</div>
          </div>
          <div className="glass-panel hero-stat-card">
            <div className="hero-stat-num text-gradient">100%</div>
            <div className="hero-stat-label">ICAI Standards Aligned</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Why Leading CAs Trust Us</div>
          <h2 className="section-title">Re-architecting Financial Compliance with Precision AI</h2>
          <p className="section-desc">
            Traditional accounting workflows are plagued by manual bill punching, error-prone spreadsheets, and eleventh-hour filing stress. Our platform synthesizes automated document intelligence with deep Indian taxation laws to deliver audit-ready financial statements in minutes.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <div className="glass-panel" style={{ padding: "32px" }}>
            <ShieldCheck size={32} color="var(--accent-secondary)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>Zero-Error GST & TDS</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", lineHeight: 1.6 }}>
              Direct cross-verification of vendor GSTINs, automatic HSN code categorization, and 2B reconciliation to guarantee you never forfeit legitimate Input Tax Credits.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: "32px" }}>
            <BrainCircuit size={32} color="var(--accent-secondary)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>Autonomous Audit Assistant</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", lineHeight: 1.6 }}>
              Instant anomaly detection on high-value cash transactions, related party dealings under Section 188, and automatic Schedule III Balance Sheet balance verification.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: "32px" }}>
            <BellRing size={32} color="var(--accent-secondary)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>Proactive Statutory Radar</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", lineHeight: 1.6 }}>
              Never miss GSTR-3B, Advance Tax, or Form 3CD deadlines. Automated reminders keep your clients and firm compliant well before penal windows trigger.
            </p>
          </div>
        </div>
      </section>

      {/* 15 Features Grid */}
      <section id="features" className="section-wrapper" style={{ background: "rgba(18, 11, 36, 0.4)", borderRadius: "var(--radius-xl)" }}>
        <div className="section-header">
          <div className="section-subtitle">Complete CA Automation Suite</div>
          <h2 className="section-title">15 Enterprise-Grade Financial Modules</h2>
          <p className="section-desc">
            Everything a Chartered Accountant, tax professional, or CFO needs in one integrated, responsive workspace.
          </p>
        </div>

        <div className="features-grid">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel feature-card">
                <div className="feature-icon-wrapper">
                  <Icon size={24} />
                </div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="feature-card-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Streamlined Execution</div>
          <h2 className="section-title">How The AI Automation Engine Works</h2>
          <p className="section-desc">
            From raw paper receipts to final certified tax filings in four simple, automated steps.
          </p>
        </div>

        <div className="workflow-grid">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="glass-panel step-card">
              <div className="step-number">{step.num}</div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: 10 }}>{step.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Verified Feedback</div>
          <h2 className="section-title">Endorsed by Leading Tax Practitioners</h2>
        </div>

        <div className="testimonials-grid">
          <div className="glass-panel testimonial-card">
            <p style={{ fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              "The AI Invoice OCR and GSTR-2B matching cut our firm's monthly filing preparation time from 6 days down to barely 3 hours. It's an indispensable co-pilot for any serious CA firm."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SM</div>
              <div>
                <div style={{ fontWeight: 700 }}>CA Sanjay Malhotra</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Senior Partner, Malhotra & Co. CA</div>
              </div>
            </div>
          </div>

          <div className="glass-panel testimonial-card">
            <p style={{ fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              "The Old vs New Tax Regime comparative analyzer and Bank Statement anomaly engine gave our corporate clients tremendous confidence during the statutory audit review."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">AK</div>
              <div>
                <div style={{ fontWeight: 700 }}>CA Ananya Kulkarni</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Head of Corporate Tax, Kulkarni Advisory</div>
              </div>
            </div>
          </div>

          <div className="glass-panel testimonial-card">
            <p style={{ fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              "Schedule III Balance Sheet generation that automatically balances trial ledgers has completely eradicated human ledger rounding errors in our practice."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">RG</div>
              <div>
                <div style={{ fontWeight: 700 }}>CA Rajesh Goyal</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Founder, Goyal & Associates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Transparent Investment</div>
          <h2 className="section-title">Plans Scaled for Every Practice</h2>
          <p className="section-desc">
            No hidden fees. Every plan includes full statutory updates as per latest CBDT and GST council circulars.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingTiers.map((tier, idx) => (
            <div key={idx} className={`glass-panel pricing-card ${tier.featured ? "featured" : ""}`}>
              {tier.featured && <span className="featured-badge">MOST POPULAR CA TIER</span>}
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>{tier.name}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>{tier.desc}</p>
              
              <div className="pricing-price">
                {tier.price}<span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500 }}>{tier.period}</span>
              </div>

              <ul className="pricing-features-list">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="pricing-feature-item">
                    <CheckCircle2 size={16} color="var(--accent-secondary)" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className={`btn ${tier.featured ? "btn-primary" : "btn-secondary"}`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Common Inquiries</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div className="faq-list">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className="glass-panel faq-item"
              onClick={() => toggleFaq(idx)}
            >
              <div className="faq-question">
                <span>{f.q}</span>
                <HelpCircle size={18} color="var(--accent-secondary)" />
              </div>
              {faqOpen === idx && (
                <div className="faq-answer animate-fade-in">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-wrapper">
        <div className="glass-panel" style={{ padding: "48px 36px" }}>
          <div className="contact-container">
            <div>
              <div className="section-subtitle">Reach Out To Us</div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>
                Connect with our CA Solutions Architecture Desk
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
                Have questions about custom Tally/SAP integrations, multi-branch GSTN compliance, or firm onboarding? Submit your query and an ICAI-certified technical lead will respond.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, color: "var(--text-secondary)", fontSize: "0.925rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Mail size={18} color="var(--accent-secondary)" />
                  <span>support@aica-automation.in</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ShieldCheck size={18} color="var(--success)" />
                  <span>Strict NDA & Client Confidentiality Protocol Guaranteed</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name / CA Firm Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Abhinash Maddheshiya & Associates"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="ca.partner@firm.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. AI Invoice OCR API or Firm Trial Setup"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specific Requirements</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Tell us about your client volume and current compliance bottlenecks..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
                <Send size={16} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
