# LebVentures Admin Panel — Deployment Guide

## Architecture

```
lebventures.com (Astro, hosted anywhere)
    ↕ REST API (HTTPS)
AWS API Gateway HTTP API
    ↕
AWS Lambda (Node.js 20, arm64)
    ↕              ↕
DynamoDB       S3 Bucket
(Events)       (Images/Trails)

Auth: AWS Cognito User Pool (admin-only, invite-only sign-up)
```

## Prerequisites

- [AWS CLI](https://aws.amazon.com/cli/) configured (`aws configure`)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed
- Node.js 20+

---

## Step 1 — Deploy the AWS backend

```bash
cd backend
npm install
sam build
sam deploy --guided
```

During `sam deploy --guided`, you'll be prompted for:
- **Stack name**: `lebventures-backend`
- **AWS Region**: choose your closest region (e.g. `eu-west-1`)
- **CorsOrigin**: `https://lebventures.com` (or `http://localhost:4321` for local dev)
- **AdminEmail**: your admin email address

At the end, SAM prints **Outputs** — copy these values.

---

## Step 2 — Create an admin user in Cognito

```bash
# Replace POOL_ID and EMAIL with your values from the SAM outputs
aws cognito-idp admin-create-user \
  --user-pool-id <UserPoolId> \
  --username <AdminEmail> \
  --temporary-password "TempPass1!" \
  --message-action SUPPRESS
```

The admin will be prompted to set a permanent password on first login.

---

## Step 3 — Configure the frontend

Copy `.env.example` to `.env` and fill in the SAM outputs:

```bash
cp .env.example .env
```

```env
PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com
PUBLIC_COGNITO_POOL_ID=eu-west-1_XXXXXXXXX
PUBLIC_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Step 4 — Build & deploy the frontend

```bash
npm run build
# Deploy the dist/ folder to your server as usual
```

---

## Admin Panel URLs

| Page | URL |
|------|-----|
| Login | `/admin` |
| Dashboard | `/admin/dashboard` |
| Create Event | `/admin/events/new` |
| Edit Event | `/admin/events/edit?id=ev-xxx` |

The admin panel is **excluded from the sitemap** and has `noindex, nofollow` meta tags.

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/events` | Public | List all events |
| GET | `/events/{id}` | Public | Get single event |
| POST | `/events` | Cognito JWT | Create event |
| PUT | `/events/{id}` | Cognito JWT | Update event |
| DELETE | `/events/{id}` | Cognito JWT | Delete event |
| POST | `/upload-url` | Cognito JWT | Get presigned S3 upload URL |

---

## Migrating demo data to DynamoDB

To seed DynamoDB with the existing demo events, run:

```bash
# Install jq first: https://jqlang.org
TABLE_NAME=lebventures-events
REGION=eu-west-1  # update to your region

# Fetch events from the running API (or adapt from events.ts)
aws dynamodb batch-write-item \
  --request-items file://seed-events.json \
  --region $REGION
```

Or just create them one-by-one via the admin panel.

---

## Updating the public site to use live data

Once `PUBLIC_API_URL` is set in `.env`, `src/data/events.ts` automatically
fetches from DynamoDB at **build time** (falls back to demo data if the API
is unreachable). Rebuild and redeploy the site after any change.

For **real-time** updates without rebuilding, consider adding a client-side
fetch in `Events.astro` or switching to Astro SSR with the Node adapter.
