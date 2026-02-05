from __future__ import annotations

from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    status: str = "new"
    notes: Optional[str] = None


class ContactUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ContactResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    email: Optional[str]
    phone: Optional[str]
    company: Optional[str]
    job_title: Optional[str]
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
