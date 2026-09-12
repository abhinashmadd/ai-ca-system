import os
import uuid
import datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query, status

from backend.models import (
    DocumentResponse, DocumentCreate, DocumentUpdate,
    DashboardStatsResponse, ReminderRequest, RenewalRequest,
    RenewalGuideResponse
)
from backend.database import db_manager
from backend.services.ocr_service import DocumentOCREngine
from backend.services.renewal_service import AIRenewalAssistant
from backend.services.scheduler_service import DocumentExpiryScheduler

router = APIRouter(prefix="/api/documents", tags=["Document Lifecycle & Expiry"])

def _calculate_days_remaining(doc: dict) -> dict:
    doc_copy = dict(doc)
    exp_str = doc_copy.get("expiryDate")
    if not exp_str or not str(exp_str).strip() or str(exp_str).lower() == "perpetual":
        doc_copy["daysRemaining"] = None
        doc_copy["isMissingExpiry"] = not bool(exp_str and str(exp_str).strip())
        return doc_copy

    try:
        exp_date = datetime.date.fromisoformat(str(exp_str)[:10])
        today = datetime.date.today()
        days_left = (exp_date - today).days
        doc_copy["daysRemaining"] = days_left
        doc_copy["isMissingExpiry"] = False
        
        # Sync status if not locked in completed
        if doc_copy.get("status") not in ["Renewal Completed"]:
            if days_left < 0:
                doc_copy["status"] = "Expired"
            elif days_left <= 30:
                doc_copy["status"] = "Expiring Soon"
            else:
                doc_copy["status"] = "Active"
    except Exception:
        doc_copy["daysRemaining"] = None
        doc_copy["isMissingExpiry"] = True

    return doc_copy


@router.get("/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_stats():
    raw_docs = db_manager.get_documents()
    docs = [_calculate_days_remaining(d) for d in raw_docs]

    total = len(docs)
    active = sum(1 for d in docs if d.get("status") == "Active")
    expired = sum(1 for d in docs if d.get("status") == "Expired")
    renewal_pending = sum(1 for d in docs if d.get("status") == "Renewal Pending")
    renewal_completed = sum(1 for d in docs if d.get("status") == "Renewal Completed")
    missing_expiry = sum(1 for d in docs if d.get("isMissingExpiry"))

    expiring_7 = 0
    expiring_30 = 0
    expiring_90 = 0

    for d in docs:
        dr = d.get("daysRemaining")
        if dr is not None and dr >= 0:
            if dr <= 7:
                expiring_7 += 1
            if dr <= 30:
                expiring_30 += 1
            if dr <= 90:
                expiring_90 += 1

    compliance_rate = round(((total - expired) / total * 100) if total > 0 else 100.0, 1)

    return DashboardStatsResponse(
        total=total,
        active=active,
        expiring90=expiring_90,
        expiring30=expiring_30,
        expiring7=expiring_7,
        expired=expired,
        renewalPending=renewal_pending,
        renewalCompleted=renewal_completed,
        missingExpiryCount=missing_expiry,
        complianceRate=compliance_rate,
        lastSchedulerRun=DocumentExpiryScheduler._last_run_timestamp
    )


@router.get("")
def list_documents(
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    month: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    raw_docs = db_manager.get_documents()
    docs = [_calculate_days_remaining(d) for d in raw_docs]

    filtered = []
    for d in docs:
        if type and type.lower() != "all" and d.get("documentType", "").lower() != type.lower():
            continue
        if status and status.lower() != "all" and d.get("status", "").lower() != status.lower():
            continue
        if month and month.lower() != "all":
            exp = d.get("expiryDate", "")
            if len(exp) >= 7:
                doc_month = exp[5:7]
                if doc_month != month.zfill(2):
                    continue
            else:
                continue
        if search:
            q = search.lower().strip()
            haystack = f"{d.get('documentName', '')} {d.get('holderName', '')} {d.get('documentNumber', '')} {d.get('issuingAuthority', '')}".lower()
            if q not in haystack:
                continue
        filtered.append(d)

    return {"documents": filtered, "count": len(filtered)}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    holder_override: Optional[str] = Form(None)
):
    try:
        contents = await file.read()
        filename = file.filename or "uploaded_document"
        
        # Run OCR extraction
        ocr_meta = DocumentOCREngine.extract_from_bytes(contents, filename)
        
        doc_name = ocr_meta.get("documentName") or filename.rsplit(".", 1)[0].replace("_", " ").title()
        holder = holder_override or ocr_meta.get("holderName") or "Apex Global Technologies Corp"
        doc_num = ocr_meta.get("documentNumber") or f"REG-{uuid.uuid4().hex[:8].upper()}"
        doc_type = ocr_meta.get("documentType") or "Statutory License"
        exp_date = ocr_meta.get("expiryDate") or ""
        issue_date = ocr_meta.get("issueDate") or datetime.date.today().isoformat()
        issuing_auth = ocr_meta.get("issuingAuthority") or "Statutory Registrar"

        ext = os.path.splitext(filename)[1].replace(".", "").upper() or "PDF"

        new_doc = {
            "id": f"DOC-{datetime.date.today().year}-{uuid.uuid4().hex[:6].upper()}",
            "documentName": doc_name,
            "documentType": doc_type,
            "holderName": holder,
            "documentNumber": doc_num,
            "issueDate": issue_date,
            "expiryDate": exp_date,
            "issuingAuthority": issuing_auth,
            "status": "Active",
            "confidenceScore": ocr_meta.get("confidenceScore", 92.5),
            "isVerified": False,
            "verifiedBy": "AI OCR Ingestion Engine",
            "fileFormat": ext,
            "fileName": filename,
            "notes": "Extracted via OCR Engine. Pending final verification.",
            "created_at": datetime.datetime.now().isoformat()
        }

        created = db_manager.create_document(new_doc)
        enriched = _calculate_days_remaining(created)

        return {
            "success": True,
            "message": "Document uploaded and parsed successfully!",
            "document": enriched,
            "ocrMeta": ocr_meta
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/{id}")
def get_document(id: str):
    doc = db_manager.get_document_by_id(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return _calculate_days_remaining(doc)


@router.put("/{id}")
def update_document(id: str, payload: DocumentUpdate):
    doc = db_manager.get_document_by_id(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    update_data = {k: v for k, v in payload.dict(exclude_unset=True).items() if v is not None}
    updated = db_manager.update_document(id, update_data)
    return {
        "success": True,
        "message": "Document updated successfully!",
        "document": _calculate_days_remaining(updated)
    }


@router.delete("/{id}")
def delete_document(id: str):
    doc = db_manager.get_document_by_id(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    success = db_manager.delete_document(id)
    return {
        "success": success,
        "message": f"Document {id} deleted successfully."
    }


@router.get("/{id}/renewal-guide", response_model=RenewalGuideResponse)
def get_renewal_guide(id: str):
    doc = db_manager.get_document_by_id(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc_type = doc.get("documentType", "Statutory License")
    guide_template = AIRenewalAssistant.RENEWAL_TEMPLATES.get(
        doc_type, 
        AIRenewalAssistant.RENEWAL_TEMPLATES["Statutory License"]
    )

    curr_exp = doc.get("expiryDate", "")
    suggested_date = ""
    try:
        base_date = datetime.date.fromisoformat(curr_exp[:10]) if curr_exp else datetime.date.today()
        years_ext = guide_template.get("validityExtensionYears", 1)
        suggested_date = (base_date + datetime.timedelta(days=years_ext * 365)).isoformat()
    except Exception:
        suggested_date = (datetime.date.today() + datetime.timedelta(days=365)).isoformat()

    return RenewalGuideResponse(
        documentId=id,
        documentName=doc.get("documentName", ""),
        documentType=doc_type,
        holderName=doc.get("holderName", ""),
        documentNumber=doc.get("documentNumber", ""),
        currentExpiryDate=curr_exp,
        suggestedNewExpiry=suggested_date,
        portalName=guide_template["portalName"],
        portalUrl=guide_template["portalUrl"],
        statutoryProcess=guide_template["statutoryProcess"],
        checklist=guide_template["checklist"],
        prefilledData={
            "entity": doc.get("holderName", ""),
            "registrationNumber": doc.get("documentNumber", ""),
            "authority": doc.get("issuingAuthority", ""),
            "challanType": "Annual Statutory Renewal"
        },
        estimatedFee=guide_template["estimatedFee"],
        canAutoRenew=True
    )


@router.post("/{id}/renew")
def execute_renewal(id: str, payload: RenewalRequest):
    doc = db_manager.get_document_by_id(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    update_fields = {
        "expiryDate": payload.newExpiryDate,
        "status": "Renewal Completed",
        "isVerified": True,
        "verifiedBy": "Auto-Renewal Engine",
        "verifiedAt": datetime.datetime.now().isoformat(),
        "notes": f"Renewed on {datetime.date.today().isoformat()}. Fee: ₹{payload.renewalFeePaid}. Challan: {payload.challanRef}. {payload.notes}"
    }

    updated = db_manager.update_document(id, update_fields)
    
    # Log statutory notification
    db_manager.save_notification({
        "documentId": id,
        "documentName": doc.get("documentName"),
        "channel": "system",
        "recipient": doc.get("holderName"),
        "message": f"Statutory renewal completed for {doc.get('documentName')}. New validity: {payload.newExpiryDate}.",
        "timestamp": datetime.datetime.now().isoformat()
    })

    return {
        "success": True,
        "message": "Document successfully renewed and statutory audit log generated!",
        "document": _calculate_days_remaining(updated)
    }


@router.post("/{id}/remind")
def send_reminder(id: str, payload: ReminderRequest):
    doc = db_manager.get_document_by_id(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    channels = payload.channels or ([payload.channel] if payload.channel else ["email"])
    dispatches = []

    for ch in channels:
        msg = payload.customMessage or payload.message or f"Reminder: Statutory Document {doc.get('documentName')} is expiring on {doc.get('expiryDate')}."
        record = {
            "documentId": id,
            "documentName": doc.get("documentName"),
            "channel": ch,
            "recipient": payload.recipient or doc.get("holderName", "Client"),
            "message": msg,
            "status": "Dispatched",
            "timestamp": datetime.datetime.now().isoformat()
        }
        db_manager.save_notification(record)
        dispatches.append(record)

    # Increment remindersSent on document
    curr_reminders = doc.get("remindersSent", 0) + len(dispatches)
    db_manager.update_document(id, {
        "remindersSent": curr_reminders,
        "lastReminderAt": datetime.datetime.now().isoformat()
    })

    return {
        "success": True,
        "message": f"Dispatched reminders across {len(channels)} channel(s).",
        "dispatches": dispatches
    }


@router.post("/run-scheduler")
def run_scheduler_now():
    result = DocumentExpiryScheduler.run_daily_check()
    return {
        "success": True,
        "message": "Daily document expiry evaluation and auto-dispatch completed.",
        "results": result
    }


@router.get("/notifications")
def get_notifications(limit: int = Query(50, ge=1, le=200)):
    notifs = db_manager.get_notifications(limit=limit)
    return {"notifications": notifs, "count": len(notifs)}
