# 🏗️ BloodReach Architecture & Deployment Guide

This document outlines the final production-ready architecture for the **BloodReach** emergency blood coordination platform, detailing the integration between the Next.js frontend, Django backend, FastAPI matching engine, and Supabase database.

---

## 🏗️ 1. Architecture Overview

The system utilizes a resilient, tiered microservice architecture:

*   **Frontend (Next.js)**: Responsible purely for the user interface and Client-Side rendering. It delegates all business logic to the Django backend.
*   **Core Backend (Django + DRF)**: Acts as the primary API gateway and source of truth. Handles data validation, request persistence, and secure communication with external services.
*   **Matching Engine (FastAPI)**: A high-performance, asynchronous microservice dedicated to running complex PostGIS geospatial queries and managing the multi-phased notification escalation flow.
*   **Database (Supabase PostgreSQL)**: Centralized data store. Django models map directly to the Supabase schema using `managed = False`.
*   **Authentication (Clerk)**: Secures the API via JWT verification.

### 🔄 Emergency Flow:
1.  **User** submits an emergency request on the Next.js frontend.
2.  **Next.js API Route** attaches the user's Clerk JWT and forwards the request to Django (`POST /api/requests/`).
3.  **Django** authenticates the JWT, saves the `BloodRequest` to Supabase, and delegates the matching task to FastAPI via HTTP (`POST /match-donors`).
4.  **FastAPI** receives the coordinates, returns an immediate `202 Accepted`, and starts a `BackgroundTask`.
5.  **FastAPI Background Task** queries PostGIS for donors within 5km (Phase 1), 15km (Phase 2), and 25km (Phase 3).

---

## 🔒 2. Security & Environment Handling

All secrets are strictly managed via environment variables and are never committed to version control.

### Required Environment Variables:
**Django (`backend/.env`)**
*   `DATABASE_URL`: Connection string for Supabase PostgreSQL (use the pooler host in production).
*   `DJANGO_SECRET_KEY`: Your Django secret key.
*   `CLERK_SECRET_KEY`: Used to verify incoming JWTs.
*   `MATCHING_ENGINE_URL`: URL of the FastAPI service (e.g., `http://matching-engine:9000`).

**FastAPI (`matching-engine/.env`)**
*   `DATABASE_URL`: Connection string for Supabase PostgreSQL (PostGIS enabled).
*   `CORS_ORIGINS`: Allowed origins for cross-service communication.

**Next.js (`frontend/.env.local`)**
*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
*   `CLERK_SECRET_KEY`
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `BACKEND_URL`: URL of the Django backend.

---

## 🐳 3. Docker & Local Development

The entire stack is containerized for deterministic local development using `docker-compose.yml`.

### Running Locally
```bash
docker-compose up --build
```

### Services Exposed:
*   **Frontend**: `http://localhost:3000`
*   **Django Backend**: `http://localhost:8000`
*   **FastAPI Engine**: `http://localhost:9000`

---

## 🚀 4. Deployment Strategy

The architecture is designed to be easily deployable using PaaS providers:

1.  **Database (Supabase)**: Ensure you are using the **Connection Pooler** connection string (Port 6543) for the backend services.
2.  **Frontend (Vercel)**: Connect your GitHub repository to Vercel.
3.  **Django Backend (Render / Railway)**: Deploy using the `backend/Dockerfile`.
4.  **FastAPI Matching Engine (Render / Railway)**: Deploy using the `matching-engine/Dockerfile`.

---

## ✅ 5. End-to-End Verification Checklist

- [ ] **Database Connectivity**: Verify both Django and FastAPI can connect to Supabase.
- [ ] **Authentication**: Ensure unauthorized requests return `401`.
- [ ] **Request Creation**: Submit a new blood request via the frontend UI.
- [ ] **Data Persistence**: Verify the request appears in the Supabase `blood_requests` table.
- [ ] **Inter-service Communication**: Confirm Django triggers FastAPI.
- [ ] **Geospatial Matching**: Confirm FastAPI queries PostGIS.
- [ ] **Asynchronous Escalation**: Verify Phase 1, Phase 2, and Phase 3 notifications execute.
- [ ] **Graceful Degradation**: Verify system resilience if the matching engine is down.
