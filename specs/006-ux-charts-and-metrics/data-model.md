# Data Model: UX, Charts, and Metrics Improvements

This document outlines the client-side data structures, format conversions, and validation logic required for the new keyboard birthdate field and the calculated analytics indicators.

---

## 1. Birthdate Data Formats

The birthdate field is stored in the database as a standard `YYYY-MM-DD` date string. The client-side UI will allow typing in the `DD/MM/YYYY` format.

| Context         | Format       | Example        | Description                                     |
| --------------- | ------------ | -------------- | ----------------------------------------------- |
| User Input (UI) | `DD/MM/YYYY` | `"13/02/1988"` | Input element value shown to the user.          |
| Database / API  | `YYYY-MM-DD` | `"1988-02-13"` | Serialized payload format validated by backend. |

### Zod Validation (Shared Schema)

The existing schema in `packages/shared/src/profile.ts` remains unchanged and enforces:

- Format: `/^\d{4}-\d{2}-\d{2}$/`
- Range: Year must be `>= 1900`
- Future check: Date must not be in the future.

### Conversion Logic

```typescript
/** Converts API date (YYYY-MM-DD) to Display date (DD/MM/YYYY) */
export function toDisplayDate(apiDate: string): string {
  if (!apiDate) return '';
  const parts = apiDate.split('-');
  if (parts.length !== 3) return apiDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/** Converts Display date (DD/MM/YYYY) to API date (YYYY-MM-DD) */
export function toApiDate(displayDate: string): string {
  if (!displayDate) return '';
  const parts = displayDate.split('/');
  if (parts.length !== 3) return displayDate;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}
```

---

## 2. Calculated Analytics Metrics

The metrics displayed below the charts are calculated on-the-fly in the frontend based on the complete fetched history (`timeframe = 'all'`).

### Weight Analytics Metrics

```typescript
interface WeightMetrics {
  lastMeasurement: {
    weight: number;
    loggedAt: Date;
  } | null;
  currentWeight: number | null; // Lowest weight of the latest day with data
  weeklyLossTotal: number | null; // Weekly average loss across the full period
  weeklyLoss30d: number | null; // Weekly average loss over the last 30 days
  weeklyLoss7d: number | null; // Weekly average loss over the last 7 days
}
```

### Blood Pressure Analytics Metrics

```typescript
interface BPMetrics {
  lastMeasurement: {
    systolic: number;
    diastolic: number;
    loggedAt: Date;
  } | null;
  avgSystolicTotal: number | null;
  avgDiastolicTotal: number | null;
  avgSystolic30d: number | null;
  avgDiastolic30d: number | null;
  avgSystolic7d: number | null;
  avgDiastolic7d: number | null;
}
```
