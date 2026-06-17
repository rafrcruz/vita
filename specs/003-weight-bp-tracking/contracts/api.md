# API Contracts: Weight & Blood Pressure Tracking

All endpoints require authentication via session cookie (`requireAuth` middleware) and return standard JSON formats.

---

## 1. Weight Log Endpoints

### `GET /api/metrics/weight`

Retrieve historical weight records for the authenticated user.

- **Query Parameters**:
  - `limit`: (Optional) Integer number of records to return.
  - `timeframe`: (Optional) `"7d"` | `"30d"` | `"all"`. Defaults to `"all"`.
- **Response**: `200 OK`

```json
[
  {
    "id": "c6204c6b-2877-4b8b-968b-59d4c7b8de4e",
    "weight": 82.5,
    "loggedAt": "2026-06-16T21:00:00.000Z"
  }
]
```

---

### `POST /api/metrics/weight`

Create a new weight record.

- **Request Body**:

```json
{
  "weight": 82.5,
  "loggedAt": "2026-06-16T21:00:00.000Z"
}
```

- **Response**: `201 Created`

```json
{
  "id": "c6204c6b-2877-4b8b-968b-59d4c7b8de4e",
  "weight": 82.5,
  "loggedAt": "2026-06-16T21:00:00.000Z"
}
```

- **Errors**:
  - `400 Bad Request` (Invalid decimal value, weight out of bounds `20-350`)
  - `401 Unauthorized` (Not authenticated)

---

### `PUT /api/metrics/weight/:id`

Update an existing weight record.

- **Request Body**:

```json
{
  "weight": 81.2,
  "loggedAt": "2026-06-16T20:30:00.000Z"
}
```

- **Response**: `200 OK`

```json
{
  "id": "c6204c6b-2877-4b8b-968b-59d4c7b8de4e",
  "weight": 81.2,
  "loggedAt": "2026-06-16T20:30:00.000Z"
}
```

- **Errors**:
  - `404 Not Found` (Record does not exist or does not belong to the user)

---

### `DELETE /api/metrics/weight/:id`

Delete an existing weight record.

- **Response**: `204 No Content`
- **Errors**:
  - `404 Not Found` (Record does not exist or does not belong to the user)

---

## 2. Blood Pressure Log Endpoints

### `GET /api/metrics/blood-pressure`

Retrieve historical blood pressure records for the authenticated user.

- **Query Parameters**:
  - `timeframe`: (Optional) `"7d"` | `"30d"` | `"all"`. Defaults to `"all"`.
- **Response**: `200 OK`

```json
[
  {
    "id": "40fe7da9-eb1b-4b13-8cfb-a7e82937ad92",
    "systolic": 120,
    "diastolic": 80,
    "loggedAt": "2026-06-16T21:00:00.000Z"
  }
]
```

---

### `POST /api/metrics/blood-pressure`

Create a new blood pressure record.

- **Request Body**:

```json
{
  "systolic": 120,
  "diastolic": 80,
  "loggedAt": "2026-06-16T21:00:00.000Z"
}
```

- **Response**: `201 Created`

```json
{
  "id": "40fe7da9-eb1b-4b13-8cfb-a7e82937ad92",
  "systolic": 120,
  "diastolic": 80,
  "loggedAt": "2026-06-16T21:00:00.000Z"
}
```

---

### `PUT /api/metrics/blood-pressure/:id`

Update an existing blood pressure record.

- **Request Body**:

```json
{
  "systolic": 118,
  "diastolic": 78,
  "loggedAt": "2026-06-16T20:30:00.000Z"
}
```

- **Response**: `200 OK`

---

### `DELETE /api/metrics/blood-pressure/:id`

Delete an existing blood pressure record.

- **Response**: `204 No Content`
