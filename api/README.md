# LebVentures FastAPI Backend

Standalone FastAPI server using DynamoDB + Cognito (already provisioned).

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

## Run locally

```bash
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Environment variables (`.env`)

| Variable | Value |
|----------|-------|
| `AWS_REGION` | `eu-central-1` |
| `COGNITO_POOL_ID` | `eu-central-1_4GSFe0c5l` |
| `COGNITO_CLIENT_ID` | `48b8eannue9n1qv2s4lcsssi8m` |
| `EVENTS_TABLE` | `lebventures-events` |
| `IMAGES_BUCKET` | `lebventures-images-242618236763` |
| `CORS_ORIGIN` | `https://lebventures.com` |

## Docker

```bash
docker build -t lebventures-api .
docker run -p 8000:8000 --env-file .env lebventures-api
```

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| GET | `/events` | Public |
| GET | `/events/{id}` | Public |
| POST | `/events` | Cognito JWT |
| PUT | `/events/{id}` | Cognito JWT |
| DELETE | `/events/{id}` | Cognito JWT |
| POST | `/upload-url` | Cognito JWT |
| GET | `/health` | Public |
