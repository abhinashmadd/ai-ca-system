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
let currentLoadedDoc = null;
let currentReportType = "pnl";

// ==========================================================================
// CENTRAL CURRENCY & FOREX CONVERSION ENGINE
// ==========================================================================
const CurrencyEngine = {
  currentCurrency: localStorage.getItem("ai_ca_currency") || "INR",

  rates: {
    USD: 1.0,
    INR: 83.5,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 155.0,
    CNY: 7.23,
    KRW: 1380.0,
    RUB: 92.0,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.90,
    SGD: 1.35,
    AED: 3.67,
    SAR: 3.75,
    QAR: 3.64,
    THB: 36.5,
    MYR: 4.72,
    IDR: 16200.0,
    NPR: 133.6,
    BDT: 117.2,
    PKR: 278.5,
    ZAR: 18.5,
    BRL: 5.25,
    MXN: 17.1,
    TRY: 32.5,
    AFN: 71.2,
    ARS: 890.0,
    EGP: 47.8,
    ILS: 3.72,
    NZD: 1.64,
    PHP: 58.2,
    VND: 25400.0,
    LKR: 302.0,
    SEK: 10.6,
    NOK: 10.8,
    DKK: 6.9,
    PLN: 3.98,
    CZK: 23.2,
    UAH: 40.5,
    KWD: 0.31,
    BHD: 0.38,
    OMR: 0.38,
    JOD: 0.71,
    IQD: 1310.0,
    IRR: 42000.0,
    BTC: 0.000015,
    ETH: 0.00028
  },

  symbols: {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    KRW: "₩",
    RUB: "₽",
    CAD: "C$",
    AUD: "A$",
    CHF: "CHF ",
    SGD: "S$",
    AED: "د.إ ",
    SAR: "﷼ ",
    QAR: "﷼ ",
    THB: "฿",
    MYR: "RM ",
    IDR: "Rp ",
    NPR: "NRs ",
    BDT: "৳",
    PKR: "₨ ",
    ZAR: "R ",
    BRL: "R$ ",
    MXN: "$",
    TRY: "₺",
    AFN: "؋",
    ARS: "ARS$ ",
    EGP: "E£ ",
    ILS: "₪",
    NZD: "NZ$",
    PHP: "₱",
    VND: "₫",
    LKR: "Rs ",
    SEK: " kr",
    NOK: " kr",
    DKK: " kr",
    PLN: " zł",
    CZK: " Kč",
    UAH: "₴",
    KWD: "KD ",
    BHD: "BD ",
    OMR: "OMR ",
    JOD: "JD ",
    IQD: "IQD ",
    IRR: "﷼ ",
    BTC: "₿",
    ETH: "Ξ"
  },

  getRate() {
    return this.rates[this.currentCurrency] || 1.0;
  },

  getSymbol() {
    return this.symbols[this.currentCurrency] || (this.currentCurrency + " ");
  },

  format(baseUsdAmount, decimals = 2) {
    if (typeof baseUsdAmount !== "number" || isNaN(baseUsdAmount)) {
      baseUsdAmount = parseFloat(String(baseUsdAmount).replace(/[^0-9.-]+/g, '')) || 0;
    }
    const converted = baseUsdAmount * this.getRate();
    const sym = this.getSymbol();
    const isCrypto = this.currentCurrency === "BTC" || this.currentCurrency === "ETH";
    const dec = isCrypto ? 4 : decimals;

    const locale = this.currentCurrency === "INR" ? "en-IN" : "en-US";
    const formatted = converted.toLocaleString(locale, {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });

    return `${sym}${formatted}`;
  },

  formatCompact(baseUsdAmount) {
    const converted = baseUsdAmount * this.getRate();
    const sym = this.getSymbol();
    if (this.currentCurrency === "INR") {
      if (Math.abs(converted) >= 1e7) return `${sym}${(converted / 1e7).toFixed(2)} Cr`;
      if (Math.abs(converted) >= 1e5) return `${sym}${(converted / 1e5).toFixed(2)} L`;
    }
    if (Math.abs(converted) >= 1e6) return `${sym}${(converted / 1e6).toFixed(1)}M`;
    if (Math.abs(converted) >= 1e3) return `${sym}${(converted / 1e3).toFixed(0)}k`;
    return `${sym}${converted.toFixed(0)}`;
  },

  setCurrency(code) {
    if (!this.rates[code] && !this.symbols[code]) return;
    this.currentCurrency = code;
    localStorage.setItem("ai_ca_currency", code);

    // Sync all dropdown elements in the DOM
    const navSelect = document.getElementById("navCurrencySelect");
    if (navSelect && navSelect.value !== code) navSelect.value = code;
    const altSelect = document.getElementById("currencySelect");
    if (altSelect && altSelect.value !== code) altSelect.value = code;

    // Refresh all UI elements
    this.updateAll();
    showToast(`Currency updated to ${code} (${this.getSymbol().trim()})`);
  },

  updateAll() {
    updateKPIs();
    renderLedgerTable(ledgerData);
    updateChartsCurrency();
    updateOverviewBalanceSheet();
    updateDocQueueAmounts();
    updateLedgerHeaders();
    updateComplianceValues();
    updateSignOffModalValues();
    if (typeof previewReport === "function") {
      previewReport(currentReportType);
    }
    if (currentLoadedDoc && typeof loadInvoiceData === "function") {
      loadInvoiceData(currentLoadedDoc);
    }
  }
};

const kpiBaseValues = {
  MTD: { rev: 284150, exp: 104200, cash: 179950, tax: 24190, itc: 8500 },
  Q3: { rev: 842950, exp: 318420, cash: 524530, tax: 68340, itc: 24190 },
  YTD: { rev: 2480000, exp: 960400, cash: 1519600, tax: 184500, itc: 65000 }
};
let currentTimeframe = "Q3";

const baseCashFlowData = [320000, 395000, 440000, 485000, 524530, 560000, 610000, 675000];
const baseBaselineData = [250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000];
const basePnlData = [580000, 262950, -145000, -98420, -75000];

function updateKPIs() {
  const data = kpiBaseValues[currentTimeframe] || kpiBaseValues.Q3;
  const revEl = document.getElementById("kpiRevenue");
  const expEl = document.getElementById("kpiExpenses");
  const cashEl = document.getElementById("kpiCashFlow");
  const taxEl = document.getElementById("kpiTax");
  const itcSubEl = document.querySelector("#kpiTax + .kpi-subtext") || document.querySelector("#kpiTax ~ .kpi-subtext");

  if (revEl) revEl.textContent = CurrencyEngine.format(data.rev, 0);
  if (expEl) expEl.textContent = CurrencyEngine.format(data.exp, 0);
  if (cashEl) cashEl.textContent = CurrencyEngine.format(data.cash, 0);
  if (taxEl) taxEl.textContent = CurrencyEngine.format(data.tax, 0);
  if (itcSubEl) itcSubEl.textContent = `Eligible ITC Deductions: ${CurrencyEngine.format(data.itc, 0)}`;
}

function updateOverviewBalanceSheet() {
  const map = {
    bsAssetsTotal: 1240800,
    bsCashBank: 682400,
    bsAr: 398400,
    bsItc: 160000,
    bsLiabTotal: 385200,
    bsAp: 214300,
    bsTaxPayable: 68340,
    bsAccruals: 102560,
    bsEquityTotal: 855600,
    bsRetainedEarnings: 524530,
    bsReserves: 331070
  };

  for (const [id, baseVal] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.textContent = CurrencyEngine.format(baseVal, 0);
  }
}

function updateDocQueueAmounts() {
  const q1 = document.getElementById("queueAmt1");
  const q2 = document.getElementById("queueAmt2");
  const q3 = document.getElementById("queueAmt3");
  if (q1) q1.textContent = CurrencyEngine.format(12450.00, 2);
  if (q2) q2.textContent = CurrencyEngine.format(4280.00, 2);
  if (q3) q3.textContent = CurrencyEngine.format(8500.00, 2);
}

function updateLedgerHeaders() {
  const sym = CurrencyEngine.getSymbol().trim();
  document.querySelectorAll(".currency-symbol").forEach(el => {
    el.textContent = sym;
  });
}

function updateComplianceValues() {
  const outTax = document.getElementById("valOutputTax");
  const itc = document.getElementById("valItcCredit");
  const netPay = document.getElementById("valNetTaxPayable");
  const cgst = document.getElementById("valCgstAmt");
  const sgst = document.getElementById("valSgstAmt");
  const igst = document.getElementById("valIgstAmt");
  const totOut = document.getElementById("valTotalOutputAmt");
  const checkBal = document.getElementById("valBalancingCheck");

  if (outTax) outTax.textContent = CurrencyEngine.format(92530, 2);
  if (itc) itc.textContent = "-" + CurrencyEngine.format(24190, 2);
  if (netPay) netPay.textContent = CurrencyEngine.format(68340, 2);
  if (cgst) cgst.textContent = CurrencyEngine.format(34170, 2);
  if (sgst) sgst.textContent = CurrencyEngine.format(34170, 2);
  if (igst) igst.textContent = CurrencyEngine.format(24190, 2);
  if (totOut) totOut.textContent = CurrencyEngine.format(92530, 2);
  if (checkBal) {
    const deb = CurrencyEngine.format(1161370, 0);
    const cr = CurrencyEngine.format(1161370, 0);
    checkBal.textContent = `Total Debits (${deb}) strictly match Total Credits (${cr}).`;
  }
}

function updateSignOffModalValues() {
  const rev = document.getElementById("signOffGrossRevenue");
  const gst = document.getElementById("signOffNetGst");
  if (rev) rev.textContent = CurrencyEngine.format(842950, 2);
  if (gst) gst.textContent = CurrencyEngine.format(68340, 2);
}

function setupCurrencySelector() {
  const navSelect = document.getElementById("navCurrencySelect");
  const altSelect = document.getElementById("currencySelect");

  const sync = (val) => {
    CurrencyEngine.setCurrency(val);
  };

  if (navSelect) {
    navSelect.value = CurrencyEngine.currentCurrency;
    navSelect.addEventListener("change", (e) => sync(e.target.value));
  }

  if (altSelect) {
    altSelect.value = CurrencyEngine.currentCurrency;
    altSelect.addEventListener("change", (e) => sync(e.target.value));
  }
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupCurrencySelector();
  initCharts();
  renderLedgerTable(ledgerData);
  setupLedgerFilters();
  setupDocumentPortal();
  setupComplianceSection();
  setupReportCenter();
  setupAuthoritySection();
  setupAiModal();
  setupToastSystem();
  setupUserProfile();

  // Initial application of current currency across entire UI
  CurrencyEngine.updateAll();
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

    const sym = CurrencyEngine.getSymbol().trim();
    const rate = CurrencyEngine.getRate();

    cashFlowChartInstance = new Chart(cfCtx, {
      type: "line",
      data: {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep (Est)", "Oct (Proj)", "Nov (Proj)"],
        datasets: [
          {
            label: `Operating Cash Flow (${sym})`,
            data: baseCashFlowData.map(v => Math.round(v * rate)),
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
            data: baseBaselineData.map(v => Math.round(v * rate)),
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
            displayColors: false,
            callbacks: {
              label: item => ` Cash Flow: ${CurrencyEngine.format(item.raw / rate)}`
            }
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
              callback: val => CurrencyEngine.formatCompact(val / rate)
            }
          }
        }
      }
    });
  }

  // Profit & Loss Breakdown Chart
  const pnlCtx = document.getElementById("pnlChart");
  if (pnlCtx) {
    const sym = CurrencyEngine.getSymbol().trim();
    const rate = CurrencyEngine.getRate();

    pnlChartInstance = new Chart(pnlCtx, {
      type: "bar",
      data: {
        labels: ["SaaS Recurring", "Advisory Services", "Operating COGS", "Hosting & Infra", "Tax & Facilities"],
        datasets: [
          {
            label: `Amount (${sym})`,
            data: basePnlData.map(v => Math.round(v * rate)),
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
              label: item => ` Amount: ${CurrencyEngine.format(Math.abs(item.raw) / rate)}`
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
              callback: val => CurrencyEngine.formatCompact(val / rate)
            }
          }
        }
      }
    });
  }
}

function updateChartsCurrency() {
  const sym = CurrencyEngine.getSymbol().trim();
  const rate = CurrencyEngine.getRate();

  if (cashFlowChartInstance) {
    cashFlowChartInstance.data.datasets[0].label = `Operating Cash Flow (${sym})`;
    cashFlowChartInstance.data.datasets[0].data = baseCashFlowData.map(v => Math.round(v * rate));
    cashFlowChartInstance.data.datasets[1].data = baseBaselineData.map(v => Math.round(v * rate));
    cashFlowChartInstance.options.scales.y.ticks.callback = val => CurrencyEngine.formatCompact(val / rate);
    cashFlowChartInstance.update();
  }

  if (pnlChartInstance) {
    pnlChartInstance.data.datasets[0].label = `Amount (${sym})`;
    pnlChartInstance.data.datasets[0].data = basePnlData.map(v => Math.round(v * rate));
    pnlChartInstance.options.plugins.tooltip.callbacks.label = item => ` Amount: ${CurrencyEngine.format(Math.abs(item.raw) / rate)}`;
    pnlChartInstance.options.scales.y.ticks.callback = val => CurrencyEngine.formatCompact(val / rate);
    pnlChartInstance.update();
  }
}

function updateAnalyticsTimeframe(period) {
  currentTimeframe = period;
  updateKPIs();
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
  currentLoadedDoc = data;
  const rate = CurrencyEngine.getRate();
  const subEl = document.getElementById("extractedSubtotal");
  const taxEl = document.getElementById("extractedTaxAmt");
  const totEl = document.getElementById("extractedTotal");

  document.getElementById("currentDocFilename").textContent = `Viewing: ${data.filename}`;
  document.getElementById("docConfidenceBadge").querySelector("strong").textContent = data.confidence;
  document.getElementById("extractedVendor").value = data.vendor;
  document.getElementById("extractedTaxId").value = data.taxId;
  document.getElementById("extractedType").value = data.type;
  document.getElementById("extractedInvoiceNo").value = data.invoiceNo;
  document.getElementById("extractedDate").value = data.date;
  if (subEl) subEl.value = (data.subtotal * rate).toFixed(2);
  if (taxEl) taxEl.value = (data.taxAmt * rate).toFixed(2);
  if (totEl) totEl.value = (data.total * rate).toFixed(2);
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
  const totalEntered = parseFloat(document.getElementById("extractedTotal").value) || 0;
  const category = document.getElementById("extractedCategory").value;
  const conf = document.getElementById("docConfidenceBadge").querySelector("strong").textContent;
  const baseTotal = totalEntered / CurrencyEngine.getRate();

  const newTx = {
    id: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    date: date,
    counterparty: vendor,
    head: category,
    code: "5210",
    class: "EXPENSE",
    debit: baseTotal,
    credit: 0,
    aiRule: `OCR Ingestion (${invoiceNo})`,
    confidence: conf,
    reconciled: true
  };

  // Prepend to ledger
  ledgerData.unshift(newTx);
  renderLedgerTable(ledgerData);

  // Update KPI
  kpiBaseValues.Q3.exp += baseTotal;
  CurrencyEngine.updateKPIs();

  showToast(`Posted ${invoiceNo} (${CurrencyEngine.format(baseTotal)}) to General Ledger!`);

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

    const debitDisplay = tx.debit > 0 ? `<span class="amt-debit">${CurrencyEngine.format(tx.debit)}</span>` : '<span style="color: var(--text-dim);">-</span>';
    const creditDisplay = tx.credit > 0 ? `<span class="amt-credit">${CurrencyEngine.format(tx.credit)}</span>` : '<span style="color: var(--text-dim);">-</span>';
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
  currentReportType = type;
  const titleEl = document.getElementById("previewSheetTitle");
  const contentEl = document.getElementById("previewSheetContent");
  const cur = CurrencyEngine.currentCurrency;

  if (type === "pnl") {
    titleEl.textContent = `Comprehensive Profit & Loss Statement (Q3 FY26 — ${cur})`;
    contentEl.innerHTML = `
------------------------------------------------------------------------------------------------
AI CHARTERED ACCOUNTANT AUTOMATION SYSTEM — AUDITED STATEMENT (${cur})
Statement of Profit and Loss for Period Ending August 31, 2026
------------------------------------------------------------------------------------------------

1. GROSS REVENUE FROM OPERATIONS:
   - Enterprise Cloud & SaaS Recurring Invoicing:             ${CurrencyEngine.format(580000, 2)}
   - Professional Technology Advisory Services:              ${CurrencyEngine.format(262950, 2)}
   ------------------------------------------------------------------------
   TOTAL REVENUE (A):                                        ${CurrencyEngine.format(842950, 2)}

2. OPERATING EXPENSES (LLM CATEGORIZED):
   - Direct Cloud Infrastructure & Data Centers:             ${CurrencyEngine.format(98420, 2)}
   - Operational Subscriptions & Tooling:                     ${CurrencyEngine.format(45000, 2)}
   - Facilities, Leases & Office Infrastructure:              ${CurrencyEngine.format(38500, 2)}
   - Statutory Audit, Legal & Compliance Retainers:          ${CurrencyEngine.format(34200, 2)}
   - General & Administrative Overheads:                     ${CurrencyEngine.format(102300, 2)}
   ------------------------------------------------------------------------
   TOTAL OPERATING OVERHEADS (B):                            ${CurrencyEngine.format(318420, 2)}

3. OPERATING PROFIT / EBITDA (A - B):                        ${CurrencyEngine.format(524530, 2)}  (62.2% Net Margin)
   - Provision for Accrued Net GST Obligations:             -${CurrencyEngine.format(68340, 2)}
   ------------------------------------------------------------------------
   NET RETAINED SURPLUS:                                     ${CurrencyEngine.format(456190, 2)}

Audit Certification: 100% Reconciled against Banking Feeds and Verified Counterparty Tax IDs in ${cur}.
    `;
  } else if (type === "balancesheet") {
    titleEl.textContent = `Certified Balance Sheet Statement of Financial Position (${cur})`;
    contentEl.innerHTML = `
------------------------------------------------------------------------------------------------
STATEMENT OF FINANCIAL POSITION (BALANCE SHEET) — DOUBLE-ENTRY VERIFIED (${cur})
------------------------------------------------------------------------------------------------
ASSETS:
  Current Assets:
    - Cash & Liquid Operational Bank Balances:               ${CurrencyEngine.format(682400, 2)}
    - Trade Accounts Receivable (Automated Invoicing):       ${CurrencyEngine.format(398400, 2)}
    - Input Tax Credit (ITC) Available in Electronic Ledger: ${CurrencyEngine.format(160000, 2)}
  Non-Current Assets:
    - Office Hardware, Servers & Network Equipment:          ${CurrencyEngine.format(85000, 2)}
  ------------------------------------------------------------------------
  TOTAL ASSETS:                                              ${CurrencyEngine.format(1325800, 2)}

LIABILITIES & SHAREHOLDERS' EQUITY:
  Current Liabilities:
    - Accounts Payable (OCR Extracted & Approved):           ${CurrencyEngine.format(214300, 2)}
    - Net Statutory GST / Tax Obligations:                   ${CurrencyEngine.format(68340, 2)}
    - Short-term Accrued Employee Liabilities:               ${CurrencyEngine.format(187560, 2)}
  Total Liabilities:                                         ${CurrencyEngine.format(470200, 2)}

  Shareholders' Net Worth:
    - Capital Reserves:                                      ${CurrencyEngine.format(331070, 2)}
    - Cumulative Retained Earnings:                          ${CurrencyEngine.format(524530, 2)}
  ------------------------------------------------------------------------
  TOTAL LIABILITIES & EQUITY:                                ${CurrencyEngine.format(1325800, 2)} (Balanced Trial)
    `;
  } else if (type === "gst") {
    titleEl.textContent = `GST & Tax Compliance Audit Workbook (GSTR-1 / 3B / 2B — ${cur})`;
    contentEl.innerHTML = `
------------------------------------------------------------------------------------------------
GOODS & SERVICES TAX COMPLIANCE & INPUT TAX CREDIT RECONCILIATION (${cur})
------------------------------------------------------------------------------------------------
Tax Period: August 2026 | Filing Status: Ready for CA Electronic Stamp

OUTPUT LIABILITY BREAKDOWN:
  - CGST (Central Goods & Service Tax 9%):                   ${CurrencyEngine.format(34170, 2)}
  - SGST (State Goods & Service Tax 9%):                     ${CurrencyEngine.format(34170, 2)}
  - IGST (Inter-State Integrated Tax 18%):                   ${CurrencyEngine.format(24190, 2)}
  Total Gross Tax Payable:                                   ${CurrencyEngine.format(92530, 2)}

ELIGIBLE INPUT TAX CREDIT (ITC DEDUCTION):
  - Invoices Reconciled on GSTR-2B:                         -${CurrencyEngine.format(24190, 2)}
  - Ineligible ITC Isolated (Sec 17(5)):                     ${CurrencyEngine.format(0, 2)} (Segregated)
  ------------------------------------------------------------------------
  NET CASH PAYABLE TO GOVERNMENT:                            ${CurrencyEngine.format(68340, 2)}

Compliance Verification Status: Zero discrepancies identified. Ready for one-click submission.
    `;
  } else if (type === "reconciliation") {
    titleEl.textContent = `Automated Bank Reconciliation Cross-Verification Log (${cur})`;
    contentEl.innerHTML = `
------------------------------------------------------------------------------------------------
BANK RECONCILIATION CROSS-VERIFICATION AUDIT LOG (${cur})
------------------------------------------------------------------------------------------------
API Endpoint: Fast-Banking Webhook Gateway (Secure ISO20022 Standard)
Reconciliation Rate: 100% Matched | Variance: ${CurrencyEngine.format(0, 2)}

Sample Matched Transactions:
  [MATCHED] Ref: TX-2026-8801 | Bank Date: 2026-08-30 | Amount: +${CurrencyEngine.format(125000, 2)} | Wire From: Apex Corp
  [MATCHED] Ref: TX-2026-8802 | Bank Date: 2026-08-29 | Amount: -${CurrencyEngine.format(12450, 2)}   | Debit: AWS EMEA
  [MATCHED] Ref: TX-2026-8803 | Bank Date: 2026-08-27 | Amount: +${CurrencyEngine.format(84500, 2)}  | Wire: Global Retainer
  [MATCHED] Ref: TX-2026-8804 | Bank Date: 2026-08-25 | Amount: -${CurrencyEngine.format(8500, 2)}    | Debit: WeWork Global
  [MATCHED] Ref: TX-2026-8807 | Bank Date: 2026-08-15 | Amount: +${CurrencyEngine.format(95400, 2)}  | Settlement: Stripe Online

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
      const code = CurrencyEngine.currentCurrency;
      const sym = CurrencyEngine.getSymbol().trim();

      if (lower.includes("inr") || lower.includes("rupee") || lower.includes("dollar") || lower.includes("currency") || lower.includes("forex")) {
        if (lower.includes("inr") || lower.includes("rupee")) {
          CurrencyEngine.setCurrency("INR");
        } else if (lower.includes("dollar") || lower.includes("usd")) {
          CurrencyEngine.setCurrency("USD");
        } else if (lower.includes("euro") || lower.includes("eur")) {
          CurrencyEngine.setCurrency("EUR");
        } else if (lower.includes("pound") || lower.includes("gbp")) {
          CurrencyEngine.setCurrency("GBP");
        }
        reply = `Active reporting currency is now set to ${CurrencyEngine.currentCurrency} (${CurrencyEngine.getSymbol().trim()}). All financial statements, general ledger postings, GST liabilities, and real-time analytical metrics have been recalculated at the official exchange rate of 1 USD = ${CurrencyEngine.getRate()} ${CurrencyEngine.currentCurrency}.`;
      } else if (lower.includes("margin") || lower.includes("profit") || lower.includes("projected")) {
        reply = `Based on our current Q3 data (${code}): Realized gross revenue is ${CurrencyEngine.format(842950, 2)} against operating overheads of ${CurrencyEngine.format(318420, 2)}, yielding an EBITDA operating surplus of ${CurrencyEngine.format(524530, 2)} (a healthy 62.2% net operating margin). Projected Q4 revenue indicates a strong +14.2% annualized continuation.`;
      } else if (lower.includes("bank") || lower.includes("reconcil")) {
        reply = `Automated Bank Reconciliation Engine reports 100% matched transactions across all active treasury accounts in ${code}. There are exactly 0 unresolved ledger variances (${CurrencyEngine.format(0, 2)}) across 8 corporate bank feeds as of today.`;
      } else if (lower.includes("tax") || lower.includes("gst") || lower.includes("itc")) {
        reply = `Your current Gross GST liability in ${code} is ${CurrencyEngine.format(92530, 2)}. With automated OCR invoice parsing and GSTR-2B reconciliation, you have ${CurrencyEngine.format(24190, 2)} in verified Input Tax Credits (ITC), bringing the net payable obligation down to ${CurrencyEngine.format(68340, 2)}.`;
      } else if (lower.includes("document") || lower.includes("authority") || lower.includes("license") || lower.includes("cin") || lower.includes("pan") || lower.includes("gstin")) {
        reply = `All 12 mandatory statutory corporate documents (including Certificate of Incorporation, PAN, TAN, GST REG-06, and MSME/Udyam) are securely cataloged in the Authority & Documentation Vault. Current regulatory compliance health score is 98.4% with CA verification stamped.`;
      } else {
        reply = `I have analyzed the General Ledger and financial models for "${query}". Total ledger volume is ${CurrencyEngine.format(1161370, 2)} across verified entries. All statutory parameters comply with ICAI / MCA / CBDT and Ind AS / IFRS frameworks in ${code} (${sym}) with 99.7% model confidence.`;
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

/* ================= 10. AUTHORITY & STATUTORY DOCUMENTATION SYSTEM ================= */
const defaultAuthorityDocs = [
  {
    key: "coi",
    category: "corporate",
    badge: "MCA",
    name: "Certificate of Incorporation (CIN)",
    authority: "Ministry of Corporate Affairs (MCA), Govt. of India",
    docId: "U72900MH2024PTC123456",
    status: "active",
    issueDate: "2024-02-14",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-10",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Mandatory statutory corporate birth certificate and legal operational existence proof under Companies Act, 2013.",
    notes: "Verified against MCA Master Data API with active status and zero pending show-cause notices."
  },
  {
    key: "moa_aoa",
    category: "corporate",
    badge: "MCA / ROC",
    name: "Memorandum & Articles of Association (MOA & AOA)",
    authority: "Registrar of Companies (RoC - Mumbai)",
    docId: "ROC-MUM-MOA-88219",
    status: "active",
    issueDate: "2024-02-14",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-10",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Constitutional corporate charter establishing commercial objects, share capital boundaries, and statutory bylaws.",
    notes: "Stamped physical and digital charter verified. Authorized equity share capital: ₹50,00,000."
  },
  {
    key: "pan",
    category: "tax",
    badge: "CBDT / ITD",
    name: "Company Permanent Account Number (PAN Card)",
    authority: "Income Tax Department / Central Board of Direct Taxes",
    docId: "AAACR1234F",
    status: "active",
    issueDate: "2024-02-20",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-12",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Mandatory corporate tax identity required for all direct tax assessments, bank accounts, and statutory returns.",
    notes: "Cross-verified with NSDL / ITD e-Filing database. KYC: Active & Operational."
  },
  {
    key: "tan",
    category: "tax",
    badge: "CBDT / TRACES",
    name: "Tax Deduction and Collection Account Number (TAN)",
    authority: "Income Tax Department / NSDL",
    docId: "MUMA12345E",
    status: "active",
    issueDate: "2024-03-01",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-12",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Statutory mandatory account for withholding tax (TDS / TCS) remittances and quarterly Form 24Q / 26Q returns.",
    notes: "TRACES portal verified. All quarterly withholding challans reconciled against General Ledger."
  },
  {
    key: "gstin",
    category: "tax",
    badge: "CBIC / GSTN",
    name: "GST Registration Certificate (Form GST REG-06)",
    authority: "Central Board of Indirect Taxes and Customs (CBIC)",
    docId: "27AAACA1234F1Z8",
    status: "active",
    issueDate: "2024-03-10",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-25",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Principal indirect tax statutory license for intra-state and inter-state supply of technology services and products.",
    notes: "Active status on GSTN API. Zero ITC mismatches reported in current financial quarter."
  },
  {
    key: "udyam",
    category: "trade",
    badge: "MINISTRY OF MSME",
    name: "MSME / Udyam Registration Certificate",
    authority: "Ministry of Micro, Small & Medium Enterprises",
    docId: "UDYAM-MH-01-0098765",
    status: "active",
    issueDate: "2024-04-05",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-15",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Statutory enterprise status ensuring 45-day payment protections under Section 43B(h) and MSMED Act, 2006.",
    notes: "Classified as Medium Tech Enterprise under audited investment and turnover criteria."
  },
  {
    key: "shop_act",
    category: "labor",
    badge: "MUNICIPAL / LABOUR",
    name: "Shop & Commercial Establishment Act License",
    authority: "Municipal Corporation / State Labour Department",
    docId: "MCGM/SHOP/2024/77102",
    status: "expiring",
    issueDate: "2024-05-10",
    expiryDate: "2026-10-31",
    isPerpetual: false,
    verifyDate: "2026-08-01",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Mandatory municipal license governing corporate commercial offices, employee working conditions, and safety.",
    notes: "Renewal application drafted. Statutory renewal fee queued for execution prior to 31 Oct 2026."
  },
  {
    key: "pt",
    category: "tax",
    badge: "STATE COMMERCIAL TAX",
    name: "Professional Tax Registration (PTRC & PTEC)",
    authority: "State Commercial Tax Department (Maharashtra)",
    docId: "PTRC-27001928374-E",
    status: "active",
    issueDate: "2024-03-15",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-18",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Statutory enrollment and deduction license for corporate entity tax and monthly employee payroll PT deductions.",
    notes: "Monthly Form III-B electronic return synchronized with general ledger payroll debits."
  },
  {
    key: "iec",
    category: "trade",
    badge: "DGFT / COMMERCE",
    name: "Import Export Code (IEC Authorization)",
    authority: "Directorate General of Foreign Trade (DGFT), Ministry of Commerce",
    docId: "0324991823",
    status: "active",
    issueDate: "2024-06-01",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-20",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Mandatory 10-digit authorization for overseas commercial transactions, cross-border SaaS billings, and forex receipts.",
    notes: "Annual DGFT e-Verification confirmed. Inward wire remittances matching FIRC documentation."
  },
  {
    key: "epfo",
    category: "labor",
    badge: "EPFO / LABOUR",
    name: "EPFO Establishment Code (Provident Fund)",
    authority: "Employees' Provident Fund Organisation (Ministry of Labour)",
    docId: "MH/BAN/0048192/000",
    status: "active",
    issueDate: "2024-04-12",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-22",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Mandatory corporate social security coverage under EPF & MP Act, 1952 for employee retirement welfare.",
    notes: "Unified Shram Suvidha API synchronized. Monthly electronic challan returns (ECR) paid on schedule."
  },
  {
    key: "esic",
    category: "labor",
    badge: "ESIC / LABOUR",
    name: "ESIC Registration Code (State Insurance)",
    authority: "Employees' State Insurance Corporation",
    docId: "31000981720000999",
    status: "active",
    issueDate: "2024-04-15",
    expiryDate: "Perpetual",
    isPerpetual: true,
    verifyDate: "2026-08-22",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Statutory health and disability insurance coverage for workforce under the Employees' State Insurance Act, 1948.",
    notes: "Bi-annual statutory audit completed with full contribution ledger reconciliation."
  },
  {
    key: "trademark",
    category: "trade",
    badge: "CGPDTM / IP INDIA",
    name: "Registered Trademark Certificate (Class 9 & 42)",
    authority: "Controller General of Patents, Designs and Trade Marks",
    docId: "TM-IN-5918204",
    status: "pending",
    issueDate: "2024-07-20",
    expiryDate: "2034-07-19",
    isPerpetual: false,
    verifyDate: "2026-08-05",
    verifier: "CA. Ashish Vaiswani (FCA)",
    purpose: "Statutory brand and intellectual property asset protection under the Trade Marks Act, 1999.",
    notes: "Opposition window successfully cleared. Final certificate issuance stamp underway."
  }
];

let authorityDocuments = [];

function loadAuthorityDocs() {
  const stored = localStorage.getItem("ai_ca_authority_docs");
  if (stored) {
    try {
      authorityDocuments = JSON.parse(stored);
      return;
    } catch (e) {
      console.warn("Failed to parse stored authority docs, fallback to default", e);
    }
  }
  authorityDocuments = [...defaultAuthorityDocs];
}

function saveAuthorityDocs() {
  localStorage.setItem("ai_ca_authority_docs", JSON.stringify(authorityDocuments));
}

function renderAuthorityCards(filter = "all", search = "") {
  const container = document.getElementById("authDocGrid");
  if (!container) return;

  const q = search.trim().toLowerCase();
  const filtered = authorityDocuments.filter(doc => {
    const matchesFilter = filter === "all" || doc.category === filter;
    const matchesSearch = !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.authority.toLowerCase().includes(q) ||
      doc.docId.toLowerCase().includes(q) ||
      doc.purpose.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  updateAuthorityStats();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📁</div>
        <h3>No Statutory Records Found</h3>
        <p style="font-size: 0.85rem; margin-top: 0.3rem;">No documents match your current filter or search criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(doc => {
    let statusClass = "active";
    let statusText = "✓ Verified & Active";
    if (doc.status === "pending") {
      statusClass = "pending";
      statusText = "⏳ Pending Verification";
    } else if (doc.status === "expiring") {
      statusClass = "expiring";
      statusText = "⚠️ Renewal Due Soon";
    }

    const validityDisplay = doc.isPerpetual ? "Perpetual (No Expiry Required)" : (doc.expiryDate || "Not Set");

    return `
      <div class="auth-doc-card" data-key="${doc.key}" onclick="openVerificationModal('${doc.key}')">
        <div>
          <div class="auth-doc-top">
            <span class="auth-badge-tag">${doc.badge || "LEGAL"}</span>
            <span class="auth-status-tag ${statusClass}">${statusText}</span>
          </div>
          <div class="auth-doc-name">${doc.name}</div>
          <div class="auth-doc-purpose">${doc.purpose}</div>

          <div class="auth-meta-list">
            <div class="auth-meta-row">
              <span class="auth-meta-label">Document / License ID:</span>
              <span class="auth-meta-value mono">${doc.docId}</span>
            </div>
            <div class="auth-meta-row">
              <span class="auth-meta-label">Issuing Authority:</span>
              <span class="auth-meta-value" style="font-size:0.78rem;">${doc.authority}</span>
            </div>
            <div class="auth-meta-row">
              <span class="auth-meta-label">Issuance Date:</span>
              <span class="auth-meta-value">${doc.issueDate || "—"}</span>
            </div>
            <div class="auth-meta-row">
              <span class="auth-meta-label">Validity / Expiry:</span>
              <span class="auth-meta-value" style="${doc.isPerpetual ? 'color: #38bdf8;' : ''}">${validityDisplay}</span>
            </div>
            <div class="auth-meta-row">
              <span class="auth-meta-label">Verification Date:</span>
              <span class="auth-meta-value" style="color: #34d399;">${doc.verifyDate || "—"}</span>
            </div>
            <div class="auth-meta-row">
              <span class="auth-meta-label">Verified By:</span>
              <span class="auth-meta-value" style="font-size:0.78rem;">${doc.verifier || "CA Practitioner"}</span>
            </div>
          </div>
        </div>

        <div class="auth-doc-footer-actions">
          <button class="btn-auth-verify" onclick="event.stopPropagation(); openVerificationModal('${doc.key}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>Verify & Edit Details</span>
          </button>
          <button class="btn-auth-view" title="View / Inspect Statutory Certificate" onclick="event.stopPropagation(); viewDocCertificate('${doc.name}', '${doc.docId}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function updateAuthorityStats() {
  const total = authorityDocuments.length;
  const verified = authorityDocuments.filter(d => d.status === "active").length;
  const pending = authorityDocuments.filter(d => d.status !== "active").length;
  const score = total > 0 ? ((verified / total) * 100).toFixed(1) + "%" : "100%";

  const totEl = document.getElementById("authTotalDocs");
  const verEl = document.getElementById("authVerifiedDocs");
  const penEl = document.getElementById("authPendingDocs");
  const scoEl = document.getElementById("authComplianceScore");

  if (totEl) totEl.textContent = total;
  if (verEl) verEl.textContent = verified;
  if (penEl) penEl.textContent = pending;
  if (scoEl) scoEl.textContent = score;
}

function viewDocCertificate(name, id) {
  showToast(`Statutory certificate for ${name} (${id}) verified in secure vault.`);
}

function openVerificationModal(docKey) {
  const modal = document.getElementById("docVerificationModal");
  if (!modal) return;

  const doc = authorityDocuments.find(d => d.key === docKey);
  const isNew = !doc;

  document.getElementById("mvDocKey").value = isNew ? "" : doc.key;
  document.getElementById("mvDocName").value = isNew ? "" : doc.name;
  document.getElementById("mvAuthority").value = isNew ? "" : doc.authority;
  document.getElementById("mvDocId").value = isNew ? "" : doc.docId;
  document.getElementById("mvStatus").value = isNew ? "active" : doc.status;
  document.getElementById("mvIssueDate").value = isNew ? new Date().toISOString().slice(0, 10) : (doc.issueDate || "");

  const perpetualCb = document.getElementById("mvPerpetualCheck");
  const expiryInput = document.getElementById("mvExpiryDate");
  const isPerp = isNew ? false : !!doc.isPerpetual;
  perpetualCb.checked = isPerp;
  expiryInput.disabled = isPerp;
  expiryInput.value = isPerp ? "" : (doc.expiryDate || "");

  const todayStr = new Date().toISOString().slice(0, 10);
  document.getElementById("mvVerifyDate").value = (!isNew && doc.verifyDate) ? doc.verifyDate : todayStr;
  document.getElementById("mvVerifier").value = (!isNew && doc.verifier) ? doc.verifier : "CA. Ashish Vaiswani (FCA)";
  document.getElementById("mvNotes").value = (!isNew && doc.notes) ? doc.notes : "";

  document.getElementById("mvModalTitle").textContent = isNew ? "Add New Statutory Corporate Document" : `Verify & Update: ${doc.name}`;
  document.getElementById("mvModalSubtitle").textContent = isNew ? "Register mandatory company license or regulatory permit" : `Issuing Authority: ${doc.authority}`;

  modal.classList.add("open");
}

function closeVerificationModal() {
  const modal = document.getElementById("docVerificationModal");
  if (modal) modal.classList.remove("open");
}

function setupAuthoritySection() {
  loadAuthorityDocs();
  renderAuthorityCards("all", "");

  // Filter tabs
  const filterTabs = document.querySelectorAll(".auth-filter-btn");
  let currentFilter = "all";
  let currentSearch = "";

  filterTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      filterTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter") || "all";
      renderAuthorityCards(currentFilter, currentSearch);
    });
  });

  // Search input
  const searchInput = document.getElementById("authSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      currentSearch = e.target.value;
      renderAuthorityCards(currentFilter, currentSearch);
    });
  }

  // Add new doc button
  const addBtn = document.getElementById("addNewDocBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => openVerificationModal(null));
  }

  // Close modal buttons
  const closeBtn = document.getElementById("closeVerificationModalBtn");
  const cancelBtn = document.getElementById("cancelVerificationBtn");
  const modal = document.getElementById("docVerificationModal");

  if (closeBtn) closeBtn.addEventListener("click", closeVerificationModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeVerificationModal);
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeVerificationModal();
    });
  }

  // Perpetual checkbox toggle
  const perpetualCb = document.getElementById("mvPerpetualCheck");
  const expiryInput = document.getElementById("mvExpiryDate");
  if (perpetualCb && expiryInput) {
    perpetualCb.addEventListener("change", () => {
      expiryInput.disabled = perpetualCb.checked;
      if (perpetualCb.checked) expiryInput.value = "";
    });
  }

  // Modal form submission
  const form = document.getElementById("docVerificationForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const docKey = document.getElementById("mvDocKey").value.trim();
      const docName = document.getElementById("mvDocName").value.trim();
      const authority = document.getElementById("mvAuthority").value.trim();
      const docId = document.getElementById("mvDocId").value.trim();
      const status = document.getElementById("mvStatus").value;
      const issueDate = document.getElementById("mvIssueDate").value;
      const isPerpetual = document.getElementById("mvPerpetualCheck").checked;
      const expiryDate = isPerpetual ? "Perpetual" : document.getElementById("mvExpiryDate").value;
      const verifyDate = document.getElementById("mvVerifyDate").value;
      const verifier = document.getElementById("mvVerifier").value.trim();
      const notes = document.getElementById("mvNotes").value.trim();

      if (docKey) {
        // Update existing
        const existing = authorityDocuments.find(d => d.key === docKey);
        if (existing) {
          existing.name = docName;
          existing.authority = authority;
          existing.docId = docId;
          existing.status = status;
          existing.issueDate = issueDate;
          existing.isPerpetual = isPerpetual;
          existing.expiryDate = expiryDate;
          existing.verifyDate = verifyDate;
          existing.verifier = verifier;
          existing.notes = notes;
        }
      } else {
        // Create new
        const newKey = "doc_" + Date.now();
        authorityDocuments.unshift({
          key: newKey,
          category: "corporate",
          badge: "STATUTORY",
          name: docName,
          authority: authority,
          docId: docId,
          status: status,
          issueDate: issueDate,
          isPerpetual: isPerpetual,
          expiryDate: expiryDate,
          verifyDate: verifyDate,
          verifier: verifier,
          purpose: "Statutory mandatory corporate authority documentation record.",
          notes: notes
        });
      }

      saveAuthorityDocs();
      renderAuthorityCards(currentFilter, currentSearch);
      closeVerificationModal();
      showToast(`Statutory record for "${docName}" verified & updated successfully!`);
    });
  }
}

