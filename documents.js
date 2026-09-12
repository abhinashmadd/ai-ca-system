/**
 * AI Chartered Accountant Platform - Document Expiry & Auto Renewal Module
 * Frontend Orchestration Script (documents.js)
 */

(function () {
  'use strict';

  // Backend API Base URL
  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? (window.location.port === '8000' ? '' : 'http://127.0.0.1:8000')
    : '';

  // State
  let allDocuments = [];
  let currentFilteredDocuments = [];
  let activeKpiFilter = 'all';
  let isMissingOnlyFilter = false;
  let activeOcrUploadedDoc = null;

  // DOM Elements
  const kpiTotal = document.getElementById('statTotalDocs');
  const kpiActive = document.getElementById('statActiveDocs');
  const kpi90d = document.getElementById('statExpiring90');
  const kpi30d = document.getElementById('statExpiring30');
  const kpi7d = document.getElementById('statExpiring7');
  const kpiExpired = document.getElementById('statExpired');
  const countMissingBadge = document.getElementById('countMissingBadge');
  const schedulerStatusPill = document.getElementById('schedulerStatusPill');
  const schedulerStatusText = document.getElementById('schedulerStatusText');
  const btnRunScheduler = document.getElementById('btnRunScheduler');

  const fileDropzone = document.getElementById('fileDropzone');
  const fileInput = document.getElementById('fileInput');
  const scanBeam = document.getElementById('scanBeam');
  const uploadStatusBox = document.getElementById('uploadStatusBox');
  const uploadStatusTitle = document.getElementById('uploadStatusTitle');
  const uploadStatusPct = document.getElementById('uploadStatusPct');
  const ocrPreviewCard = document.getElementById('ocrPreviewCard');
  const ocrConfidenceBadge = document.getElementById('ocrConfidenceBadge');
  const previewDocName = document.getElementById('previewDocName');
  const previewDocType = document.getElementById('previewDocType');
  const previewDocNum = document.getElementById('previewDocNum');
  const previewExpiryDate = document.getElementById('previewExpiryDate');
  const previewAuthority = document.getElementById('previewAuthority');
  const btnPreviewVerify = document.getElementById('btnPreviewVerify');
  const btnPreviewDismiss = document.getElementById('btnPreviewDismiss');
  const btnQuickUploadTrigger = document.getElementById('btnQuickUploadTrigger');

  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterType');
  const filterStatus = document.getElementById('filterStatus');
  const filterMonth = document.getElementById('filterMonth');
  const btnFilterMissing = document.getElementById('btnFilterMissing');
  const btnResetFilters = document.getElementById('btnResetFilters');
  const documentsTableBody = document.getElementById('documentsTableBody');
  const displayCountText = document.getElementById('displayCountText');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const toastContainer = document.getElementById('toastContainer');

  // Modals
  const modalVerification = document.getElementById('modalVerification');
  const formVerification = document.getElementById('formVerification');
  const modalRenewal = document.getElementById('modalRenewal');
  const modalReminder = document.getElementById('modalReminder');
  const modalNotifLogs = document.getElementById('modalNotifLogs');
  const btnViewNotifLogs = document.getElementById('btnViewNotifLogs');

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadDashboardMetrics();
    loadDocuments();
  });

  // Event Listeners
  function initEventListeners() {
    // Dropzone Events
    if (fileDropzone && fileInput) {
      fileDropzone.addEventListener('click', () => fileInput.click());

      fileDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropzone.classList.add('drag-over');
      });

      fileDropzone.addEventListener('dragleave', () => {
        fileDropzone.classList.remove('drag-over');
      });

      fileDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropzone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileUpload(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          handleFileUpload(e.target.files[0]);
        }
      });
    }

    if (btnQuickUploadTrigger && fileInput) {
      btnQuickUploadTrigger.addEventListener('click', () => fileInput.click());
    }

    // Preview buttons
    if (btnPreviewDismiss) {
      btnPreviewDismiss.addEventListener('click', () => {
        ocrPreviewCard.style.display = 'none';
      });
    }

    if (btnPreviewVerify) {
      btnPreviewVerify.addEventListener('click', () => {
        if (activeOcrUploadedDoc) {
          openVerificationModal(activeOcrUploadedDoc);
        }
      });
    }

    // Search and Filters
    let searchDebounceTimer;
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(applyFilters, 250);
      });
    }

    if (filterType) filterType.addEventListener('change', applyFilters);
    if (filterStatus) filterStatus.addEventListener('change', applyFilters);
    if (filterMonth) filterMonth.addEventListener('change', applyFilters);

    if (btnFilterMissing) {
      btnFilterMissing.addEventListener('click', () => {
        isMissingOnlyFilter = !isMissingOnlyFilter;
        btnFilterMissing.classList.toggle('active', isMissingOnlyFilter);
        applyFilters();
      });
    }

    if (btnResetFilters) {
      btnResetFilters.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (filterType) filterType.value = '';
        if (filterStatus) filterStatus.value = '';
        if (filterMonth) filterMonth.value = '';
        isMissingOnlyFilter = false;
        if (btnFilterMissing) btnFilterMissing.classList.remove('active');
        setActiveKpiCard('all');
        applyFilters();
      });
    }

    // KPI Cards as quick filters
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
      card.addEventListener('click', () => {
        const filter = card.getAttribute('data-filter');
        setActiveKpiCard(filter);
        applyFilters();
      });
    });

    // Scheduler button
    if (btnRunScheduler) {
      btnRunScheduler.addEventListener('click', triggerManualScheduler);
    }

    // CSV Export
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', exportAuditLedgerCSV);
    }

    // Modal Close Buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
      });
    });

    // Verification Form submit
    if (formVerification) {
      formVerification.addEventListener('submit', handleSaveVerification);
    }

    // Perpetual checkbox toggle in verification modal
    const verifyIsPerpetual = document.getElementById('verifyIsPerpetual');
    const verifyExpiryDate = document.getElementById('verifyExpiryDate');
    if (verifyIsPerpetual && verifyExpiryDate) {
      verifyIsPerpetual.addEventListener('change', () => {
        if (verifyIsPerpetual.checked) {
          verifyExpiryDate.value = '';
          verifyExpiryDate.disabled = true;
        } else {
          verifyExpiryDate.disabled = false;
        }
      });
    }

    // Auto Renewal Modal confirm
    const btnConfirmRenewal = document.getElementById('btnConfirmRenewal');
    if (btnConfirmRenewal) {
      btnConfirmRenewal.addEventListener('click', handleConfirmRenewal);
    }

    // Reminder Modal confirm
    const btnSendReminderConfirm = document.getElementById('btnSendReminderConfirm');
    if (btnSendReminderConfirm) {
      btnSendReminderConfirm.addEventListener('click', handleConfirmReminder);
    }

    // Logs Drawer
    if (btnViewNotifLogs) {
      btnViewNotifLogs.addEventListener('click', openNotificationLogs);
    }
  }

  // Active KPI Card state
  function setActiveKpiCard(filter) {
    activeKpiFilter = filter;
    document.querySelectorAll('.kpi-card').forEach(c => {
      if (c.getAttribute('data-filter') === filter) {
        c.classList.add('active-filter');
      } else {
        c.classList.remove('active-filter');
      }
    });
  }

  // API: Load Dashboard KPIs
  async function loadDashboardMetrics() {
    try {
      const res = await fetch(`${API_BASE}/api/documents/dashboard`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const stats = await res.json();

      if (kpiTotal) kpiTotal.textContent = stats.total ?? 0;
      if (kpiActive) kpiActive.textContent = stats.active ?? 0;
      if (kpi90d) kpi90d.textContent = stats.expiring90 ?? 0;
      if (kpi30d) kpi30d.textContent = stats.expiring30 ?? 0;
      if (kpi7d) kpi7d.textContent = stats.expiring7 ?? 0;
      if (kpiExpired) kpiExpired.textContent = stats.expired ?? 0;
      if (countMissingBadge) countMissingBadge.textContent = stats.missingExpiryCount ?? 0;

      if (stats.lastSchedulerRun) {
        const d = new Date(stats.lastSchedulerRun);
        schedulerStatusText.textContent = `Daily Scheduler: Ran ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    } catch (err) {
      console.warn('Dashboard stats fallback:', err);
    }
  }

  // API: Load Documents
  async function loadDocuments() {
    try {
      documentsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">
            <span style="display: inline-block; animation: spin 1s infinite linear;">⚡</span> Loading statutory document vault...
          </td>
        </tr>
      `;

      const res = await fetch(`${API_BASE}/api/documents`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allDocuments = data.documents || [];
      applyFilters();
    } catch (err) {
      console.error('Failed to load documents:', err);
      documentsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 30px; color: #fb7185;">
            Failed to connect to statutory API. Please verify backend server is running.
          </td>
        </tr>
      `;
    }
  }

  // Filter Documents in Memory
  function applyFilters() {
    const q = (searchInput ? searchInput.value.trim().toLowerCase() : '');
    const typeVal = filterType ? filterType.value : '';
    const statusVal = filterStatus ? filterStatus.value : '';
    const monthVal = filterMonth ? filterMonth.value : '';

    currentFilteredDocuments = allDocuments.filter(doc => {
      // Missing Expiry Filter
      if (isMissingOnlyFilter && !doc.isMissingExpiry) {
        return false;
      }

      // KPI Card Quick Filter
      if (activeKpiFilter !== 'all') {
        if (activeKpiFilter === 'Active' && doc.status !== 'Active') return false;
        if (activeKpiFilter === 'Expired' && doc.status !== 'Expired') return false;
        if (activeKpiFilter === 'expiring90') {
          if (doc.daysRemaining === null || doc.daysRemaining < 0 || doc.daysRemaining > 90) return false;
        }
        if (activeKpiFilter === 'expiring30') {
          if (doc.daysRemaining === null || doc.daysRemaining < 0 || doc.daysRemaining > 30) return false;
        }
        if (activeKpiFilter === 'expiring7') {
          if (doc.daysRemaining === null || doc.daysRemaining < 0 || doc.daysRemaining > 7) return false;
        }
      }

      // Type Filter
      if (typeVal && doc.documentType !== typeVal) return false;

      // Status Filter
      if (statusVal) {
        if (statusVal === 'Expiring Soon') {
          if (doc.status !== 'Expiring Soon' && !(doc.daysRemaining !== null && doc.daysRemaining <= 90 && doc.daysRemaining >= 0)) {
            return false;
          }
        } else if (doc.status !== statusVal) {
          return false;
        }
      }

      // Month Filter (format: YYYY-MM)
      if (monthVal && doc.expiryDate) {
        if (!doc.expiryDate.startsWith(monthVal)) return false;
      }

      // Search Query
      if (q) {
        const matchName = (doc.documentName || '').toLowerCase().includes(q);
        const matchHolder = (doc.holderName || '').toLowerCase().includes(q);
        const matchNum = (doc.documentNumber || '').toLowerCase().includes(q);
        const matchAuth = (doc.issuingAuthority || '').toLowerCase().includes(q);
        if (!matchName && !matchHolder && !matchNum && !matchAuth) return false;
      }

      return true;
    });

    renderDocumentsTable(currentFilteredDocuments);
  }

  // Render Table Rows
  function renderDocumentsTable(docs) {
    if (!documentsTableBody) return;

    if (!docs || docs.length === 0) {
      documentsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">
            <div style="font-size: 2rem; margin-bottom: 8px;">📂</div>
            <div>No matching statutory documents found.</div>
            <div style="font-size: 0.76rem; color: #64748b; margin-top: 4px;">Try clearing filters or uploading a new statutory certificate.</div>
          </td>
        </tr>
      `;
      if (displayCountText) displayCountText.textContent = `Showing 0 of ${allDocuments.length} documents`;
      return;
    }

    let rowsHtml = '';
    docs.forEach(doc => {
      // Urgency badge calculation
      let urgencyBadge = '';
      const days = doc.daysRemaining;

      if (doc.isMissingExpiry) {
        urgencyBadge = `<span class="status-badge status-expired">⚠️ Missing Expiry Date</span>`;
      } else if (days !== null && days !== undefined) {
        if (days < 0) {
          urgencyBadge = `<span class="status-badge status-expired">🛑 Expired <span class="days-pill days-pill-expired">${Math.abs(days)}d ago</span></span>`;
        } else if (days <= 7) {
          urgencyBadge = `<span class="status-badge status-7d">🚨 Expiring in 7D <span class="days-pill days-pill-expired">${days}d</span></span>`;
        } else if (days <= 30) {
          urgencyBadge = `<span class="status-badge status-30d">⚠️ Expiring in 30D <span class="days-pill days-pill-warn">${days}d</span></span>`;
        } else if (days <= 90) {
          urgencyBadge = `<span class="status-badge status-90d">📅 Expiring in 90D <span class="days-pill days-pill-warn">${days}d</span></span>`;
        } else {
          urgencyBadge = `<span class="status-badge status-active">🛡️ Active <span class="days-pill days-pill-safe">${days}d</span></span>`;
        }
      } else {
        urgencyBadge = `<span class="status-badge status-active">🛡️ Perpetual (No Expiry)</span>`;
      }

      // Confidence badge
      const conf = doc.confidenceScore || 85.0;
      let confClass = 'confidence-high';
      if (conf < 75) confClass = 'confidence-low';
      else if (conf < 90) confClass = 'confidence-medium';

      const verifyTag = doc.verified 
        ? `<span style="color: #34d399; font-size: 0.72rem; margin-left: 4px;" title="Practitioner Verified">✓ Verified</span>` 
        : `<span style="color: #fbbf24; font-size: 0.72rem; margin-left: 4px;" title="Unverified OCR">● Review</span>`;

      // Icon by doc type
      let typeIcon = '📄';
      if (doc.documentType === 'Trade Permit') typeIcon = '🏬';
      else if (doc.documentType === 'Insurance Policy') typeIcon = '🏥';
      else if (doc.documentType === 'Identity / KYC') typeIcon = '🪪';
      else if (doc.documentType === 'Tax & Compliance') typeIcon = '⚖️';
      else if (doc.documentType === 'Lease & Contract') typeIcon = '📑';
      else if (doc.documentType === 'Vehicle / Logistics') typeIcon = '🚚';

      rowsHtml += `
        <tr data-id="${doc.id}">
          <td>
            <div style="font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
              <span>${typeIcon}</span>
              <span>${escapeHtml(doc.documentName)}</span>
            </div>
            <div style="font-size: 0.74rem; font-family: 'JetBrains Mono', monospace; color: #c084fc; margin-top: 3px;">
              ${escapeHtml(doc.documentNumber || 'N/A')}
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: #e2e8f0;">${escapeHtml(doc.documentType || 'Statutory License')}</div>
            <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px;">${escapeHtml(doc.issuingAuthority || 'Govt Authority')}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: #f1f5f9;">${escapeHtml(doc.holderName || 'Corporate Entity')}</div>
            <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">
              Issued: ${doc.issueDate ? doc.issueDate.slice(0, 10) : 'N/A'}
            </div>
          </td>
          <td>
            <div style="margin-bottom: 4px;">${urgencyBadge}</div>
            <div style="font-size: 0.74rem; color: #cbd5e1; font-family: 'JetBrains Mono', monospace;">
              Exp: ${doc.expiryDate ? doc.expiryDate.slice(0, 10) : (doc.isMissingExpiry ? '<span style="color: #fb7185;">Missing Date</span>' : 'Perpetual')}
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span class="confidence-badge ${confClass}">${conf.toFixed(1)}%</span>
              ${verifyTag}
            </div>
            ${doc.notes ? `<div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(doc.notes)}">${escapeHtml(doc.notes)}</div>` : ''}
          </td>
          <td style="text-align: right;">
            <div class="row-actions" style="justify-content: flex-end;">
              <button class="btn-action-icon btn-action-renew" onclick="window.DocEngine.openRenewal('${doc.id}')" title="AI Auto Renewal Assistant">
                ⚡
              </button>
              <button class="btn-action-icon btn-action-verify" onclick="window.DocEngine.openVerification('${doc.id}')" title="Verify / Correct Entity Information">
                ✏️
              </button>
              <button class="btn-action-icon btn-action-remind" onclick="window.DocEngine.openReminder('${doc.id}')" title="Dispatch Statutory Reminder">
                🔔
              </button>
              <button class="btn-action-icon" onclick="window.DocEngine.deleteDoc('${doc.id}')" title="Delete Document Record" style="color: #fda4af;">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    documentsTableBody.innerHTML = rowsHtml;
    if (displayCountText) {
      displayCountText.textContent = `Showing ${docs.length} of ${allDocuments.length} statutory documents`;
    }
  }

  // Handle Multi-Format Document Upload & AI OCR Execution
  async function handleFileUpload(file) {
    if (!file) return;

    const allowed = ['.pdf', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      showToast(`Unsupported format '${ext}'. Please upload PDF, JPG, PNG, or DOCX.`, 'error');
      return;
    }

    // Activate Scanning Beam & Progress Box
    if (scanBeam) scanBeam.style.display = 'block';
    if (fileDropzone) fileDropzone.classList.add('scanning-active');
    if (uploadStatusBox) uploadStatusBox.style.display = 'block';
    if (ocrPreviewCard) ocrPreviewCard.style.display = 'none';

    // Step 1: Receiving
    setOcrStep(1, 'processing', 'File binary uploaded. Validating header...');
    if (uploadStatusPct) uploadStatusPct.textContent = '25%';

    const formData = new FormData();
    formData.append('file', file);
    const holderInput = document.getElementById('inputHolderOverride');
    if (holderInput && holderInput.value.trim()) {
      formData.append('holder_override', holderInput.value.trim());
    }

    try {
      // Step 2: Ingestion
      setTimeout(() => {
        setOcrStep(1, 'done');
        setOcrStep(2, 'processing', 'Extracting document text via OCR engine...');
        if (uploadStatusPct) uploadStatusPct.textContent = '50%';
      }, 350);

      // Step 3: Entity Recognition
      setTimeout(() => {
        setOcrStep(2, 'done');
        setOcrStep(3, 'processing', 'Parsing statutory entities: Dates, Names, IDs, Authority...');
        if (uploadStatusPct) uploadStatusPct.textContent = '75%';
      }, 700);

      const res = await fetch(`${API_BASE}/api/documents/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Upload failed with status ${res.status}`);
      }

      const result = await res.json();
      const doc = result.document;
      activeOcrUploadedDoc = doc;

      // Step 4: Finalizing
      setOcrStep(3, 'done');
      setOcrStep(4, 'done', 'Entity confidence evaluated & record vaulted.');
      if (uploadStatusPct) uploadStatusPct.textContent = '100%';

      showToast(`Document '${doc.documentName}' analyzed and saved!`, 'success');

      // Populate Extracted Preview Card
      if (ocrPreviewCard) {
        ocrPreviewCard.style.display = 'block';
        previewDocName.textContent = doc.documentName;
        previewDocType.textContent = doc.documentType;
        previewDocNum.textContent = doc.documentNumber;
        previewExpiryDate.textContent = doc.expiryDate || (doc.isMissingExpiry ? 'Missing Expiry Date' : 'Perpetual');
        previewAuthority.textContent = doc.issuingAuthority;

        const conf = doc.confidenceScore || 85.0;
        ocrConfidenceBadge.textContent = `${conf.toFixed(1)}% Confidence`;
        ocrConfidenceBadge.className = `confidence-badge ${conf >= 90 ? 'confidence-high' : (conf >= 75 ? 'confidence-medium' : 'confidence-low')}`;
      }

      // Refresh Dashboard & Table
      await loadDashboardMetrics();
      await loadDocuments();

    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.message, 'error');
      setOcrStep(4, 'failed', `Error: ${err.message}`);
    } finally {
      if (scanBeam) scanBeam.style.display = 'none';
      if (fileDropzone) fileDropzone.classList.remove('scanning-active');
      if (fileInput) fileInput.value = '';
    }
  }

  function setOcrStep(stepNum, status, text) {
    const el = document.getElementById(`ocrStep${stepNum}`);
    if (!el) return;
    el.className = status;
    if (text) {
      el.innerHTML = `<span>${status === 'done' ? '✓' : (status === 'processing' ? '⚡' : '•')}</span> ${escapeHtml(text)}`;
    }
  }

  // Verification & Manual Correction Modal
  function openVerificationModal(doc) {
    if (!doc) return;
    document.getElementById('verifyDocId').value = doc.id;
    document.getElementById('verifyDocName').value = doc.documentName || '';
    document.getElementById('verifyDocType').value = doc.documentType || 'Statutory License';
    document.getElementById('verifyDocNumber').value = doc.documentNumber || '';
    document.getElementById('verifyHolderName').value = doc.holderName || '';
    document.getElementById('verifyIssueDate').value = (doc.issueDate || '').slice(0, 10);
    
    const expInput = document.getElementById('verifyExpiryDate');
    const perpetualCheck = document.getElementById('verifyIsPerpetual');

    if (!doc.expiryDate || doc.expiryDate.toLowerCase() === 'perpetual') {
      expInput.value = '';
      expInput.disabled = true;
      perpetualCheck.checked = true;
    } else {
      expInput.value = doc.expiryDate.slice(0, 10);
      expInput.disabled = false;
      perpetualCheck.checked = false;
    }

    document.getElementById('verifyAuthority').value = doc.issuingAuthority || '';
    document.getElementById('verifyNotes').value = doc.notes || '';

    // Alert Banner in modal if low confidence or missing expiry
    const alertBox = document.getElementById('verifyAlertBox');
    if (doc.isMissingExpiry) {
      alertBox.style.display = 'block';
      alertBox.style.background = 'rgba(244, 63, 94, 0.18)';
      alertBox.style.border = '1px solid rgba(244, 63, 94, 0.45)';
      alertBox.style.color = '#fb7185';
      alertBox.innerHTML = `⚠️ <b>Missing Expiry Date:</b> The AI OCR did not detect an expiration date. Please manually enter the legal validity or check "Perpetual".`;
    } else if (doc.confidenceScore && doc.confidenceScore < 80) {
      alertBox.style.display = 'block';
      alertBox.style.background = 'rgba(245, 158, 11, 0.18)';
      alertBox.style.border = '1px solid rgba(245, 158, 11, 0.45)';
      alertBox.style.color = '#fcd34d';
      alertBox.innerHTML = `⚠️ <b>Low Extraction Confidence (${doc.confidenceScore.toFixed(1)}%):</b> Please carefully verify the registration number and dates before approving.`;
    } else {
      alertBox.style.display = 'none';
    }

    modalVerification.classList.add('show');
  }

  async function handleSaveVerification(e) {
    e.preventDefault();
    const docId = document.getElementById('verifyDocId').value;
    const isPerpetual = document.getElementById('verifyIsPerpetual').checked;
    const expDateVal = isPerpetual ? 'perpetual' : document.getElementById('verifyExpiryDate').value;

    const payload = {
      documentName: document.getElementById('verifyDocName').value.trim(),
      documentType: document.getElementById('verifyDocType').value,
      documentNumber: document.getElementById('verifyDocNumber').value.trim(),
      holderName: document.getElementById('verifyHolderName').value.trim(),
      issueDate: document.getElementById('verifyIssueDate').value || undefined,
      expiryDate: expDateVal,
      issuingAuthority: document.getElementById('verifyAuthority').value.trim(),
      notes: document.getElementById('verifyNotes').value.trim(),
      verified: true,
      confidenceScore: 99.5
    };

    try {
      const res = await fetch(`${API_BASE}/api/documents/${docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to update verification record');
      showToast('Document verified and compliance record updated!', 'success');
      modalVerification.classList.remove('show');

      await loadDashboardMetrics();
      await loadDocuments();
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  }

  // AI Auto Renewal Modal
  async function openRenewalModal(docId) {
    const doc = allDocuments.find(d => d.id === docId);
    if (!doc) return;

    document.getElementById('renewalDocId').value = doc.id;
    document.getElementById('renewalDocTitle').textContent = doc.documentName;
    document.getElementById('renewalDocMeta').textContent = `${doc.documentNumber} • Holder: ${doc.holderName} • Expiry: ${doc.expiryDate || 'N/A'}`;

    try {
      const res = await fetch(`${API_BASE}/api/documents/${docId}/renewal-guide`);
      if (!res.ok) throw new Error('Failed to fetch renewal guidelines');
      const guide = await res.json();

      document.getElementById('renewalEstFee').textContent = guide.estimatedFee || 'Statutory Filing';
      document.getElementById('renewalPortalName').textContent = guide.portalName || 'Statutory Portal';
      document.getElementById('renewalProcessOverview').textContent = guide.statutoryProcess || '';
      document.getElementById('renewalPortalLink').href = guide.portalUrl || '#';
      document.getElementById('renewalNewExpiryDate').value = guide.suggestedNewExpiry || '';
      document.getElementById('renewalChallan').value = `AUTH-RNW-${Math.floor(100000 + Math.random() * 900000)}`;

      // Render Checklist
      const checklistContainer = document.getElementById('renewalChecklistContainer');
      checklistContainer.innerHTML = (guide.checklist || []).map(item => `
        <li class="renewal-check-item">
          <input type="checkbox" id="chk_${item.id}" ${item.required ? 'checked' : ''}>
          <label for="chk_${item.id}" style="cursor: pointer;">
            <b>${escapeHtml(item.task)}</b> ${item.required ? '<span style="color: #fb7185;">(Required)</span>' : ''}
          </label>
        </li>
      `).join('');

      modalRenewal.classList.add('show');
    } catch (err) {
      console.error(err);
      showToast('Could not load renewal guidelines: ' + err.message, 'error');
    }
  }

  async function handleConfirmRenewal() {
    const docId = document.getElementById('renewalDocId').value;
    const newExpiry = document.getElementById('renewalNewExpiryDate').value;
    const challan = document.getElementById('renewalChallan').value;

    if (!newExpiry) {
      showToast('Please specify the new extended expiry date.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/documents/${docId}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newExpiryDate: newExpiry,
          feePaid: challan ? `Statutory Token: ${challan}` : 'Authorized Statutory Filing',
          notes: 'Auto-renewed via AI Renewal Assistant with digital CA signature'
        })
      });

      if (!res.ok) throw new Error('Failed to complete auto-renewal');
      const data = await res.json();

      showToast(data.message || 'Document renewed successfully!', 'success');
      modalRenewal.classList.remove('show');

      await loadDashboardMetrics();
      await loadDocuments();
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  }

  // Multi-Channel Reminder Modal
  function openReminderModal(docId) {
    const doc = allDocuments.find(d => d.id === docId);
    if (!doc) return;

    document.getElementById('reminderDocId').value = doc.id;
    document.getElementById('reminderDocTitle').textContent = `${doc.documentName} (${doc.documentNumber})`;
    
    const days = doc.daysRemaining;
    let urgencyStr = 'Perpetual Document';
    if (doc.isMissingExpiry) urgencyStr = 'Missing Expiry Notice';
    else if (days !== null) urgencyStr = days < 0 ? `Expired ${Math.abs(days)} days ago` : `Expiring in ${days} days`;

    document.getElementById('reminderDocUrgency').textContent = `Status: ${urgencyStr} • Holder: ${doc.holderName}`;

    // Notice Preview Message
    const msg = `STATUTORY NOTICE: Your ${doc.documentName} (ID: ${doc.documentNumber}) registered under ${doc.holderName} requires statutory compliance renewal. Please verify validity immediately through the AI Chartered Accountant Portal.`;
    document.getElementById('reminderCustomMessage').value = msg;

    modalReminder.classList.add('show');
  }

  async function handleConfirmReminder() {
    const docId = document.getElementById('reminderDocId').value;
    const chkEmail = document.getElementById('chkRemindEmail').checked;
    const chkWhatsapp = document.getElementById('chkRemindWhatsapp').checked;
    const chkInApp = document.getElementById('chkRemindInApp').checked;
    const message = document.getElementById('reminderCustomMessage').value;

    const channels = [];
    if (chkEmail) channels.push('email');
    if (chkWhatsapp) channels.push('whatsapp');
    if (chkInApp) channels.push('in_app');

    if (channels.length === 0) {
      showToast('Please select at least one notification channel.', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/documents/${docId}/remind`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channels: channels,
          message: message
        })
      });

      if (!res.ok) throw new Error('Failed to dispatch reminders');
      const data = await res.json();
      showToast(data.message || 'Reminders dispatched successfully!', 'success');
      modalReminder.classList.remove('show');

      await loadDashboardMetrics();
      await loadDocuments();
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  }

  // Delete Document
  async function deleteDocument(docId) {
    const doc = allDocuments.find(d => d.id === docId);
    const name = doc ? doc.documentName : 'document';
    if (!confirm(`Are you sure you want to delete '${name}' from the statutory vault?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/documents/${docId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete document');

      showToast(`Document record deleted.`, 'success');
      await loadDashboardMetrics();
      await loadDocuments();
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  }

  // Manual Trigger for Scheduler
  async function triggerManualScheduler() {
    if (btnRunScheduler) {
      btnRunScheduler.disabled = true;
      btnRunScheduler.innerHTML = `<span>⏳</span> <span>Evaluating...</span>`;
    }

    try {
      const res = await fetch(`${API_BASE}/api/documents/run-scheduler`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Scheduler run failed');
      const data = await res.json();

      showToast(`Scheduler completed: ${data.totalScanned} scanned, ${data.updatedCount} updated, ${data.remindersDispatched} reminders dispatched.`, 'success');
      await loadDashboardMetrics();
      await loadDocuments();
    } catch (err) {
      console.error(err);
      showToast('Error running scheduler: ' + err.message, 'error');
    } finally {
      if (btnRunScheduler) {
        btnRunScheduler.disabled = false;
        btnRunScheduler.innerHTML = `<span>🔄</span> <span>Run Check Now</span>`;
      }
    }
  }

  // View Notification Logs
  async function openNotificationLogs() {
    try {
      const res = await fetch(`${API_BASE}/api/documents/notifications?limit=50`);
      if (!res.ok) throw new Error('Failed to fetch notification logs');
      const data = await res.json();
      const logs = data.notifications || [];

      const tbody = document.getElementById('notifLogsTableBody');
      if (!tbody) return;

      if (logs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">No reminder notifications logged yet.</td></tr>`;
      } else {
        tbody.innerHTML = logs.map(l => `
          <tr>
            <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; color: #94a3b8;">
              ${new Date(l.timestamp).toLocaleString()}
            </td>
            <td style="font-weight: 600; color: #fff;">${escapeHtml(l.documentName || 'Document')}</td>
            <td>
              <span class="status-badge ${l.channel === 'whatsapp' ? 'status-active' : (l.channel === 'email' ? 'status-pending' : 'status-90d')}">
                ${l.channel.toUpperCase()}
              </span>
            </td>
            <td style="font-size: 0.78rem; color: #cbd5e1;">${escapeHtml(l.recipient || 'N/A')}</td>
            <td><span style="color: #34d399; font-weight: 600;">${escapeHtml(l.status || 'Delivered')}</span></td>
          </tr>
        `).join('');
      }

      modalNotifLogs.classList.add('show');
    } catch (err) {
      console.error(err);
      showToast('Failed to load logs: ' + err.message, 'error');
    }
  }

  // Export CSV
  function exportAuditLedgerCSV() {
    if (!allDocuments || allDocuments.length === 0) {
      showToast('No documents available to export.', 'error');
      return;
    }

    const headers = ['ID', 'Document Name', 'Type', 'Holder', 'Document Number', 'Issue Date', 'Expiry Date', 'Status', 'Days Remaining', 'Authority', 'Verified'];
    const rows = allDocuments.map(d => [
      d.id,
      `"${(d.documentName || '').replace(/"/g, '""')}"`,
      `"${(d.documentType || '').replace(/"/g, '""')}"`,
      `"${(d.holderName || '').replace(/"/g, '""')}"`,
      `"${(d.documentNumber || '').replace(/"/g, '""')}"`,
      d.issueDate || '',
      d.expiryDate || '',
      d.status || '',
      d.daysRemaining !== null ? d.daysRemaining : '',
      `"${(d.issuingAuthority || '').replace(/"/g, '""')}"`,
      d.verified ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Statutory_Document_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Statutory Document Audit Ledger CSV exported!', 'success');
  }

  // Toast Helper
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <div>${escapeHtml(message)}</div>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Utility
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global methods for inline button onclick handlers
  window.DocEngine = {
    openRenewal: (id) => openRenewalModal(id),
    openVerification: (id) => {
      const doc = allDocuments.find(d => d.id === id);
      if (doc) openVerificationModal(doc);
    },
    openReminder: (id) => openReminderModal(id),
    deleteDoc: (id) => deleteDocument(id)
  };

})();
