import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr
from dotenv import load_dotenv

from auth import verify_token
from database import (
    events_table, subs_table, reviews_table,
    s3_client, IMAGES_BUCKET, REGION, ensure_tables, floats_to_decimal,
)
from models import (
    EventCreate, EventUpdate, EventOut,
    SubscriptionCreate, SubscriptionOut,
    ReviewCreate, ReviewStatusUpdate, ReviewOut,
    UploadUrlRequest, UploadUrlResponse,
)

load_dotenv()

_cors_env = os.getenv("CORS_ORIGINS", "*")
CORS_ORIGINS = [o.strip() for o in _cors_env.split(",")] if _cors_env != "*" else ["*"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_tables()
    yield

app = FastAPI(title="LebVentures API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

now_iso = lambda: datetime.now(timezone.utc).isoformat()


# ═══════════════════════════════════════════════════════════════
#  EVENTS
# ═══════════════════════════════════════════════════════════════

@app.get("/events", response_model=List[EventOut])
def list_events(status: Optional[str] = Query(None)):
    """Public: returns published events. Admin can pass ?status=draft or ?status=all."""
    resp = events_table.scan()
    items = resp.get("Items", [])
    if status == "all":
        return items
    if status == "draft":
        return [i for i in items if i.get("status") == "draft"]
    # default: published only (public)
    return [i for i in items if i.get("status", "published") == "published"]


@app.get("/events/{event_id}", response_model=EventOut)
def get_event(event_id: str):
    item = events_table.get_item(Key={"id": event_id}).get("Item")
    if not item:
        raise HTTPException(status_code=404, detail="Event not found")
    return item


@app.post("/events", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(body: EventCreate, _=Depends(verify_token)):
    if not body.id:
        body.id = str(uuid.uuid4())
    item = floats_to_decimal(body.model_dump(exclude_none=True))
    item.setdefault("status", "draft")
    item.setdefault("createdAt", now_iso())
    events_table.put_item(Item=item)
    return item


@app.put("/events/{event_id}", response_model=EventOut)
def update_event(event_id: str, body: EventUpdate, _=Depends(verify_token)):
    existing = events_table.get_item(Key={"id": event_id}).get("Item")
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    updates = floats_to_decimal(body.model_dump(exclude_none=True))
    if not updates:
        return existing
    expr_parts, names, values = [], {}, {}
    for k, v in updates.items():
        nk, vk = f"#f_{k}", f":v_{k}"
        expr_parts.append(f"{nk} = {vk}")
        names[nk] = k
        values[vk] = v
    events_table.update_item(
        Key={"id": event_id},
        UpdateExpression="SET " + ", ".join(expr_parts),
        ExpressionAttributeNames=names,
        ExpressionAttributeValues=values,
    )
    return {**existing, **updates, "id": event_id}


@app.patch("/events/{event_id}/publish", response_model=EventOut)
def publish_event(event_id: str, _=Depends(verify_token)):
    existing = events_table.get_item(Key={"id": event_id}).get("Item")
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    events_table.update_item(
        Key={"id": event_id},
        UpdateExpression="SET #s = :s",
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={":s": "published"},
    )
    return {**existing, "status": "published"}


@app.patch("/events/{event_id}/unpublish", response_model=EventOut)
def unpublish_event(event_id: str, _=Depends(verify_token)):
    existing = events_table.get_item(Key={"id": event_id}).get("Item")
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    events_table.update_item(
        Key={"id": event_id},
        UpdateExpression="SET #s = :s",
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={":s": "draft"},
    )
    return {**existing, "status": "draft"}


@app.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: str, _=Depends(verify_token)):
    existing = events_table.get_item(Key={"id": event_id}).get("Item")
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    image_url = existing.get("image", "")
    if image_url and IMAGES_BUCKET and IMAGES_BUCKET in image_url:
        key = image_url.split(f"{IMAGES_BUCKET}.s3.{REGION}.amazonaws.com/")[-1]
        try:
            s3_client.delete_object(Bucket=IMAGES_BUCKET, Key=key)
        except ClientError:
            pass
    events_table.delete_item(Key={"id": event_id})


# ═══════════════════════════════════════════════════════════════
#  SUBSCRIPTIONS
# ═══════════════════════════════════════════════════════════════

@app.post("/events/{event_id}/subscribe", response_model=SubscriptionOut, status_code=201)
def subscribe(event_id: str, body: SubscriptionCreate):
    """Public: anyone can register interest in an event."""
    event = events_table.get_item(Key={"id": event_id}).get("Item")
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    item = {
        "id": str(uuid.uuid4()),
        "eventId": event_id,
        "registeredAt": now_iso(),
        **body.model_dump(exclude_none=True),
    }
    subs_table.put_item(Item=item)
    return item


@app.get("/events/{event_id}/subscriptions", response_model=List[SubscriptionOut])
def list_subscriptions(event_id: str, _=Depends(verify_token)):
    """Admin: list all subscribers for an event."""
    resp = subs_table.query(
        IndexName="eventId-index",
        KeyConditionExpression=Key("eventId").eq(event_id),
    )
    return resp.get("Items", [])


@app.delete("/subscriptions/{sub_id}", status_code=204)
def delete_subscription(sub_id: str, _=Depends(verify_token)):
    subs_table.delete_item(Key={"id": sub_id})


# ═══════════════════════════════════════════════════════════════
#  REVIEWS
# ═══════════════════════════════════════════════════════════════

@app.post("/events/{event_id}/reviews", response_model=ReviewOut, status_code=201)
def submit_review(event_id: str, body: ReviewCreate):
    """Public: anyone can submit a review — starts as pending."""
    event = events_table.get_item(Key={"id": event_id}).get("Item")
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    item = {
        "id": str(uuid.uuid4()),
        "eventId": event_id,
        "status": "pending",
        "featured": False,
        "submittedAt": now_iso(),
        "eventTitle": event.get("title", ""),
        **body.model_dump(exclude_none=True),
    }
    reviews_table.put_item(Item=item)
    return item


@app.get("/reviews", response_model=List[ReviewOut])
def list_all_reviews(
    status: Optional[str] = Query(None),
    _=Depends(verify_token),
):
    """Admin: list all reviews, optionally filtered by status."""
    if status and status in ("pending", "approved", "rejected"):
        resp = reviews_table.query(
            IndexName="status-index",
            KeyConditionExpression=Key("status").eq(status),
        )
    else:
        resp = reviews_table.scan()
    return resp.get("Items", [])


@app.get("/events/{event_id}/reviews/public", response_model=List[ReviewOut])
def list_event_reviews_public(event_id: str):
    """Public: approved reviews for a specific past event."""
    resp = reviews_table.query(
        IndexName="eventId-index",
        KeyConditionExpression=Key("eventId").eq(event_id),
    )
    return [r for r in resp.get("Items", []) if r.get("status") == "approved"]


@app.get("/reviews/featured", response_model=List[ReviewOut])
def list_featured_reviews():
    """Public: approved and featured reviews for the homepage."""
    resp = reviews_table.scan(
        FilterExpression=Attr("featured").eq(True) & Attr("status").eq("approved"),
    )
    return resp.get("Items", [])


@app.get("/events/{event_id}/reviews", response_model=List[ReviewOut])
def list_event_reviews(event_id: str, _=Depends(verify_token)):
    """Admin: reviews for a specific event."""
    resp = reviews_table.query(
        IndexName="eventId-index",
        KeyConditionExpression=Key("eventId").eq(event_id),
    )
    return resp.get("Items", [])


@app.patch("/reviews/{review_id}", response_model=ReviewOut)
def update_review_status(review_id: str, body: ReviewStatusUpdate, _=Depends(verify_token)):
    """Admin: approve / reject / feature a review."""
    existing = reviews_table.get_item(Key={"id": review_id}).get("Item")
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")
    updates = body.model_dump(exclude_none=True)
    expr_parts, names, values = [], {}, {}
    for k, v in updates.items():
        nk, vk = f"#f_{k}", f":v_{k}"
        expr_parts.append(f"{nk} = {vk}")
        names[nk] = k
        values[vk] = v
    reviews_table.update_item(
        Key={"id": review_id},
        UpdateExpression="SET " + ", ".join(expr_parts),
        ExpressionAttributeNames=names,
        ExpressionAttributeValues=values,
    )
    return {**existing, **updates}


@app.delete("/reviews/{review_id}", status_code=204)
def delete_review(review_id: str, _=Depends(verify_token)):
    reviews_table.delete_item(Key={"id": review_id})


# ═══════════════════════════════════════════════════════════════
#  UPLOAD
# ═══════════════════════════════════════════════════════════════

@app.post("/upload-url", response_model=UploadUrlResponse)
def get_upload_url(body: UploadUrlRequest, _=Depends(verify_token)):
    if not IMAGES_BUCKET:
        raise HTTPException(status_code=500, detail="S3 bucket not configured")
    key = f"events/{uuid.uuid4()}/{body.filename}"
    upload_url = s3_client.generate_presigned_url(
        "put_object",
        Params={"Bucket": IMAGES_BUCKET, "Key": key, "ContentType": body.contentType},
        ExpiresIn=300,
    )
    public_url = f"https://{IMAGES_BUCKET}.s3.{REGION}.amazonaws.com/{key}"
    return UploadUrlResponse(uploadUrl=upload_url, publicUrl=public_url)


# ═══════════════════════════════════════════════════════════════
#  HEALTH
# ═══════════════════════════════════════════════════════════════

@app.get("/health")
def health():
    return {"status": "ok"}
