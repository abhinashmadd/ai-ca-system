// Comprehensive Indian Chartered Accountant Mock Datasets

export const INITIAL_CLIENTS = [
  {
    id: "CLT-101",
    name: "Apex Global Technologies Pvt Ltd",
    pan: "AAACA1234F",
    gstin: "07AAACA1234F1Z5",
    type: "Private Limited",
    email: "finance@apextech.in",
    phone: "+91 98112 34567",
    turnover: "₹18.5 Cr",
    auditStatus: "Completed",
    complianceScore: 98,
    pendingReturns: 0,
    address: "Cyber City, Gurugram, Haryana"
  },
  {
    id: "CLT-102",
    name: "Sharma & Brothers Logistics LLP",
    pan: "AALFS9876K",
    gstin: "09AALFS9876K1Z2",
    type: "LLP",
    email: "accounts@sharmalogistics.com",
    phone: "+91 99201 88472",
    turnover: "₹8.2 Cr",
    auditStatus: "In Progress",
    complianceScore: 84,
    pendingReturns: 1,
    address: "Sector 62, Noida, Uttar Pradesh"
  },
  {
    id: "CLT-103",
    name: "Zenith Cloud Solutions Inc",
    pan: "AAZCS4412M",
    gstin: "27AAZCS4412M1ZE",
    type: "Private Limited",
    email: "tax@zenithcloud.io",
    phone: "+91 97341 55621",
    turnover: "₹34.0 Cr",
    auditStatus: "Completed",
    complianceScore: 95,
    pendingReturns: 0,
    address: "Bandra Kurla Complex, Mumbai"
  },
  {
    id: "CLT-104",
    name: "Kaveri Organic Agro Exports",
    pan: "ABCPK7761P",
    gstin: "33ABCPK7761P1Z9",
    type: "Partnership",
    email: "info@kaveriagro.org",
    phone: "+91 94432 10982",
    turnover: "₹4.6 Cr",
    auditStatus: "Review Needed",
    complianceScore: 72,
    pendingReturns: 2,
    address: "Coimbatore, Tamil Nadu"
  },
  {
    id: "CLT-105",
    name: "Vanguard Fintech Infra Ltd",
    pan: "AABCV3382R",
    gstin: "29AABCV3382R1ZR",
    type: "Public Limited",
    email: "cfo@vanguardinfra.com",
    phone: "+91 98801 44520",
    turnover: "₹120.0 Cr",
    auditStatus: "Completed",
    complianceScore: 100,
    pendingReturns: 0,
    address: "Whitefield, Bengaluru, Karnataka"
  }
];

export const INITIAL_INVOICES = [
  {
    id: "INV-2026-089",
    client: "Apex Global Technologies Pvt Ltd",
    date: "2026-09-08",
    dueDate: "2026-09-22",
    subtotal: 180000,
    gstRate: 18,
    gstAmount: 32400,
    total: 212400,
    status: "Paid",
    items: [
      { desc: "Statutory Audit & Tax Representation (Q2)", qty: 1, rate: 120000 },
      { desc: "Transfer Pricing Documentation & Advisory", qty: 1, rate: 60000 }
    ]
  },
  {
    id: "INV-2026-090",
    client: "Sharma & Brothers Logistics LLP",
    date: "2026-09-10",
    dueDate: "2026-09-24",
    subtotal: 75000,
    gstRate: 18,
    gstAmount: 13500,
    total: 88500,
    status: "Pending",
    items: [
      { desc: "Monthly GST Reconciliation & Filing (GSTR-1 & 3B)", qty: 1, rate: 45000 },
      { desc: "TDS Quarterly Filing (26Q/24Q)", qty: 1, rate: 30000 }
    ]
  },
  {
    id: "INV-2026-091",
    client: "Zenith Cloud Solutions Inc",
    date: "2026-09-11",
    dueDate: "2026-09-25",
    subtotal: 250000,
    gstRate: 18,
    gstAmount: 45000,
    total: 295000,
    status: "Paid",
    items: [
      { desc: "Internal Financial Controls (IFC) Audit", qty: 1, rate: 200000 },
      { desc: "Corporate Tax Return Review (ITR-6)", qty: 1, rate: 50000 }
    ]
  },
  {
    id: "INV-2026-092",
    client: "Kaveri Organic Agro Exports",
    date: "2026-09-12",
    dueDate: "2026-09-26",
    subtotal: 42000,
    gstRate: 18,
    gstAmount: 7560,
    total: 49560,
    status: "Overdue",
    items: [
      { desc: "Export Invoicing Compliance & RoDTEP Review", qty: 1, rate: 42000 }
    ]
  }
];

export const GST_FILING_RECORDS = [
  {
    period: "August 2026",
    form: "GSTR-1",
    arn: "AA070826019845X",
    taxLiability: "₹14,28,900",
    itcClaimed: "₹9,80,450",
    netPayable: "₹4,48,450",
    status: "Filed",
    filedOn: "10-Sep-2026"
  },
  {
    period: "August 2026",
    form: "GSTR-3B",
    arn: "AA070826024419Y",
    taxLiability: "₹14,28,900",
    itcClaimed: "₹9,80,450",
    netPayable: "₹4,48,450",
    status: "Ready to File",
    filedOn: "Due 20-Sep-2026"
  },
  {
    period: "Q1 FY 26-27",
    form: "CMP-08",
    arn: "CMP2601004921",
    taxLiability: "₹65,000",
    itcClaimed: "N/A",
    netPayable: "₹65,000",
    status: "Filed",
    filedOn: "18-Jul-2026"
  },
  {
    period: "FY 2025-26",
    form: "GSTR-9 (Annual)",
    arn: "Pending Draft",
    taxLiability: "₹1.84 Cr",
    itcClaimed: "₹1.22 Cr",
    netPayable: "₹62.0 L",
    status: "In Audit Review",
    filedOn: "Due 31-Dec-2026"
  }
];

export const COMPLIANCE_DEADLINES = [
  {
    title: "GSTR-3B Monthly Return Filing",
    category: "GST",
    dueDate: "20 Sep 2026",
    daysLeft: 8,
    critical: true,
    desc: "Monthly summary return for turnover above ₹5 Cr."
  },
  {
    title: "Second Advance Tax Installment (45%)",
    category: "Income Tax",
    dueDate: "15 Sep 2026",
    daysLeft: 3,
    critical: true,
    desc: "Mandatory corporate and individual advance tax liability."
  },
  {
    title: "TDS Deposit for August 2026 (Challan 281)",
    category: "TDS",
    dueDate: "07 Oct 2026",
    daysLeft: 25,
    critical: false,
    desc: "Tax deducted at source under Sec 194C, 194J, 194I."
  },
  {
    title: "Tax Audit Report (Form 3CA/3CB-3CD)",
    category: "Audit",
    dueDate: "30 Sep 2026",
    daysLeft: 18,
    critical: true,
    desc: "Audit reports for businesses with turnover > ₹10 Cr."
  }
];

export const PAYROLL_EMPLOYEES = [
  {
    id: "EMP-01",
    name: "Abhinash Maddheshiya",
    role: "Senior Financial Analyst & Lead Auditor",
    department: "Corporate Taxation",
    pan: "BXCPM4918Q",
    basic: 95000,
    hra: 38000,
    allowances: 22000,
    pf: 11400,
    tds: 18500,
    netPay: 125100,
    attendance: "96%",
    status: "Active"
  },
  {
    id: "EMP-02",
    name: "Priya Sundaram",
    role: "GST Compliance Specialist",
    department: "Indirect Tax",
    pan: "ALBPS3391K",
    basic: 72000,
    hra: 28800,
    allowances: 16000,
    pf: 8640,
    tds: 11200,
    netPay: 96960,
    attendance: "98%",
    status: "Active"
  },
  {
    id: "EMP-03",
    name: "Rohan Varma",
    role: "Junior Audit Associate",
    department: "Statutory Audit",
    pan: "CQPRV9012F",
    basic: 45000,
    hra: 18000,
    allowances: 10000,
    pf: 5400,
    tds: 4800,
    netPay: 62800,
    attendance: "94%",
    status: "Active"
  },
  {
    id: "EMP-04",
    name: "Ananya Deshmukh",
    role: "TDS & Payroll Executive",
    department: "Payroll Operations",
    pan: "DDKAD5521L",
    basic: 52000,
    hra: 20800,
    allowances: 12000,
    pf: 6240,
    tds: 6400,
    netPay: 72160,
    attendance: "100%",
    status: "Active"
  }
];

export const TDS_SECTIONS = [
  { section: "194C", name: "Contractor Payments (Individual/HUF)", rate: "1.0%", threshold: "₹30,000 / ₹1,00,000" },
  { section: "194C", name: "Contractor Payments (Others / Company)", rate: "2.0%", threshold: "₹30,000 / ₹1,00,000" },
  { section: "194J", name: "Professional & Technical Fees", rate: "10.0% / 2.0%", threshold: "₹30,000" },
  { section: "194I", name: "Rent of Land / Building / Furniture", rate: "10.0%", threshold: "₹2,40,000 / year" },
  { section: "194Q", name: "Purchase of Goods (> ₹50L turnover)", rate: "0.1%", threshold: "₹50,00,000" },
  { section: "194A", name: "Interest other than on Securities", rate: "10.0%", threshold: "₹40,000 / ₹50,000" }
];

export const REVENUE_MONTHLY_CHART = [
  { month: "Apr", revenue: 840000, expense: 310000, profit: 530000 },
  { month: "May", revenue: 920000, expense: 330000, profit: 590000 },
  { month: "Jun", revenue: 1150000, expense: 380000, profit: 770000 },
  { month: "Jul", revenue: 1380000, expense: 420000, profit: 960000 },
  { month: "Aug", revenue: 1640000, expense: 480000, profit: 1160000 },
  { month: "Sep", revenue: 1920000, expense: 510000, profit: 1410000 }
];
