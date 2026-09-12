import random
import uuid
from fastapi import APIRouter, HTTPException, status
from backend.models import (
    LoginRequest, LoginResponse, 
    OTPRequest, OTPVerifyRequest, PasswordResetRequest,
    UserResponse
)
from backend.database import db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    user = db.get_user_by_username_or_email(payload.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User ID or username not found. Please verify your credentials."
        )

    if user.get("password") != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect password or PIN."
        )

    user_resp = UserResponse(
        id=user.get("id", ""),
        username=user.get("username", ""),
        name=user.get("name", ""),
        role=user.get("role", "Chartered Accountant"),
        email=user.get("email", ""),
        firm=user.get("firm", ""),
        frn=user.get("frn", ""),
        cop=user.get("cop", ""),
        membershipId=user.get("membershipId", user.get("username", "")),
        dscStatus=user.get("dscStatus", "Active"),
        status=user.get("status", "Active"),
        created_at=user.get("created_at", "")
    )

    token = f"jwt-mock-{uuid.uuid4().hex}"
    return LoginResponse(
        success=True,
        message=f"Authentication successful! Welcome, {user_resp.name}",
        user=user_resp,
        token=token
    )

@router.post("/forgot-password/request-otp")
def request_otp(payload: OTPRequest):
    user = db.get_user_by_username_or_email(payload.identifier)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No account found matching '{payload.identifier}'."
        )

    # Generate 6-digit random numeric OTP
    otp_code = f"{random.randint(100000, 999999)}"
    db.save_otp(payload.identifier, otp_code, expires_minutes=10)

    email_target = user.get("email") or f"{user.get('username')}@ca-platform.internal"
    print(f"[OTP Service] Generated OTP for {payload.identifier} ({email_target}): {otp_code}")

    return {
        "success": True,
        "message": f"6-Digit OTP successfully sent to {email_target}",
        "email_hint": email_target,
        # We return the OTP in the response for seamless testing & demonstration
        "demo_otp": otp_code,
        "expires_in_minutes": 10
    }

@router.post("/forgot-password/verify-otp")
def verify_otp(payload: OTPVerifyRequest):
    valid = db.verify_otp(payload.identifier, payload.otp)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP. Please verify the code or request a new one."
        )

    return {
        "success": True,
        "message": "OTP verified successfully. You may now set your new password."
    }

@router.post("/forgot-password/reset")
def reset_password(payload: PasswordResetRequest):
    # Verify OTP first
    valid = db.verify_otp(payload.identifier, payload.otp)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP session. Please request a new OTP."
        )

    # Update user password
    updated = db.update_user(payload.identifier, {"password": payload.new_password})
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account could not be found to update."
        )

    # Clear used OTP
    db.clear_otp(payload.identifier)

    return {
        "success": True,
        "message": "Password successfully updated! You can now sign in with your new credentials."
    }

@router.get("/status")
def get_db_status():
    return {
        "connected_to_live_mongodb": db.is_connected,
        "database_name": "ca_platform_db",
        "total_users": len(db.get_all_users())
    }
