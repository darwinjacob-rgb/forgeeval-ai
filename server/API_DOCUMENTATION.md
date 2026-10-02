# ForgeEval REST API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 🔐 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /auth/register`
Register a new platform user.
- **Request Body**:
  ```json
  {
    "name": "Sarah Jenkins",
    "email": "sarah@forgeeval.com",
    "password": "Password123!",
    "role": "ADMIN" // "ADMIN" | "JUDGE" | "PARTICIPANT" | "ORGANIZER"
  }
  ```
- **Response** (`201 Created`):
  Sets `token` in HTTP-Only Cookie.
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "cm123abc...",
        "name": "Sarah Jenkins",
        "email": "sarah@forgeeval.com",
        "role": "ADMIN",
        "avatarUrl": null
      }
    }
  }
  ```

### `POST /auth/login`
Authenticate user with email and password.
- **Request Body**:
  ```json
  {
    "email": "dev@forgeeval.com",
    "password": "password123"
  }
  ```
- **Response** (`200 OK`):
  Sets `token` in HTTP-Only Cookie.

### `POST /auth/logout`
Clear authentication cookie.

### `GET /auth/me`
Fetch currently authenticated user details.

---

## 🎯 2. Problem Statement Endpoints (`/api/v1/problems`)

### `GET /problems`
List all hackathon problem statements.
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., `"Fintech & AI"`)
  - `difficulty` (optional): Filter by difficulty (`"EASY"`, `"MEDIUM"`, `"HARD"`, `"CRITICAL"`)
  - `search` (optional): Keyword search across title, description, and tags
  - `page`, `limit`: Pagination parameters

### `GET /problems/:id`
Get detailed problem statement including requirement specs and submission count.

### `POST /problems` *(Requires ADMIN or ORGANIZER)*
Create a new problem statement with evaluation rubrics and requirements.

---

## 🚀 3. Submissions Endpoints (`/api/v1/submissions`)

### `GET /submissions`
List all team submissions sorted by score or submission date.
- **Query Parameters**:
  - `problemId`: Filter submissions for specific problem
  - `sortBy`: `"scoreOverall"`, `"scoreAI"`, `"scoreSecurity"`, or `"createdAt"`

### `GET /submissions/:id`
Get single submission details with AI requirement mapping, security findings, and judge score history.

### `POST /submissions` *(Requires Authentication)*
Submit hackathon project repo & demo link for automated evaluation.
- **Request Body**:
  ```json
  {
    "title": "AegisShield — Real-time Fraud Engine",
    "description": "High-throughput transaction evaluation platform...",
    "repositoryUrl": "https://github.com/forgeeval/aegisshield-core",
    "demoUrl": "https://aegisshield.demo.forgeeval.dev",
    "teamName": "CyberPulse",
    "teamMembers": ["Elena Rostova", "Marcus Chen"],
    "problemId": "prob-1"
  }
  ```
- **Automatically Triggers**:
  1. AI Requirement Mapping Engine
  2. SAST Security & CVE Vulnerability Scanner
  3. Sandbox Runtime Execution Test Suite

---

## 🧠 4. Evaluation & Scanner Endpoints (`/api/v1/evaluations`)

### `POST /evaluations/:id/re-evaluate`
Re-trigger automated AI, security, and runtime pipeline for a submission.

### `GET /evaluations/:id/ai-details`
Fetch granular AI requirement mapping analysis and code quality metrics.

### `GET /evaluations/:id/security-report`
Fetch SAST findings, secret exposures, and CVE advisories.

### `GET /evaluations/:id/runtime-report`
Fetch automated latency, throughput, and memory test logs.

---

## ⚖️ 5. Judge Workspace Endpoints (`/api/v1/judge`)

### `POST /judge/evaluate` *(Requires JUDGE, ADMIN, or ORGANIZER)*
Submit manual score, innovation weight, presentation feedback, and rubric evaluation.
- **Request Body**:
  ```json
  {
    "submissionId": "sub-101",
    "scoreInnovation": 95,
    "scoreExecution": 92,
    "scorePresentation": 90,
    "scoreOverall": 92,
    "feedback": "Outstanding execution and clean architecture."
  }
  ```

---

## 📊 6. Leaderboard & Analytics (`/api/v1/leaderboard`)

### `GET /leaderboard`
Get real-time hackathon standings ranked by overall composite scores.

### `GET /leaderboard/dashboard-stats`
Get overall platform analytics: total problems, total submissions, security findings count, and score averages.
