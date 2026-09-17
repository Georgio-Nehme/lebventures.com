import os
import boto3
from decimal import Decimal
from datetime import datetime, timezone
from dotenv import load_dotenv

import content_schema

load_dotenv()

REGION        = os.getenv("AWS_REGION", "eu-central-1")
EVENTS_TABLE   = os.getenv("EVENTS_TABLE",   "lebventures-events")
SUBS_TABLE     = os.getenv("SUBS_TABLE",     "lebventures-subscriptions")
REVIEWS_TABLE  = os.getenv("REVIEWS_TABLE",  "lebventures-reviews")
CONTACTS_TABLE = os.getenv("CONTACTS_TABLE", "lebventures-contacts")
CONTENT_TABLE  = os.getenv("CONTENT_TABLE",  "lebventures-content")
IMAGES_BUCKET  = os.getenv("IMAGES_BUCKET")

_dynamodb = boto3.resource("dynamodb", region_name=REGION)
_ddb_client = boto3.client("dynamodb", region_name=REGION)
_s3       = boto3.client("s3", region_name=REGION)

events_table   = _dynamodb.Table(EVENTS_TABLE)
subs_table     = _dynamodb.Table(SUBS_TABLE)
reviews_table  = _dynamodb.Table(REVIEWS_TABLE)
contacts_table = _dynamodb.Table(CONTACTS_TABLE)
content_table  = _dynamodb.Table(CONTENT_TABLE)
s3_client      = _s3


def floats_to_decimal(obj):
    """Recursively convert floats to Decimal so DynamoDB accepts them."""
    if isinstance(obj, float):
        return Decimal(str(obj))
    if isinstance(obj, dict):
        return {k: floats_to_decimal(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [floats_to_decimal(i) for i in obj]
    return obj


def seed_content():
    """Insert a row for every schema key that doesn't have one yet, set to its default."""
    resp = content_table.scan(ProjectionExpression="#k", ExpressionAttributeNames={"#k": "key"})
    existing_keys = {item["key"] for item in resp.get("Items", [])}
    now = datetime.now(timezone.utc).isoformat()
    for key, default in content_schema.DEFAULTS.items():
        if key not in existing_keys:
            content_table.put_item(Item={"key": key, "value": default, "updatedAt": now})


def ensure_tables():
    """Create subscriptions and reviews tables if they don't exist."""
    existing = set(_ddb_client.list_tables()["TableNames"])

    if SUBS_TABLE not in existing:
        _ddb_client.create_table(
            TableName=SUBS_TABLE,
            BillingMode="PAY_PER_REQUEST",
            AttributeDefinitions=[
                {"AttributeName": "id",      "AttributeType": "S"},
                {"AttributeName": "eventId", "AttributeType": "S"},
            ],
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
            GlobalSecondaryIndexes=[{
                "IndexName": "eventId-index",
                "KeySchema": [{"AttributeName": "eventId", "KeyType": "HASH"}],
                "Projection": {"ProjectionType": "ALL"},
            }],
        )
        print(f"✅  Created table {SUBS_TABLE}")

    if REVIEWS_TABLE not in existing:
        _ddb_client.create_table(
            TableName=REVIEWS_TABLE,
            BillingMode="PAY_PER_REQUEST",
            AttributeDefinitions=[
                {"AttributeName": "id",      "AttributeType": "S"},
                {"AttributeName": "eventId", "AttributeType": "S"},
                {"AttributeName": "status",  "AttributeType": "S"},
            ],
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
            GlobalSecondaryIndexes=[
                {
                    "IndexName": "eventId-index",
                    "KeySchema": [{"AttributeName": "eventId", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                },
                {
                    "IndexName": "status-index",
                    "KeySchema": [{"AttributeName": "status", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                },
            ],
        )
        print(f"✅  Created table {REVIEWS_TABLE}")

    if CONTACTS_TABLE not in existing:
        _ddb_client.create_table(
            TableName=CONTACTS_TABLE,
            BillingMode="PAY_PER_REQUEST",
            AttributeDefinitions=[
                {"AttributeName": "id", "AttributeType": "S"},
            ],
            KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
        )
        print(f"✅  Created table {CONTACTS_TABLE}")

    if CONTENT_TABLE not in existing:
        _ddb_client.create_table(
            TableName=CONTENT_TABLE,
            BillingMode="PAY_PER_REQUEST",
            AttributeDefinitions=[
                {"AttributeName": "key", "AttributeType": "S"},
            ],
            KeySchema=[{"AttributeName": "key", "KeyType": "HASH"}],
        )
        print(f"✅  Created table {CONTENT_TABLE}")
        try:
            _ddb_client.get_waiter("table_exists").wait(TableName=CONTENT_TABLE)
        except Exception as e:
            print(f"⚠️  Waiter for {CONTENT_TABLE} failed: {e}")

    try:
        seed_content()
    except Exception as e:
        print(f"⚠️  Failed to seed content table: {e}")

    if IMAGES_BUCKET:
        cors_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
        if cors_origins:
            _s3.put_bucket_cors(
                Bucket=IMAGES_BUCKET,
                CORSConfiguration={
                    "CORSRules": [{
                        "AllowedHeaders": ["*"],
                        "AllowedMethods": ["GET", "PUT", "HEAD"],
                        "AllowedOrigins": cors_origins,
                        "ExposeHeaders": ["ETag"],
                        "MaxAgeSeconds": 3000,
                    }]
                },
            )
            print(f"✅  S3 CORS set for {IMAGES_BUCKET}")

