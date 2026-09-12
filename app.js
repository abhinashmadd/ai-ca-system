/* ==========================================================================
   AI CHARTERED ACCOUNTANT PLATFORM - APPLICATION LOGIC
   Modular, Interactive, Real-Time Financial Engine
   ========================================================================== */

// --- Initial Mock Database ---
let ledgerData = [
  {
    id: "TX-2026-8801",
    date: "2026-08-30",
    counterparty: "Enterprise Client - Apex Corp",
    head: "Enterprise SaaS Revenue",
    code: "4010",
    class: "REVENUE",
    debit: 0,
    credit: 125000,
    aiRule: "LLM Recurring Contract",
    confidence: "99.8%",
    reconciled: true
  },
  {
    id: "TX-2026-8802",
    date: "2026-08-29",
    counterparty: "Amazon Web Services EMEA",
    head: "Cloud Infrastructure & Hosting",
    code: "5210",
    class: "EXPENSE",
    debit: 12450,
    credit: 0,
    aiRule: "OCR Rule - AWS GST Matches",
    confidence: "99.6%",
    reconciled: true
  },
  {
    id: "TX-2026-8803",
    date: "2026-08-27",
    counterparty: "Global Tech Retainer Client",
    head: "Software Advisory Services",
    code: "4020",
    class: "REVENUE",
    debit: 0,
    credit: 84500,
    aiRule: "LLM Auto-Matched Statement",
    confidence: "99.4%",
    reconciled: true
  },
  {
    id: "TX-2026-8804",
    date: "2026-08-25",
    counterparty: "WeWork Global Operations",
    head: "Office Rent & Facilities",
    code: "5100",
    class: "EXPENSE",
    debit: 8500,
    credit: 0,
    aiRule: "Lease Contract Parser",
    confidence: "99.2%",
    reconciled: true
  },
  {
    id: "TX-2026-8805",
    date: "2026-08-22",
    counterparty: "Dell Technologies Enterprise",
    head: "Office & Hardware Equipment",
    code: "1520",
    class: "ASSET",
    debit: 4280,
    credit: 0,
    aiRule: "Capital Asset Depreciation Engine",
    confidence: "98.9%",
    reconciled: true
  },
  {
    id: "TX-2026-8806",
    date: "2026-08-18",
    counterparty: "Internal Revenue & Tax Authority",
    head: "Net GST Accrued Liability",
    code: "2150",
    class: "LIABILITY",
    debit: 0,
    credit: 68340,
    aiRule: "Automated GST Engine Output",
    confidence: "100%",
    reconciled: true
  },
  {
    id: "TX-2026-8807",
    date: "2026-08-15",
    counterparty: "Stripe Online Payments Settlement",
    head: "Digital Gateway Collections",
    code: "1020",
    class: "ASSET",
    debit: 95400,
    credit: 0,
    aiRule: "Stripe API Webhook Direct",
    confidence: "100%",
    reconciled: true
  },
  {
    id: "TX-2026-8808",
    date: "2026-08-12",
    counterparty: "Ernst & Young LLP",
    head: "Statutory Audit Retainer",
    code: "5300",
    class: "EXPENSE",
    debit: 6200,
    credit: 0,
    aiRule: "LLM Legal & Advisory Match",
    confidence: "99.1%",
    reconciled: true
  }
];

// Sample OCR Invoices
const sampleInvoices = {
  aws: {
    filename: "Invoice-AWS-Cloud-Aug.pdf",
    vendor: "Amazon Web Services EMEA",
    taxId: "27AAACA1234F1Z8",
    type: "Tax Invoice",
    invoiceNo: "INV-2026-9812",
    date: "2026-08-28",
    subtotal: 10550.85,
    taxAmt: 1899.15,
    total: 12450.00,
    category: "Cloud Infrastructure & Hosting",
    itc: "Eligible - 100% ITC",
    confidence: "99.6%"
  },
  dell: {
    filename: "Dell-Hardware-Receipt.png",
    vendor: "Dell Technologies Direct",
    taxId: "29AADCD5412G1Z3",
    type: "Expense Receipt",
    invoiceNo: "DELL-HW-4410",
    date: "2026-08-21",
    subtotal: 3627.12,
    taxAmt: 652.88,
    total: 4280.00,
    category: "Office & Hardware Equipment",
    itc: "Eligible - 100% ITC",
    confidence: "98.9%"
  },
  lease: {
    filename: "CoWorking-Office-Lease.pdf",
    vendor: "WeWork Global Operations",
    taxId: "07AAACW9988H1ZV",
    type: "Tax Invoice",
    invoiceNo: "WW-LEASE-0826",
    date: "2026-08-24",
    subtotal: 7203.39,
    taxAmt: 1296.61,
    total: 8500.00,
    category: "Rent & Facilities",
    itc: "Eligible - 100% ITC",
    confidence: "99.2%"
  },
  meta: {
    filename: "Meta-Ads-Global-Receipt.pdf",
    vendor: "Meta Platforms Ireland Ltd",
    taxId: "IE9692928F",
    type: "Tax Invoice",
    invoiceNo: "FB-ADS-77192",
    date: "2026-08-30",
    subtotal: 3100.00,
    taxAmt: 558.00,
    total: 3658.00,
    category: "Software Subscriptions",
    itc: "Eligible - 100% ITC",
    confidence: "99.5%"
  }
};

// Global Chart References
let cashFlowChartInstance = null;
let pnlChartInstance = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  initCharts();
  renderLedgerTable(ledgerData);
  setupLedgerFilters();
  setupDocumentPortal();
  setupComplianceSection();
  setupReportCenter();
  setupAiModal();
  setupToastSystem();
  setupUserProfile();
});

/* ================= 1. NAVIGATION ================= */
function setupNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const activePanel = document.getElementById(`panel${capitalize(targetTab)}`);
      if (activePanel) {
        activePanel.classList.add("active");
      }

      // Trigger resize for charts if switching to Analytics
      if (targetTab === "analytics") {
        setTimeout(() => {
          if (cashFlowChartInstance) cashFlowChartInstance.resize();
          if (pnlChartInstance) pnlChartInstance.resize();
        }, 100);
      }
    });
  });

  // Timeframe selector on Analytics panel
  const timeBtns = document.querySelectorAll(".timeframe-selector .time-btn");
  timeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      timeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const period = btn.getAttribute("data-time");
      updateAnalyticsTimeframe(period);
    });
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ================= 2. CHARTS (CHART.JS) ================= */
function initCharts() {
  const chartFont = {
    family: "'Plus Jakarta Sans', sans-serif",
    size: 11
  };

  // Cash Flow & Forecast Chart
  const cfCtx = document.getElementById("cashFlowChart");
  if (cfCtx) {
    const ctx = cfCtx.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 270);
    gradient.addColorStop(0, "rgba(56, 189, 248, 0.35)");
    gradient.addColorStop(1, "rgba(56, 189, 248, 0.0)");

    cashFlowChartInstance = new Chart(cfCtx, {
      type: "line",
      data: {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep (Est)", "Oct (Proj)", "Nov (Proj)"],
        datasets: [
          {
            label: "Operating Cash Flow ($)",
            data: [320000, 395000, 440000, 485000, 524530, 560000, 610000, 675000],
            borderColor: "#38bdf8",
            borderWidth: 2.5,
            backgroundColor: gradient,
            fill: true,
            tension: 0.38,
            pointBackgroundColor: "#07090e",
            pointBorderColor: "#38bdf8",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: "Baseline Reserve Target",
            data: [250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000],
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 1.5,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { color: "#94a3b8", font: chartFont, usePointStyle: true, boxWidth: 6 }
          },
          tooltip: {
            backgroundColor: "#0d121e",
            titleColor: "#38bdf8",
            bodyColor: "#f8fafc",
            borderColor: "rgba(56, 189, 248, 0.3)",
            borderWidth: 1,
            padding: 10,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.04)" },
            ticks: { color: "#64748b", font: chartFont }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.04)" },
            ticks: {
              color: "#64748b",
              font: chartFont,
              callback: val => "$" + (val / 1000) + "k"
            }
          }
        }
      }
    });
  }

  // Profit & Loss Breakdown Chart
  const pnlCtx = document.getElementById("pnlChart");
  if (pnlCtx) {
    pnlChartInstance = new Chart(pnlCtx, {
      type: "bar",
      data: {
        labels: ["SaaS Recurring", "Advisory Services", "Operating COGS", "Hosting & Infra", "Tax & Facilities"],
        datasets: [
          {
            label: "Amount ($)",
            data: [580000, 262950, -145000, -98420, -75000],
            backgroundColor: [
              "#10b981",
              "#34d399",
              "#f43f5e",
              "#fb7185",
              "#f59e0b"
            ],
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0d121e",
            titleColor: "#f8fafc",
            bodyColor: "#94a3b8",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            callbacks: {
              label: item => " Amount: $" + Math.abs(item.raw).toLocaleString()
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#64748b", font: chartFont }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.04)" },
            ticks: {
              color: "#64748b",
              font: chartFont,
              callback: val => (val < 0 ? "-$" : "$") + (Math.abs(val) / 1000) + "k"
            }
          }
        }
      }
    });
  }
}

function updateAnalyticsTimeframe(period) {
  const revEl = document.getElementById("kpiRevenue");
  const expEl = document.getElementById("kpiExpenses");
  const cashEl = document.getElementById("kpiCashFlow");

  if (period === "MTD") {
    revEl.textContent = "$284,150";
    expEl.textContent = "$104,200";
    cashEl.textContent = "$179,950";
  } else if (period === "Q3") {
    revEl.textContent = "$842,950";
    expEl.textContent = "$318,420";
    cashEl.textContent = "$524,530";
  } else if (period === "YTD") {
    revEl.textContent = "$2,480,000";
    expEl.textContent = "$960,400";
    cashEl.textContent = "$1,519,600";
  }
  showToast(`Updated analytics parameters to ${period}`);
}

/* ================= 3. DOCUMENT PORTAL & OCR ================= */
function setupDocumentPortal() {
  const dropzone = document.getElementById("dropzoneContainer");
  const fileInput = document.getElementById("fileInput");
  const selectFileBtn = document.getElementById("selectFileBtn");
  const loadSampleBtn = document.getElementById("loadSampleInvoiceBtn");
  const postToLedgerBtn = document.getElementById("postToLedgerBtn");
  const reScanBtn = document.getElementById("reScanDocBtn");
  const queueItems = document.querySelectorAll(".queue-item");

  // Drag and drop handlers
  dropzone.addEventListener("dragover", e => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      simulateOcrProcessing(file.name);
    }
  });

  selectFileBtn.addEventListener("click", e => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      simulateOcrProcessing(fileInput.files[0].name);
    }
  });

  loadSampleBtn.addEventListener("click", e => {
    e.stopPropagation();
    const keys = Object.keys(sampleInvoices);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    loadInvoiceData(sampleInvoices[randomKey]);
    simulateOcrProcessing(sampleInvoices[randomKey].filename, sampleInvoices[randomKey]);
  });

  queueItems.forEach(item => {
    item.addEventListener("click", () => {
      queueItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const id = item.getAttribute("data-id");
      if (id === "1") loadInvoiceData(sampleInvoices.aws);
      if (id === "2") loadInvoiceData(sampleInvoices.dell);
      if (id === "3") loadInvoiceData(sampleInvoices.lease);
      showToast("Loaded extracted document from ingestion queue");
    });
  });

  reScanBtn.addEventListener("click", () => {
    const filename = document.getElementById("currentDocFilename").textContent.replace("Viewing: ", "");
    simulateOcrProcessing(filename);
  });

  postToLedgerBtn.addEventListener("click", () => {
    postExtractedDocumentToLedger();
  });
}

function loadInvoiceData(data) {
  document.getElementById("currentDocFilename").textContent = `Viewing: ${data.filename}`;
  document.getElementById("docConfidenceBadge").querySelector("strong").textContent = data.confidence;
  document.getElementById("extractedVendor").value = data.vendor;
  document.getElementById("extractedTaxId").value = data.taxId;
  document.getElementById("extractedType").value = data.type;
  document.getElementById("extractedInvoiceNo").value = data.invoiceNo;
  document.getElementById("extractedDate").value = data.date;
  document.getElementById("extractedSubtotal").value = data.subtotal;
  document.getElementById("extractedTaxAmt").value = data.taxAmt;
  document.getElementById("extractedTotal").value = data.total;
  document.getElementById("extractedCategory").value = data.category;
  document.getElementById("extractedItcStatus").value = data.itc;
}

function simulateOcrProcessing(fileName, specificData = null) {
  const progressContainer = document.getElementById("ocrProgressContainer");
  const stageText = document.getElementById("ocrStageText");
  const percentText = document.getElementById("ocrPercent");
  const fillBar = document.getElementById("ocrBarFill");
  const statusIndicator = document.getElementById("ocrLiveStatus");

  progressContainer.style.display = "block";
  statusIndicator.innerHTML = '<span style="color: #38bdf8;">Scanning Document with OCR Engine...</span>';

  const stages = [
    { pct: 25, label: "Optical scanning & coordinate mapping..." },
    { pct: 55, label: "Isolating tabular items & GSTIN extraction..." },
    { pct: 85, label: "LLM Accounting rule verification & categorization..." },
    { pct: 100, label: "Complete • 99.7% confidence achieved" }
  ];

  let step = 0;
  fillBar.style.width = "0%";

  const interval = setInterval(() => {
    if (step < stages.length) {
      const s = stages[step];
      stageText.textContent = s.label;
      percentText.textContent = `${s.pct}%`;
      fillBar.style.width = `${s.pct}%`;
      step++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        progressContainer.style.display = "none";
        statusIndicator.innerHTML = '<span class="status-ready text-emerald">✓ Document Ingestion Ready</span>';
        if (specificData) {
          loadInvoiceData(specificData);
        } else {
          // generic update
          document.getElementById("currentDocFilename").textContent = `Viewing: ${fileName}`;
          showToast(`OCR successfully extracted 7 fields from ${fileName}`);
        }
      }, 500);
    }
  }, 350);
}

function postExtractedDocumentToLedger() {
  const vendor = document.getElementById("extractedVendor").value;
  const invoiceNo = document.getElementById("extractedInvoiceNo").value;
  const date = document.getElementById("extractedDate").value;
  const total = parseFloat(document.getElementById("extractedTotal").value) || 0;
  const category = document.getElementById("extractedCategory").value;
  const conf = document.getElementById("docConfidenceBadge").querySelector("strong").textContent;

  const newTx = {
    id: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    date: date,
    counterparty: vendor,
    head: category,
    code: "5210",
    class: "EXPENSE",
    debit: total,
    credit: 0,
    aiRule: `OCR Ingestion (${invoiceNo})`,
    confidence: conf,
    reconciled: true
  };

  // Prepend to ledger
  ledgerData.unshift(newTx);
  renderLedgerTable(ledgerData);

  // Update KPI
  const currentExp = parseFloat(document.getElementById("kpiExpenses").textContent.replace(/[$,]/g, "")) || 0;
  const updatedExp = currentExp + total;
  document.getElementById("kpiExpenses").textContent = "$" + updatedExp.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  showToast(`Posted ${invoiceNo} ($${total.toLocaleString()}) to General Ledger!`);

  // Switch to Ledger Tab smoothly
  setTimeout(() => {
    document.getElementById("tabLedger").click();
  }, 800);
}

/* ================= 4. GENERAL LEDGER HUB ================= */
function renderLedgerTable(data) {
  const tbody = document.getElementById("ledgerTableBody");
  const countEl = document.getElementById("visibleTxCount");
  if (!tbody) return;

  tbody.innerHTML = "";
  countEl.textContent = data.length;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No ledger records match your filter criteria.</td></tr>`;
    return;
  }

  data.forEach(tx => {
    const tr = document.createElement("tr");

    const debitDisplay = tx.debit > 0 ? `<span class="amt-debit">$${tx.debit.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>` : '<span style="color: var(--text-dim);">-</span>';
    const creditDisplay = tx.credit > 0 ? `<span class="amt-credit">$${tx.credit.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>` : '<span style="color: var(--text-dim);">-</span>';
    const classBadge = `<span class="tx-badge ${tx.class.toLowerCase()}">${tx.class}</span>`;

    tr.innerHTML = `
      <td>
        <div class="tx-cell-meta">
          <strong>${tx.id}</strong>
          <small>${tx.date}</small>
        </div>
      </td>
      <td>
        <span class="tx-counterparty">${tx.counterparty}</span>
      </td>
      <td>
        <div>
          <div>${tx.head}</div>
          <small class="font-mono text-muted">GL Code: ${tx.code}</small>
        </div>
      </td>
      <td>${classBadge}</td>
      <td>${debitDisplay}</td>
      <td>${creditDisplay}</td>
      <td>
        <div class="ai-rule-badge">
          <span>⚡ ${tx.aiRule}</span>
          <small>(${tx.confidence})</small>
        </div>
      </td>
      <td>
        <span class="rec-status-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Reconciled
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setupLedgerFilters() {
  const searchInput = document.getElementById("ledgerSearchInput");
  const chips = document.querySelectorAll("#ledgerFilterChips .chip");
  const reconcileBtn = document.getElementById("reconcileBankBtn");
  const exportCsvBtn = document.getElementById("exportLedgerCsvBtn");

  let currentFilter = "ALL";
  let currentSearch = "";

  function applyFilters() {
    let filtered = ledgerData.filter(item => {
      const matchType = currentFilter === "ALL" || item.class === currentFilter;
      const term = currentSearch.toLowerCase();
      const matchSearch =
        item.counterparty.toLowerCase().includes(term) ||
        item.head.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term) ||
        item.code.includes(term);
      return matchType && matchSearch;
    });
    renderLedgerTable(filtered);
  }

  searchInput.addEventListener("input", e => {
    currentSearch = e.target.value.trim();
    applyFilters();
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.getAttribute("data-filter");
      applyFilters();
    });
  });

  reconcileBtn.addEventListener("click", () => {
    showToast("Connecting to Banking APIs... Reconciling 100% of ledger transactions.");
    setTimeout(() => {
      showToast("Bank Reconciliation Complete: 0 variances detected across accounts.");
    }, 900);
  });

  exportCsvBtn.addEventListener("click", () => {
    downloadLedgerCsv();
  });
}

function downloadLedgerCsv() {
  let csv = "Transaction ID,Date,Counterparty,Ledger Head,GL Code,Classification,Debit,Credit,AI Rule,Confidence,Status\n";
  ledgerData.forEach(tx => {
    csv += `"${tx.id}","${tx.date}","${tx.counterparty}","${tx.head}","${tx.code}","${tx.class}",${tx.debit},${tx.credit},"${tx.aiRule}","${tx.confidence}","Reconciled"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `General_Ledger_Export_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Downloaded General Ledger CSV file.");
}

/* ================= 5. COMPLIANCE & GST PANEL ================= */
function setupComplianceSection() {
  const signOffBtn = document.getElementById("caSignOffBtn");
  const modal = document.getElementById("caSignOffModal");
  const closeBtn = document.getElementById("closeSignOffModalBtn");
  const cancelBtn = document.getElementById("cancelSignOffBtn");
  const confirmBtn = document.getElementById("confirmSignOffBtn");

  signOffBtn.addEventListener("click", () => {
    modal.classList.add("open");
  });

  closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  cancelBtn.addEventListener("click", () => modal.classList.remove("open"));

  confirmBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    const cert = document.getElementById("caCertId").value;
    const badge = document.getElementById("valReadinessStatus");
    badge.innerHTML = `<span class="badge-success" style="background: rgba(16, 185, 129, 0.2); border-color: #10b981;">✓ Certified by CA (${cert})</span>`;
    showToast(`Chartered Accountant Certificate ${cert} successfully stamped!`);
  });

  // Checklist item updates
  const checkboxes = document.querySelectorAll(".check-item input[type='checkbox']");
  const progressEl = document.getElementById("checklistProgress");

  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const checked = document.querySelectorAll(".check-item input[type='checkbox']:checked").length;
      progressEl.textContent = `${checked} of 4 Verified`;
      if (checked === 4) {
        progressEl.className = "badge-soft text-emerald";
      } else {
        progressEl.className = "badge-soft";
      }
    });
  });
}

/* ================= 6. REPORT EXPORT CENTER ================= */
function setupReportCenter() {
  document.getElementById("previewPnlBtn").addEventListener("click", () => previewReport("pnl"));
  document.getElementById("downloadPnlBtn").addEventListener("click", () => downloadReport("pnl"));
  document.getElementById("previewBsBtn").addEventListener("click", () => previewReport("balancesheet"));
  document.getElementById("downloadBsBtn").addEventListener("click", () => downloadReport("balancesheet"));
  document.getElementById("previewGstBtn").addEventListener("click", () => previewReport("gst"));
  document.getElementById("downloadGstBtn").addEventListener("click", () => downloadReport("gst"));
  document.getElementById("previewRecBtn").addEventListener("click", () => previewReport("reconciliation"));
  document.getElementById("downloadRecBtn").addEventListener("click", () => downloadReport("reconciliation"));
  document.getElementById("printSheetBtn").addEventListener("click", () => window.print());

  // Render default preview
  previewReport("pnl");
}

function previewReport(type) {
  const titleEl = document.getElementById("previewSheetTitle");
  const contentEl = document.getElementById("previewSheetContent");

  if (type === "pnl") {
    titleEl.textContent = "Comprehensive Profit & Loss Statement (Q3 FY26)";
    contentEl.innerHTML = `
------------------------------------------------------------------------------------------------
AI CHARTERED ACCOUNTANT AUTOMATION SYSTEM — AUDITED STATEMENT
Statement of Profit and Loss for Period Ending August 31, 2026
------------------------------------------------------------------------------------------------

1. GROSS REVENUE FROM OPERATIONS:
   - Enterprise Cloud & SaaS Recurring Invoicing:             $580,000.00
   - Professional Technology Advisory Services:              $262,950.00
   ------------------------------------------------------------------------
   TOTAL REVENUE (A):                                        $842,950.00

2. OPERATING EXPENSES (LLM CATEGORIZED):
   - Direct Cloud Infrastructure & Data Centers:             $98,420.00
   - Operational Subscriptions & Tooling:                     $45,000.00
   - Facilities, Leases & Office Infrastructure:              $38,500.00
   - Statutory Audit, Legal & Compliance Retainers:          $34,200.00
   - General & Administrative Overheads:                     $102,300.00
   ------------------------------------------------------------------------
   TOTAL OPERATING OVERHEADS (B):                            $318,420.00

3. OPERATING PROFIT / EBITDA (A - B):                        $524,530.00  (62.2% Net Margin)
   - Provision for Accrued Net GST Obligations:             -$68,340.00
   ------------------------------------------------------------------------
   NET RETAINED SURPLUS:                                     $456,190.00

Audit Certification: 100% Reconciled against Banking Feeds and Verified Counterparty Tax IDs.
    `;
  } else if (type === "balancesheet") {
    titleEl.textContent = "Certified Balance Sheet Statement of Financial Position";
    contentEl.innerHTML = `
------------------------------------------------------------------------------------------------
STATEMENT OF FINANCIAL POSITION (BALANCE SHEET) — DOUBLE-ENTRY VERIFIED
------------------------------------------------------------------------------------------------
ASSETS:
  Current Assets:
    - Cash & Liquid Operational Bank Balances:               $682,400.00
    - Trade Accounts Receivable (Automated Invoicing):       $398,400.00
    - Input Tax Credit (ITC) Available in Electronic Ledger: $160,000.00
  Non-Current Assets:
    - Office Hardware, Servers & Network Equipment:          $85,000.00
  ------------------------------------------------------------------------
  TOTAL ASSETS:                                              $1,325,800.00

LIABILITIES & SHAREHOLDERS' EQUITY:
  Current Liabilities:
    - Accounts Payable (OCR Extracted & Approved):           $214,300.00
    - Net Statutory GST / Tax Obligations:                   $68,340.00
    - Short-term Accrued Employee Liabilities:               $187,560.00
  Total Liabilities:                                         $470,200.00

  Shareholders' Net Worth:
    - Capital Reserves:                                      $331,070.00
    - Cumulative Retained Earnings:                          $524,530.00
  ------------------------------------------------------------------------
  TOTAL LIABILITIES & EQUITY:                                $1,325,800.00 (Balanced Trial)
    `;
  } else if (type === "gst") {
    titleEl.textContent = "GST & Tax Compliance Audit Workbook (GSTR-1 / 3B / 2B)";
    contentEl.innerHTML = `
------------------------------------------------------------------------------------------------
GOODS & SERVICES TAX COMPLIANCE & INPUT TAX CREDIT RECONCILIATION
------------------------------------------------------------------------------------------------
Tax Period: August 2026 | Filing Status: Ready for CA Electronic Stamp

OUTPUT LIABILITY BREAKDOWN:
  - CGST (Central Goods & Service Tax 9%):                   $34,170.00
  - SGST (State Goods & Service Tax 9%):                     $34,170.00
  - IGST (Inter-State Integrated Tax 18%):                   $24,190.00
  Total Gross Tax Payable:                                   $92,530.00

ELIGIBLE INPUT TAX CREDIT (ITC DEDUCTION):
  - Invoices Reconciled on GSTR-2B:                         -$24,190.00
  - Ineligible ITC Isolated (Sec 17(5)):                     $0.00 (Segregated)
  ------------------------------------------------------------------------
  NET CASH PAYABLE TO GOVERNMENT:                            $68,340.00

Compliance Verification Status: Zero discrepancies identified. Ready for one-click submission.
    `;
  } else if (type === "reconciliation") {
    titleEl.textContent = "Automated Bank Reconciliation Cross-Verification Log";
    contentEl.innerHTML = `
------------------------------------------------------------------------------------------------
BANK RECONCILIATION CROSS-VERIFICATION AUDIT LOG
------------------------------------------------------------------------------------------------
API Endpoint: Fast-Banking Webhook Gateway (Secure ISO20022 Standard)
Reconciliation Rate: 100% Matched | Variance: $0.00

Sample Matched Transactions:
  [MATCHED] Ref: TX-2026-8801 | Bank Date: 2026-08-30 | Amount: +$125,000.00 | Wire From: Apex Corp
  [MATCHED] Ref: TX-2026-8802 | Bank Date: 2026-08-29 | Amount: -$12,450.00   | Debit: AWS EMEA
  [MATCHED] Ref: TX-2026-8803 | Bank Date: 2026-08-27 | Amount: +$84,500.00  | Wire: Global Retainer
  [MATCHED] Ref: TX-2026-8804 | Bank Date: 2026-08-25 | Amount: -$8,500.00    | Debit: WeWork Global
  [MATCHED] Ref: TX-2026-8807 | Bank Date: 2026-08-15 | Amount: +$95,400.00  | Settlement: Stripe Online

Automated Bank Confirmation: All balances synchronized with zero human intervention.
    `;
  }

  showToast(`Loaded ${titleEl.textContent}`);
}

function downloadReport(type) {
  const content = document.getElementById("previewSheetContent").textContent;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AI_CA_Report_${type.toUpperCase()}_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Exported ${type.toUpperCase()} report document!`);
}

/* ================= 7. AI ASSISTANT MODAL ================= */
function setupAiModal() {
  const modal = document.getElementById("aiAssistantModal");
  const openBtn = document.getElementById("openAiModalBtn");
  const closeBtn = document.getElementById("closeAiModalBtn");
  const queryForm = document.getElementById("aiQueryForm");
  const queryInput = document.getElementById("aiQueryInput");
  const chatHistory = document.getElementById("aiChatHistory");
  const quickBtns = document.querySelectorAll(".quick-query-btn");

  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
    queryInput.focus();
  });

  closeBtn.addEventListener("click", () => modal.classList.remove("open"));

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("open");
  });

  quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-query");
      queryInput.value = q;
      handleSubmitQuery(q);
    });
  });

  queryForm.addEventListener("submit", e => {
    e.preventDefault();
    const q = queryInput.value.trim();
    if (!q) return;
    handleSubmitQuery(q);
  });

  function handleSubmitQuery(query) {
    appendMessage("user", query);
    queryInput.value = "";

    // Simulate AI thinking and reply
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes("margin") || lower.includes("profit") || lower.includes("projected")) {
        reply = "Based on our current Q3 data: Realized revenue is $842,950 against operating expenses of $318,420, giving an EBITDA of $524,530 (a healthy 62.2% operating margin). Projected Q4 revenue indicates +14% continuation.";
      } else if (lower.includes("bank") || lower.includes("reconcil")) {
        reply = "Automated Bank Reconciliation Engine reports 100% matched transactions across all active business accounts. There are 0 unresolved ledger variances as of today.";
      } else if (lower.includes("tax") || lower.includes("gst") || lower.includes("itc")) {
        reply = "Your current Gross GST liability is $92,530.00. Thanks to automated OCR invoice tagging, you have $24,190.00 in eligible Input Tax Credits (ITC), bringing net payable obligation down to $68,340.00.";
      } else {
        reply = `I have analyzed the General Ledger and financial models for "${query}". All parameters align with standard accounting standards (AS-1 / Ind AS / IFRS) with 99.6% model confidence.`;
      }

      appendMessage("ai", reply);
    }, 450);
  }

  function appendMessage(role, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${role}-msg`;

    const author = document.createElement("div");
    author.className = "msg-author";
    author.textContent = role === "ai" ? "AI CA Engine" : "You";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.textContent = text;

    msgDiv.appendChild(author);
    msgDiv.appendChild(bubble);
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
}

/* ================= 8. TOAST SYSTEM ================= */
let toastTimeout;
function setupToastSystem() {
  // Container already exists in HTML
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span style="color: var(--cyan-primary);">⚡</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ================= 9. CA PROFILE & SESSION MANAGEMENT ================= */
function setupUserProfile() {
  const navUserChip = document.getElementById("navUserChip");
  const tabProfile = document.getElementById("tabProfile");
  const saveBtn = document.getElementById("saveProfileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Load profile state
  loadStoredUserProfile();

  // Clicking navbar chip opens Profile tab
  if (navUserChip) {
    navUserChip.addEventListener("click", () => {
      if (tabProfile) tabProfile.click();
    });
  }

  // Save changes
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const updatedUser = {
        name: document.getElementById("profInputName").value.trim(),
        email: document.getElementById("profInputEmail").value.trim(),
        firm: document.getElementById("profInputFirm").value.trim(),
        frn: document.getElementById("profInputFrn").value.trim(),
        address: document.getElementById("profInputAddress").value.trim(),
        gstin: document.getElementById("profInputGstin").value.trim(),
        phone: document.getElementById("profInputPhone").value.trim(),
        role: "Senior Partner CA",
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (localStorage.getItem("ai_ca_user")) {
        localStorage.setItem("ai_ca_user", JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem("ai_ca_user", JSON.stringify(updatedUser));
      }
      applyUserProfileToUI(updatedUser);
      showToast("CA Practitioner profile & firm credentials saved successfully!");
    });
  }

  // Logout action
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("ai_ca_user");
      sessionStorage.removeItem("ai_ca_user");
      showToast("Logging out from secure CA cockpit...");
      setTimeout(() => {
        window.location.replace("signin.html");
      }, 600);
    });
  }
}

function loadStoredUserProfile() {
  const stored = localStorage.getItem("ai_ca_user") || sessionStorage.getItem("ai_ca_user");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      applyUserProfileToUI(user);
    } catch (e) {
      console.warn("Could not parse stored profile", e);
    }
  } else {
    window.location.replace("signin.html");
  }
}

function applyUserProfileToUI(user) {
  if (user.name) {
    const navName = document.getElementById("navUserName");
    const heroName = document.getElementById("profHeroName");
    const inputName = document.getElementById("profInputName");
    if (navName) navName.textContent = user.name;
    if (heroName) heroName.textContent = user.name;
    if (inputName) inputName.value = user.name;
  }

  if (user.role) {
    const navRole = document.getElementById("navUserRole");
    if (navRole) navRole.textContent = user.role;
  }

  if (user.firm) {
    const heroFirm = document.getElementById("profHeroFirm");
    const inputFirm = document.getElementById("profInputFirm");
    if (heroFirm) heroFirm.textContent = `Senior Managing Partner at ${user.firm}`;
    if (inputFirm) inputFirm.value = user.firm;
  }

  if (user.email) {
    const inputEmail = document.getElementById("profInputEmail");
    if (inputEmail) inputEmail.value = user.email;
  }

  if (user.frn) {
    const inputFrn = document.getElementById("profInputFrn");
    if (inputFrn) inputFrn.value = user.frn;
  }

  if (user.loginTime) {
    const sessTime = document.getElementById("activeSessionTime");
    if (sessTime) sessTime.textContent = `Logged in: Today at ${user.loginTime} • Windows Cockpit Terminal`;
  }
}


