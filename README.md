# AI Chartered Accountant Platform — Complete Project Documentation

> **Blueprint & Architecture Specification V2.4**  
> Comprehensive System Design, Functional Modules, Tech Stack, Data Models, and Frontend Engineering Guide.

---

## 🌐 Live Production Deployment

- 🚀 **Live Web Application:** [https://ai-ca-system.onrender.com](https://ai-ca-system.onrender.com)
- 📑 **Interactive API Docs (Swagger / OpenAPI):** [https://ai-ca-system.onrender.com/api/docs](https://ai-ca-system.onrender.com/api/docs)
- 📖 **ReDoc API Documentation:** [https://ai-ca-system.onrender.com/api/redoc](https://ai-ca-system.onrender.com/api/redoc)
- 💓 **Backend Health Check:** [https://ai-ca-system.onrender.com/api/health](https://ai-ca-system.onrender.com/api/health)

---

## 1. Executive Summary & Problem-Solution Fit

Traditional accounting is hindered by high costs, manual data-entry bottlenecks, and human errors. The **AI Chartered Accountant Automation System** transforms this into a **24/7 fast, accurate, and cost-effective financial ecosystem** by automating bookkeeping, tax estimation, live analytics, and bank reconciliation under human Chartered Accountant supervision.

### Core Value Propositions:
- **Instant Financial Visibility:** Real-time visibility into cash flow, revenue realization, and balance sheet health.
- **Zero Manual Data Entry:** Automated Optical Character Recognition (OCR) directly ingests invoices, receipts, and bank statements.
- **Complete Auditability:** Every transaction is tagged with an LLM rule, confidence score, and immutable audit metadata.
- **Error-Free Tax Compliance:** Automated calculation of GST slabs (CGST, SGST, IGST) with Input Tax Credit (ITC) reconciliation.
- **Seamless Stakeholder Sharing:** One-click generation of audit-ready PDFs, Excel workbooks, and custom financial reports.

---

## 2. Project File Structure & Inventory

All files for this project are located in:  
`C:\Users\absma\OneDrive\Desktop\project1\`

| File Name | File Size | Description |
| :--- | :--- | :--- |
| **`index.html`** | ~52 KB | Main financial cockpit Single Page Application (SPA) containing all 7 core modules, executive profile logo, modals, and charts. |
| **`login.html`** | ~8.4 KB | Standalone authentication portal featuring dual-role login (CA Practitioner vs. Enterprise Client) and 1-click demo login. |
| **`styles.css`** | ~45 KB | Minimalist luxury dark fintech design system, ambient blueprint grid background, glowing radial orbs, and glassmorphism. |
| **`app.js`** | ~38 KB | Core business logic, Chart.js visualizations, OCR scanning simulation, ledger search/filters, CSV export, GST sign-off, and AI assistant NLP. |
| **`PROJECT_DOCUMENTATION.md`** | — | This master documentation file extracting all specifications and code structures. |

---

## 3. Detailed Functional Modules Specification

### 📊 Module 1: Live Analytics Dashboard
- **Tag:** `MODULE 1 • INSTANT FINANCIAL VISIBILITY`
- **Purpose:** Centralized hub displaying real-time cash flow, Profit & Loss summaries, and Balance Sheet charts to provide high-level financial health oversight.
- **Key Metrics (KPIs):**
  - **Total Realized Revenue:** `$842,950` (`+18.4%` YoY) — Automated reconciled across 3 business accounts.
  - **Operating Expenses:** `$318,420` (`-4.2%` optimization) — LLM categorized into 14 distinct ledger heads.
  - **Net Operating Cash Flow:** `$524,530` (`+26.8%`) — Real-time liquidity ratio of `3.42` (Optimal).
  - **Accrued GST Liability:** `$68,340` (Eligible ITC Deductions: `$24,190`).
- **Interactive Timeframe Selector:**
  - **MTD (Month-to-Date):** Revenue `$284,150` \| Expenses `$104,200` \| Cash Flow `$179,950`
  - **Q3 FY26 (Quarter-to-Date):** Revenue `$842,950` \| Expenses `$318,420` \| Cash Flow `$524,530`
  - **YTD (Year-to-Date):** Revenue `$2,480,000` \| Expenses `$960,400` \| Cash Flow `$1,519,600`
- **Charts:**
  - *Real-Time Cash Flow & Forecast:* Spline curve showing historical vs. projected liquidity alongside a baseline reserve target (`$250,000`).
  - *Profit & Loss Breakdown:* Bar chart comparing SaaS Recurring (`+$580K`), Advisory Services (`+$263K`), Operating COGS (`-$145K`), Hosting (`-$98K`), and Tax/Facilities (`-$75K`).
- **Automated Balance Sheet Snapshot:**
  - *Total Current Assets:* `$1,240,800` (Cash: `$682.4K`, Accounts Receivable: `$398.4K`, ITC Balance: `$160K`).
  - *Current Liabilities:* `$385,200` (Accounts Payable: `$214.3K`, Net GST: `$68.3K`, Short-term Accruals: `$102.5K`).
  - *Shareholders' Equity & Net Worth:* `$855,600` (Retained Earnings: `$524.5K`, Capital Reserves: `$331K`, Confidence: `99.8%`).

---

### 📥 Module 2: Document Portal & OCR Parsing
- **Tag:** `MODULE 2 • ZERO MANUAL DATA ENTRY`
- **Purpose:** Drag-and-drop / Snap-upload interface for raw invoices, receipts, and bank statements with automated optical character recognition (OCR) parsing.
- **Ingestion Pipeline:**
  1. *Optical Scanning & Coordinate Mapping* (25%)
  2. *Isolating Tabular Items & GSTIN Extraction* (55%)
  3. *LLM Accounting Rule Verification & Categorization* (85%)
  4. *Complete — High-Confidence Validation* (100% • 99.6% Confidence)
- **Extracted Form Fields:**
  - Vendor / Counterparty Name
  - Tax ID / GSTIN / VAT
  - Document Type (Tax Invoice, Expense Receipt, Bank Statement, Credit Note)
  - Invoice / Reference Number
  - Invoice Date
  - Subtotal (Excl. Tax), GST / Tax Amount, and Total Invoiced Value
  - AI Suggested Ledger Head (e.g., Cloud Infrastructure 5210, Equipment 1520, Rent 5100)
  - Input Tax Credit (ITC) Status (Eligible - 100% ITC, Ineligible Section 17(5), Partial)
- **Interactive Action:** "⚡ Post to General Ledger" automatically appends verified records into the General Ledger and recalculates operating metrics.

---

### 📑 Module 3: General Ledger Hub
- **Tag:** `MODULE 3 • COMPLETE AUDITABILITY`
- **Purpose:** Master transaction directory powered by LLM rules featuring automated transaction categorization, search filtering, and permanent ledger record storage.
- **Table Schema:**
  - `Tx ID & Date`: Unique transaction identifier and date.
  - `Description / Counterparty`: Vendor or client identity.
  - `Ledger Head & Code`: Specific chart of accounts classification.
  - `Classification`: Color-coded badges (`REVENUE`, `EXPENSE`, `ASSET`, `LIABILITY`).
  - `Debit ($)` / `Credit ($)`: Double-entry monetary amounts.
  - `AI Rule & Confidence`: The exact prompt/rule applied with confidence score.
  - `Reconciliation Status`: Bank API matching indicator.
- **Interactive Features:**
  - Instant text search across counterparty, ledger head, reference, or GL code.
  - Classification filter chips (`All Entries`, `Revenue`, `Expense`, `Asset`, `Liability`).
  - **Auto Bank Reconciliation:** Simulates live verification with banking endpoints, reporting 0 discrepancies.
  - **Export Ledger (.CSV):** Generates and downloads a formatted CSV workbook directly to the client machine.

---

### ⚖️ Module 4: Compliance & GST Panel
- **Tag:** `MODULE 4 • ERROR-FREE TAX COMPLIANCE`
- **Purpose:** Automated tax breakdown engine, GST calculation modules, and readiness checks prepared specifically for human professional review and sign-off.
- **Tax Liabilities:**
  - Gross Output Tax Liability: `$92,530.00`
  - Eligible Input Tax Credit (ITC): `-$24,190.00`
  - **Net Payable to Tax Authority:** `$68,340.00`
- **GST Rate Breakdown:**
  - `CGST (Central Tax 9%)`: `$34,170.00` (Intra-State)
  - `SGST (State Tax 9%)`: `$34,170.00` (Intra-State)
  - `IGST (Integrated Tax 18%)`: `$24,190.00` (Inter-State & Cross-Border)
  - `Total Output Liability`: `$92,530.00`
- **Professional Review Checklist:**
  - [x] Cross-Verification with Live Bank API
  - [x] Vendor Tax ID & GSTIN Active Verification
  - [x] Section 17(5) Ineligible Credit Isolation
  - [x] General Ledger Trial Balance Balancing ($1,161,370 matching debits and credits)
- **Chartered Accountant Sign-off Modal:**
  - Prompts for official CA Certificate ID (e.g. `CA-IN-9812-FELLOW`).
  - Digitally stamps the audit statement and updates the readiness badge to `✓ Certified by CA`.

---

### 📤 Module 5: Report Export Center
- **Tag:** `MODULE 5 • SEAMLESS STAKEHOLDER SHARING`
- **Purpose:** One-click generation and exporting of audit-ready PDFs, Excel workbooks, and custom financial statements ready for immediate distribution.
- **Available Reports:**
  1. *Comprehensive P&L Statement:* Details gross revenue, COGS, operating overheads, and EBITDA ($524,530 net profit).
  2. *Certified Balance Sheet:* Certified statement of assets ($1.32M) and liabilities/equity ($1.32M).
  3. *GST & Tax Audit Workbook:* Full reconciliation between GSTR-1, GSTR-3B, and GSTR-2B.
  4. *Automated Bank Reconciliation Ledger:* Line-by-line verification log between ledger items and bank webhook feeds.
- **In-App Document Previewer:**
  - Displays formatted audited plaintext/statement views.
  - Native print trigger (`window.print()`).
  - Direct download buttons producing `.txt` and `.csv` files.

---

### 🏗️ Module 6: System Architecture Specs & Blueprint
- **Tag:** `BLUEPRINT SPECIFICATION • PAGES 1, 2 & 3`
- **Underlying Architecture & Tech Stack:**
  - **Frontend Framework:** `React.js` — Powers an interactive, highly responsive user interface designed for real-time analytics dashboards, live data updates, and smooth user interaction.
  - **Backend Architecture:** `Python / FastAPI` — Provides ultra-fast backend processing, asynchronous endpoint management, and seamless integration between AI models and database engines.
  - **Database Storage:** `PostgreSQL` — Offers robust, reliable, and secure relational data storage for ledger balances, user accounts, and historical financial records.
  - **AI & Third-Party APIs:** `LLMs / OCR / Banking APIs` — Integrates LLMs for accounting rules, OCR for document extraction, GST verification modules, and automated banking reconciliation APIs.
- **5-Step Core Workflow Engine:**
  1. *Data Extraction & Ingestion:* Ingests raw files/receipts via OCR.
  2. *Intelligent AI Bookkeeping:* LLM parses accounting rules and auto-categorizes into General Ledger.
  3. *Automated Bank Reconciliation:* Banking APIs cross-verify internal ledger against bank statements.
  4. *Tax Calculation & Compliance:* Real-time GST obligations and tax calculations for CA sign-off.
  5. *Financial Report Generation:* Real-time generation of audit-ready P&L, Balance Sheets, and Cash Flow.
- **Domain Terminology Glossary:**
  - **OCR:** Optical Character Recognition system for converting scanned invoices into machine-readable data.
  - **LLM:** Advanced intelligence layer handling accounting logic, context comprehension, and categorization.
  - **General Ledger:** The centralized master database storing all verified financial transactions permanently.
  - **Reconciliation:** Process of automated cross-verification between internal ledger data and financial institution statements.
- **Future Ecosystem Roadmap:**
  - *Phase 2:* Mobile Application Integration (Full feature parity on iOS and Android).
  - *Phase 2:* AI Voice Assistant (Natural language voice queries regarding company financial state).
  - *Phase 3:* Predictive Analytics & Fraud Detection (Automated cash flow forecasting & anomaly models).

---

### 👤 Module 7: CA Profile & Settings
- **Practitioner Identity:**
  - Senior Managing Partner: `CA. Aryan Sharma, FCA`
  - Firm Name: `Sharma & Associates Chartered Accountants`
  - ICAI Membership: `CA-502918`
  - Firm Registration Number (FRN): `FRN-012938N`
  - Certificate of Practice (COP): `COP-88192`
  - Address: `Suite 902, Nariman Financial Towers, Marine Drive, Mumbai 400021`
  - Institutional GSTIN: `27AAACS8892P1ZF`
- **Statutory Tokens:**
  - Class 3 USB Cryptographic e-Token (`ePass2003-88219`, valid through Nov 2027).
  - ICAI Peer Review Certification (`PRB-2024-998`, Tier-1).
- **System Endpoints:**
  - FastAPI Backend: `http://api.ca-platform.internal/v2` (Online 8ms)
  - PostgreSQL Database: `postgres://ca_prod_user@db.finance-core:5432/ca_ledger_master` (Pooled 16/20)
  - Active LLM Engine: `Gemini 1.5 Pro (Financial Rules Tuned)`
  - Banking Gateway: `https://sync.ca-platform.internal/webhooks/banking/iso20022`
- **Security & Session Controls:**
  - Two-Factor Hardware Authentication (FIDO2 Enabled).
  - SHA-256 Ledger Immutability Enforced.
  - Log Out action clearing active session storage and returning to `login.html`.

---

## 4. Authentication Portal (`login.html`)

- **Design:** Centered minimalist glassmorphism card on top of an ambient glowing blueprint background.
- **Role Toggle:**
  - **Chartered Accountant (Practitioner):** Uses CA Membership ID (`CA-502918`) and security PIN.
  - **Enterprise Client:** Uses Corporate Tax ID (GSTIN) and finance email.
- **1-Click Demo Login:** Dedicated button that instantly authenticates with Senior Partner credentials (`CA. Aryan Sharma, FCA`) and transitions directly into `index.html`.
- **Security Trust Footer:** Displays 256-Bit Financial Encryption and ICAI Standards Compliance certifications.

---

## 5. UI/UX Design System & Aesthetic Tokens (`styles.css`)

### Color Palette
- **Canvas / Deep Background:** `#07090e` (Obsidian)
- **Card Surface (Glassmorphic):** `rgba(16, 22, 36, 0.75)` with `backdrop-filter: blur(16px)`
- **Borders:** `1px solid rgba(255, 255, 255, 0.08)` and `rgba(56, 189, 248, 0.45)` (Cyan trim)
- **Primary Brand Gradient:** `linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)`
- **Status Colors:**
  - Emerald (`#10b981`): Success, reconciled status, active tokens.
  - Rose (`#f43f5e`): Debits, expenses, liabilities.
  - Amber (`#f59e0b`): Warning, pending review.
  - Cyan (`#38bdf8`): Active tabs, highlights, revenue, AI badges.

### Ambient Blueprint Background
- Layered geometric blueprint grid (`48px x 48px` mesh) masked with a radial vignette.
- Dual breathing ambient radial orbs (Cyan at top-center and Electric Indigo at bottom-right) animating continuously via CSS keyframes.

### Executive Profile Logo & Insignia
- **Navbar Profile Chip:** Executive vector silhouette set against a radial dark glass surface with a glowing cyan border, an emerald verified checkmark badge (`✓`), and a hover chevron.
- **Hero Profile Avatar:** 86px circular orb with an outer rotating conic-gradient halo (`rotateAvatarRing`), a stamped `CA` metallic gradient seal, and an active pulsing green beacon (`statusPulse`).

---

## 6. Pre-Configured Ledger Database (`app.js`)

| Transaction ID | Date | Counterparty | Ledger Head & GL Code | Class | Debit ($) | Credit ($) | AI Rule & Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TX-2026-8801** | 2026-08-30 | Enterprise Client - Apex Corp | Enterprise SaaS Revenue (4010) | REVENUE | - | $125,000.00 | LLM Recurring Contract (99.8%) |
| **TX-2026-8802** | 2026-08-29 | Amazon Web Services EMEA | Cloud Infrastructure & Hosting (5210) | EXPENSE | $12,450.00 | - | OCR Rule - AWS GST Matches (99.6%) |
| **TX-2026-8803** | 2026-08-27 | Global Tech Retainer Client | Software Advisory Services (4020) | REVENUE | - | $84,500.00 | LLM Auto-Matched Statement (99.4%) |
| **TX-2026-8804** | 2026-08-25 | WeWork Global Operations | Office Rent & Facilities (5100) | EXPENSE | $8,500.00 | - | Lease Contract Parser (99.2%) |
| **TX-2026-8805** | 2026-08-22 | Dell Technologies Enterprise | Office & Hardware Equipment (1520) | ASSET | $4,280.00 | - | Depreciation Engine (98.9%) |
| **TX-2026-8806** | 2026-08-18 | Internal Revenue & Tax Auth | Net GST Accrued Liability (2150) | LIABILITY | - | $68,340.00 | Automated GST Engine (100%) |
| **TX-2026-8807** | 2026-08-15 | Stripe Online Payments | Digital Gateway Collections (1020) | ASSET | $95,400.00 | - | Stripe API Webhook Direct (100%) |
| **TX-2026-8808** | 2026-08-12 | Ernst & Young LLP | Statutory Audit Retainer (5300) | EXPENSE | $6,200.00 | - | LLM Legal & Advisory Match (99.1%) |

---

## 8. 📁 Module 8: Document Expiry & Auto Renewal (`documents.html`)

### Overview
An autonomous, AI-driven statutory document tracking, OCR entity extraction, expiry evaluation, and multi-channel renewal automation suite.

### Architecture & Capabilities:
1. **Multi-Format Document Ingestion:**
   - Supports **PDF**, **DOCX**, **JPG**, and **PNG** uploads via drag-and-drop or file picker.
   - Built-in multi-page parsing with `pypdf`, structured paragraph/table parsing with `python-docx`, and image metadata analysis with `Pillow`.
2. **AI OCR & Entity Extraction Engine (`backend/services/ocr_service.py`):**
   - Extracts 6 core statutory entities:
     - **Document Name** (e.g. FSSAI Food Safety License, Trade Permit, Corporate Insurance, GSTIN Certificate)
     - **Document Type** (Statutory License, Trade Permit, Insurance Policy, Identity / KYC, Lease & Contract, Tax & Compliance, Vehicle / Logistics)
     - **Holder / Corporate Name** (e.g. Apex Global Technologies Pvt Ltd)
     - **Document / Registration ID** (e.g. FSSAI-2024-88410, MCGM-TL-2024-99120)
     - **Issue Date & Legal Expiry Date**
     - **Issuing Authority** (e.g. Food Safety and Standards Authority of India, Municipal Corporation, Parivahan)
   - Evaluates **AI Confidence Score** (0-100%). Scores below 80% or records with missing expiry dates trigger immediate visual warnings for manual verification.
3. **Expiry Horizon Dashboard (6 Live KPI Cards):**
   - **Total Documents:** Total statutory assets vaulted.
   - **Active Documents:** > 90 days legal validity remaining.
   - **Expiring in 90 Days:** Early advisory horizon.
   - **Expiring in 30 Days:** Statutory priority horizon.
   - **Expiring in 7 Days:** Urgent crimson action horizon.
   - **Expired Documents:** Past legal validity alert.
   - **Missing Expiry Date Badge:** Instant filter for documents needing verification.
4. **Automated Daily Compliance Scheduler (`backend/services/scheduler_service.py`):**
   - Daemon thread running every 24 hours (or on-demand via `POST /api/documents/run-scheduler`).
   - Automatically computes `daysRemaining`, reclassifies urgency status (`Active`, `Expiring Soon`, `Expired`, `Renewal Pending`), and triggers automated statutory notices.
5. **Multi-Channel Notification Dispatcher:**
   - Dispatches automated compliance reminders across **Email**, **WhatsApp**, and **In-App Alerts**.
   - Maintains an immutable audit trail (`notifications` collection / log) with delivery timestamps.
6. **AI Renewal Assistant & 1-Click Auto Renewal (`backend/services/renewal_service.py`):**
   - Tailored renewal guides by document category:
     - Official Government Regulatory Portal URL and filing process.
     - Interactive pre-renewal compliance checklists.
     - Auto-calculated suggested new expiry date (+1 yr, +2 yrs, +3 yrs, etc.).
     - Estimated government renewal fee & digital challan token generator.
     - 1-click execution extending legal expiry date with CA certification stamp.

---

## 9. Backend API Specifications (`backend/routes/document_routes.py`)

| Method | Endpoint | Description | Request / Query | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/documents/dashboard` | Returns aggregate KPI stats | None | `{total, active, expiring90, expiring30, expiring7, expired, missingExpiryCount, complianceRate}` |
| `GET` | `/api/documents` | List & filter documents | `?type=&status=&month=&search=` | `{documents: [...], count: int}` |
| `POST` | `/api/documents/upload` | Upload & OCR process document | `Multipart: file, holder_override` | `{success: true, document: {...}, ocrMeta: {...}}` |
| `GET` | `/api/documents/{id}` | Single document details | `doc_id` | Document Object |
| `PUT` | `/api/documents/{id}` | Manual verification & field update | `DocumentUpdatePayload` | `{success: true, document: {...}}` |
| `DELETE`| `/api/documents/{id}` | Delete document record | `doc_id` | `{success: true, message: str}` |
| `GET` | `/api/documents/{id}/renewal-guide` | AI renewal checklist & portal guide | `doc_id` | `{portalName, checklist, suggestedNewExpiry, estimatedFee}` |
| `POST` | `/api/documents/{id}/renew` | Execute 1-click auto-renewal | `{newExpiryDate, feePaid, notes}` | `{success: true, document: {...}}` |
| `POST` | `/api/documents/{id}/remind` | Dispatch multi-channel reminder | `{channels: [...], message: str}` | `{success: true, dispatches: [...]}` |
| `POST` | `/api/documents/run-scheduler` | Run immediate daily expiry scan | None | `{success: true, totalScanned, updatedCount, remindersDispatched}` |
| `GET` | `/api/documents/notifications` | Dispatched notification logs | `?limit=50` | `{notifications: [...], count: int}` |

---

## 10. How to Run & Verify

1. **Start Full Backend Server:**
   ```bash
   uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   Or run the included batch script: `start_backend.bat`
2. **Access Web Interfaces:**
   - **Document Management & Auto Renewal:** `http://127.0.0.1:8000/documents` (or direct [`documents.html`](file:///C:/Users/absma/OneDrive/Desktop/frontened/documents.html))
   - **Main Financial Cockpit:** `http://127.0.0.1:8000/dashboard` (or [`dashboard.html`](file:///C:/Users/absma/OneDrive/Desktop/frontened/dashboard.html))
   - **Landing Page:** `http://127.0.0.1:8000/` (or [`index.html`](file:///C:/Users/absma/OneDrive/Desktop/frontened/index.html))
   - **Interactive API Swagger Docs:** `http://127.0.0.1:8000/api/docs`

