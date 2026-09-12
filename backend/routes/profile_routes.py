from fastapi import APIRouter, HTTPException, status
from typing import List
from backend.models import UserCreate, UserUpdate, UserResponse
from backend.database import db

router = APIRouter(prefix="/api/profiles", tags=["Profiles & IDs"])

@router.get("", response_model=List[UserResponse])
def list_profiles():
    users = db.get_all_users()
    resp = []
    for u in users:
        resp.append(UserResponse(
            id=u.get("id", ""),
            username=u.get("username", ""),
            name=u.get("name", ""),
            role=u.get("role", "Chartered Accountant"),
            email=u.get("email", ""),
            firm=u.get("firm", ""),
            frn=u.get("frn", ""),
            cop=u.get("cop", ""),
            membershipId=u.get("membershipId", u.get("username", "")),
            dscStatus=u.get("dscStatus", "Active"),
            status=u.get("status", "Active"),
            created_at=u.get("created_at", "")
        ))
    return resp

@router.get("/{identifier}", response_model=UserResponse)
def get_profile(identifier: str):
    user = db.get_user_by_username_or_email(identifier)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Profile '{identifier}' not found.")

    return UserResponse(
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

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def add_profile(payload: UserCreate):
    existing = db.get_user_by_username_or_email(payload.username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An ID or profile with username '{payload.username}' already exists."
        )

    user_dict = payload.model_dump()
    if not user_dict.get("membershipId"):
        user_dict["membershipId"] = payload.username

    created = db.create_user(user_dict)
    return UserResponse(
        id=created.get("id", ""),
        username=created.get("username", ""),
        name=created.get("name", ""),
        role=created.get("role", "Chartered Accountant"),
        email=created.get("email", ""),
        firm=created.get("firm", ""),
        frn=created.get("frn", ""),
        cop=created.get("cop", ""),
        membershipId=created.get("membershipId", ""),
        dscStatus=created.get("dscStatus", "Active"),
        status=created.get("status", "Active"),
        created_at=created.get("created_at", "")
    )

@router.put("/{identifier}", response_model=UserResponse)
def update_profile(identifier: str, payload: UserUpdate):
    user = db.get_user_by_username_or_email(identifier)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Profile '{identifier}' not found.")

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    updated = db.update_user(user.get("id", identifier), update_data)
    
    return UserResponse(
        id=updated.get("id", ""),
        username=updated.get("username", ""),
        name=updated.get("name", ""),
        role=updated.get("role", "Chartered Accountant"),
        email=updated.get("email", ""),
        firm=updated.get("firm", ""),
        frn=updated.get("frn", ""),
        cop=updated.get("cop", ""),
        membershipId=updated.get("membershipId", ""),
        dscStatus=updated.get("dscStatus", "Active"),
        status=updated.get("status", "Active"),
        created_at=updated.get("created_at", "")
    )

@router.delete("/{identifier}")
def delete_profile(identifier: str):
    user = db.get_user_by_username_or_email(identifier)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Profile '{identifier}' not found.")

    target_id = user.get("id", identifier)
    deleted = db.delete_user(target_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete profile.")

    return {
        "success": True,
        "message": f"Profile ID '{target_id}' ({user.get('name')}) successfully removed from database."
    }
