from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.contact import Contact
from schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from routes.auth import get_current_user

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.get("/", response_model=List[ContactResponse])
def list_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Contact).filter(Contact.user_id == current_user.id).order_by(Contact.created_at.desc()).all()


@router.post("/", response_model=ContactResponse, status_code=201)
def create_contact(
    data: ContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = Contact(**data.model_dump(), user_id=current_user.id)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = (
        db.query(Contact)
        .filter(Contact.id == contact_id, Contact.user_id == current_user.id)
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Contact introuvable")
    return contact


@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    data: ContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = (
        db.query(Contact)
        .filter(Contact.id == contact_id, Contact.user_id == current_user.id)
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Contact introuvable")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(contact, key, value)

    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{contact_id}")
def delete_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = (
        db.query(Contact)
        .filter(Contact.id == contact_id, Contact.user_id == current_user.id)
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Contact introuvable")

    db.delete(contact)
    db.commit()
    return {"message": "Contact supprime"}
