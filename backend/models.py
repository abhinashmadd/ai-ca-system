from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserBase(BaseModel):
    username: str = Field(..., description="Unique username or ID")
    name: str = Field(..., description="Full Name")
    role: str = Field(default="Chartered Accountant", description="User role")
    email: Optional[str] = Field(default="", description="Email address")
    firm: Optional[str] = Field(default="Sharma & Tripathi Associates", description="Firm / Practice name")
    frn: Optional[str] = Field(default="FRN-012938N", description="Firm Registration Number")
    cop: Optional[str] = Field(default="COP-88192", description="Certificate of Practice")
    membershipId: Optional[str] = Field(default="", description="Membership / Identification Number")
    dscStatus: Optional[str] = Field(default="Class 3 DSC Active", description="Digital Signature Token status")
    status: Optional[str] = Field(default="Active", description="Account status (Active, Inactive)")

class UserCreate(UserBase):
    password: str = Field(..., min_length=4, description="User password")

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    firm: Optional[str] = None
    frn: Optional[str] = None
    cop: Optional[str] = None
    membershipId: Optional[str] = None
    dscStatus: Optional[str] = None
    status: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str
    role: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserResponse] = None
    token: Optional[str] = None

class OTPRequest(BaseModel):
    identifier: str = Field(..., description="Username, email, or Membership ID")

class OTPVerifyRequest(BaseModel):
    identifier: str
    otp: str

class PasswordResetRequest(BaseModel):
    identifier: str
    otp: str
    new_password: str = Field(..., min_length=4)

# ==========================================================================
# DOCUMENT EXPIRY & AUTO RENEWAL MODELS
# ==========================================================================
class DocumentBase(BaseModel):
    documentName: str = Field(..., description="Legal name of the document or certificate")
    documentType: str = Field(default="Statutory License", description="Document Category/Type")
    holderName: str = Field(..., description="Name of company or individual holder")
    documentNumber: str = Field(..., description="Official Registration/Identification number")
    issueDate: Optional[str] = Field(default="", description="Issuance Date (YYYY-MM-DD)")
    expiryDate: Optional[str] = Field(default="", description="Expiry Date (YYYY-MM-DD or empty if missing)")
    issuingAuthority: str = Field(default="Govt. Authority", description="Name of issuing government authority or agency")
    status: str = Field(default="Active", description="Active, Expiring Soon, Expired, Renewal Pending, Renewal Completed")
    confidenceScore: float = Field(default=95.0, description="AI OCR extraction confidence (0-100%)")
    isVerified: bool = Field(default=False, description="Whether manual or AI CA verification was performed")
    verifiedBy: Optional[str] = Field(default="AI Verification Engine", description="Verifier practitioner name")
    verifiedAt: Optional[str] = Field(default=None, description="ISO timestamp of verification")
    fileFormat: Optional[str] = Field(default="PDF", description="File extension / format (PDF, JPG, PNG, DOCX)")
    fileName: Optional[str] = Field(default="", description="Uploaded filename")
    notes: Optional[str] = Field(default="", description="Statutory compliance notes")

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    documentName: Optional[str] = None
    documentType: Optional[str] = None
    holderName: Optional[str] = None
    documentNumber: Optional[str] = None
    issueDate: Optional[str] = None
    expiryDate: Optional[str] = None
    issuingAuthority: Optional[str] = None
    status: Optional[str] = None
    confidenceScore: Optional[float] = None
    isVerified: Optional[bool] = None
    verifiedBy: Optional[str] = None
    notes: Optional[str] = None

class DocumentVerifyRequest(BaseModel):
    documentName: str
    holderName: str
    documentNumber: str
    issueDate: Optional[str] = ""
    expiryDate: Optional[str] = ""
    issuingAuthority: str
    verifiedBy: Optional[str] = "CA. Abhinash Maddheshiya (FCA)"
    notes: Optional[str] = ""

class DocumentResponse(DocumentBase):
    id: str
    daysRemaining: Optional[int] = None
    isMissingExpiry: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    remindersSent: Optional[int] = 0
    lastReminderAt: Optional[str] = None

class DashboardStatsResponse(BaseModel):
    total: int
    active: int
    expiring90: int
    expiring30: int
    expiring7: int
    expired: int
    renewalPending: int
    renewalCompleted: int
    missingExpiryCount: int
    complianceRate: float
    lastSchedulerRun: Optional[str] = None

class ReminderRequest(BaseModel):
    channel: Optional[str] = Field(default="email", description="email, whatsapp, or in_app")
    channels: Optional[List[str]] = Field(default_factory=lambda: ["email"], description="List of notification channels")
    recipient: Optional[str] = Field(default="", description="Email or phone number")
    message: Optional[str] = Field(default="", description="Statutory alert message")
    customMessage: Optional[str] = Field(default="", description="Custom statutory alert text")

class RenewalRequest(BaseModel):
    newExpiryDate: str = Field(..., description="Extended validity date (YYYY-MM-DD)")
    renewalFeePaid: Optional[float] = Field(default=0.0, description="Challan/statutory fee amount")
    challanRef: Optional[str] = Field(default="", description="Challan / Acknowledgement reference ID")
    notes: Optional[str] = Field(default="Automated AI Renewal Completed", description="Renewal audit trail")

class RenewalGuideResponse(BaseModel):
    documentId: str
    documentName: str
    documentType: str
    holderName: str
    documentNumber: str
    currentExpiryDate: str
    suggestedNewExpiry: str
    portalName: str
    portalUrl: str
    statutoryProcess: str
    checklist: List[dict]
    prefilledData: dict
    estimatedFee: str
    canAutoRenew: bool = True
