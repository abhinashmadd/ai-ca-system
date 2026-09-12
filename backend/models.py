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
