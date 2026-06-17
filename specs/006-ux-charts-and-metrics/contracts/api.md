# Interface Contracts: UX, Charts, and Metrics Improvements

No new REST API endpoints are introduced by this feature. This document outlines the contract definitions for the existing endpoints affected by data translation and formatting on the frontend.

---

## 1. User Profile API Contract

The birthdate text-mask on the frontend maps to the existing `/api/profile` endpoints.

### `GET /api/profile`
Retrieve the authenticated user's profile info.
* **Response Payload (JSON)**: `200 OK`
```json
{
  "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "fullName": "Rafael Cruz",
  "birthDate": "1988-02-13",
  "heightCm": 180,
  "createdAt": "2026-06-16T12:00:00.000Z",
  "updatedAt": "2026-06-17T14:00:00.000Z"
}
```

### `PUT /api/profile`
Update profile fields. All fields are optional.
* **Request Payload (JSON)**:
```json
{
  "fullName": "Rafael Cruz",
  "birthDate": "1988-02-13",
  "heightCm": 180
}
```
* **Response Payload (JSON)**: `200 OK`
```json
{
  "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "fullName": "Rafael Cruz",
  "birthDate": "1988-02-13",
  "heightCm": 180,
  "createdAt": "2026-06-16T12:00:00.000Z",
  "updatedAt": "2026-06-17T14:05:00.000Z"
}
```

---

## 2. Metrics History API Contract (Frontend Consumer Interface)

To calculate weekly loss rates and blood pressure averages on the frontend, the client always requests the complete historical log dataset from:
* `GET /api/metrics/weight?timeframe=all`
* `GET /api/metrics/blood-pressure?timeframe=all`
