import datetime
from typing import Dict, Any, List

class AIRenewalAssistant:
    """
    AI Statutory Renewal Assistant.
    Generates tailored renewal checklists, official portal guidelines,
    pre-filled forms, and processes one-click auto-renewals with statutory audit logging.
    """

    RENEWAL_TEMPLATES = {
        "Statutory License": {
            "portalName": "National Single Window System (NSWS) / State Portal",
            "portalUrl": "https://www.nsws.gov.in",
            "estimatedFee": "₹2,500.00",
            "validityExtensionYears": 3,
            "statutoryProcess": "Submit Form-12 renewal affidavit along with latest audited financial statements, municipal inspection clearance, and Director DSC authorization.",
            "checklist": [
                {"id": 1, "task": "Verify active Board Resolution for authorized signatory", "required": True},
                {"id": 2, "task": "Upload latest audited balance sheet (FY26)", "required": True},
                {"id": 3, "task": "Generate electronic challan payment token", "required": True},
                {"id": 4, "task": "Affix Class 3 Digital Signature Certificate (DSC)", "required": True}
            ]
        },
        "Trade Permit": {
            "portalName": "Municipal Corporation Citizen & Trade Licensing Portal",
            "portalUrl": "https://portal.mcgm.gov.in",
            "estimatedFee": "₹1,850.00",
            "validityExtensionYears": 1,
            "statutoryProcess": "Upload property tax paid receipt, commercial electricity bill, and employee register. Pay municipal fee via Bharat BillPay gateway.",
            "checklist": [
                {"id": 1, "task": "Confirm current commercial premise lease validity", "required": True},
                {"id": 2, "task": "Verify zero outstanding municipal property tax dues", "required": True},
                {"id": 3, "task": "Reconcile employee count under Shop & Establishment Act", "required": False},
                {"id": 4, "task": "Submit renewal fee online", "required": True}
            ]
        },
        "Insurance Policy": {
            "portalName": "Corporate Insurer Fast-Track Renewal API",
            "portalUrl": "https://www.hdfcergo.com/corporate-renewals",
            "estimatedFee": "₹48,200.00",
            "validityExtensionYears": 1,
            "statutoryProcess": "Confirm active headcount, insured asset valuations, and claim history. Complete premium debit through corporate net-banking authorization.",
            "checklist": [
                {"id": 1, "task": "Review sum insured coverage against latest asset ledger", "required": True},
                {"id": 2, "task": "Audit employee addition/deletion endorsement list", "required": True},
                {"id": 3, "task": "Authorize direct ACH premium debit", "required": True}
            ]
        },
        "Identity / KYC": {
            "portalName": "Passport Seva Kendra (MEA Portal)",
            "portalUrl": "https://www.passportindia.gov.in",
            "estimatedFee": "₹2,000.00",
            "validityExtensionYears": 10,
            "statutoryProcess": "File Form Annexure-E for director reissue under ordinary quota. Schedule biometric appointment or complete DigiLocker re-authentication.",
            "checklist": [
                {"id": 1, "task": "Verify DigiLocker Aadhaar e-KYC synchronization", "required": True},
                {"id": 2, "task": "Verify current residential address proof", "required": True},
                {"id": 3, "task": "Book biometric verification slot at RPO / PSK", "required": True}
            ]
        },
        "Lease & Contract": {
            "portalName": "Department of Registration & e-Stamping Portal",
            "portalUrl": "https://efilingigr.maharashtra.gov.in",
            "estimatedFee": "₹5,400.00",
            "validityExtensionYears": 2,
            "statutoryProcess": "Draft lease addendum or supplementary extension deed. Execute via e-Stamp token and dual biometric sign-off.",
            "checklist": [
                {"id": 1, "task": "Agree on annual lease escalation rate (5% standard)", "required": True},
                {"id": 2, "task": "Generate electronic e-Stamp duty token", "required": True},
                {"id": 3, "task": "Affix landlord and tenant digital signatures", "required": True}
            ]
        },
        "Tax & Compliance": {
            "portalName": "Goods & Services Tax Network (GSTN) / Income Tax Portal",
            "portalUrl": "https://www.gst.gov.in",
            "estimatedFee": "₹0.00 (Statutory Filing)",
            "validityExtensionYears": 5,
            "statutoryProcess": "Complete annual compliance review, verify counterparty GSTIN active statuses, and authenticate updated principal place of business.",
            "checklist": [
                {"id": 1, "task": "Confirm all GSTR-1 and GSTR-3B filings reconciled", "required": True},
                {"id": 2, "task": "Reconcile Electronic Cash and Credit Ledgers", "required": True},
                {"id": 3, "task": "Authenticate authorized signatory Aadhaar OTP", "required": True}
            ]
        },
        "Vehicle / Logistics": {
            "portalName": "Parivahan Sewa (MoRTH)",
            "portalUrl": "https://parivahan.gov.in",
            "estimatedFee": "₹1,200.00",
            "validityExtensionYears": 1,
            "statutoryProcess": "Inspect physical commercial vehicle at authorized RTO testing station. Submit brake, emission, and speed governor calibration certificates.",
            "checklist": [
                {"id": 1, "task": "Obtain computerized PUC (Pollution Under Control) certificate", "required": True},
                {"id": 2, "task": "Complete speed limiter calibration inspection", "required": True},
                {"id": 3, "task": "Pay government vehicle fitness renewal fee online", "required": True}
            ]
        }
    }

    @classmethod
    def get_renewal_guide(cls, doc: Dict[str, Any]) -> Dict[str, Any]:
        doc_type = doc.get("documentType", "Statutory License")
        template = cls.RENEWAL_TEMPLATES.get(doc_type, cls.RENEWAL_TEMPLATES["Statutory License"])

        curr_expiry = doc.get("expiryDate") or datetime.date.today().isoformat()
        try:
            curr_exp_date = datetime.date.fromisoformat(curr_expiry[:10])
        except Exception:
            curr_exp_date = datetime.date.today()

        # Suggest new expiry date
        ext_years = template.get("validityExtensionYears", 1)
        suggested_expiry = curr_exp_date.replace(year=curr_exp_date.year + ext_years).isoformat()

        return {
            "documentId": doc.get("id"),
            "documentName": doc.get("documentName"),
            "documentType": doc_type,
            "holderName": doc.get("holderName"),
            "documentNumber": doc.get("documentNumber"),
            "currentExpiryDate": curr_expiry,
            "suggestedNewExpiry": suggested_expiry,
            "portalName": template["portalName"],
            "portalUrl": template["portalUrl"],
            "statutoryProcess": template["statutoryProcess"],
            "checklist": template["checklist"],
            "estimatedFee": template["estimatedFee"],
            "canAutoRenew": True,
            "prefilledData": {
                "applicantName": doc.get("holderName"),
                "registrationRef": doc.get("documentNumber"),
                "issuingAuthority": doc.get("issuingAuthority"),
                "practitionerStamp": "CA. Ashish Vaiswani, FCA (Reg: 048912)",
                "statutoryFilingDate": datetime.date.today().isoformat()
            }
        }
