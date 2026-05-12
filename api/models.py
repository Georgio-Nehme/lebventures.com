from typing import Optional, List, Literal
from pydantic import BaseModel, Field
from pydantic import ConfigDict
import uuid


# ── Events ────────────────────────────────────────────────────────────────────

class EventBase(BaseModel):
    model_config = ConfigDict(extra='allow')

    title: str
    type: str
    date: str
    location: str
    status: Optional[Literal['draft', 'published']] = 'published'
    coords: Optional[dict] = None
    difficulty: Optional[str] = None
    spots: Optional[int] = None
    spotsLeft: Optional[int] = None
    price: Optional[int] = None
    description: Optional[str] = None
    highlights: Optional[List[str]] = None
    guide: Optional[str] = None
    image: Optional[str] = None
    trailFile: Optional[str] = None
    featured: Optional[bool] = False
    region: Optional[str] = None
    time: Optional[str] = None
    duration: Optional[str] = None


class EventCreate(EventBase):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))


class EventUpdate(EventBase):
    model_config = ConfigDict(extra='allow')
    title: Optional[str] = None
    type: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None


class EventOut(EventBase):
    model_config = ConfigDict(extra='allow')
    id: str


# ── Subscriptions ─────────────────────────────────────────────────────────────

class SubscriptionCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    numberOfPeople: Optional[int] = 1
    notes: Optional[str] = None


class SubscriptionOut(SubscriptionCreate):
    id: str
    eventId: str
    registeredAt: str


# ── Reviews ───────────────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    authorName: str
    authorEmail: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    text: str
    eventTitle: Optional[str] = None


class ReviewStatusUpdate(BaseModel):
    status: Optional[Literal['approved', 'rejected', 'pending']] = None
    featured: Optional[bool] = None


class ReviewOut(ReviewCreate):
    id: str
    eventId: str
    status: str
    featured: bool
    submittedAt: str


# ── Contact ───────────────────────────────────────────────────────────────────

class ContactCreate(BaseModel):
    name: str
    email: str
    adventure: Optional[str] = None
    message: Optional[str] = None


class ContactOut(ContactCreate):
    id: str
    submittedAt: str
    read: bool = False


# ── Upload ────────────────────────────────────────────────────────────────────

class UploadUrlRequest(BaseModel):
    filename: str
    contentType: str


class UploadUrlResponse(BaseModel):
    uploadUrl: str
    publicUrl: str

