# Data Model: Weight & Blood Pressure Tracking

This document specifies the database tables, validation rules, and schemas for weight and blood pressure logs.

---

## 1. Database Schema (PostgreSQL via Drizzle)

### Table: `weight_logs`

Stores the body weight measurements.

| Column Name  | Data Type                  | Constraints                                | Description                                                     |
| ------------ | -------------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `id`         | `uuid`                     | Primary Key, Default: `gen_random_uuid()`  | Unique identifier.                                              |
| `user_email` | `text`                     | Not Null, Foreign Key -> `allowlist.email` | The email of the owner user (retrieved via authentication sub). |
| `weight`     | `real`                     | Not Null                                   | The weight value in kilograms.                                  |
| `logged_at`  | `timestamp with time zone` | Not Null, Default: `now()`                 | The date and time the measurement belongs to.                   |
| `created_at` | `timestamp with time zone` | Not Null, Default: `now()`                 | Internal audit timestamp.                                       |

#### Drizzle Definition

```typescript
import { pgTable, uuid, text, timestamp, real } from 'drizzle-orm/pg-core';

export const weightLogs = pgTable('weight_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userEmail: text('user_email').notNull(),
  weight: real('weight').notNull(),
  loggedAt: timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### Table: `blood_pressure_logs`

Stores the blood pressure readings (systolic and diastolic pairs).

| Column Name  | Data Type                  | Constraints                                | Description                                   |
| ------------ | -------------------------- | ------------------------------------------ | --------------------------------------------- |
| `id`         | `uuid`                     | Primary Key, Default: `gen_random_uuid()`  | Unique identifier.                            |
| `user_email` | `text`                     | Not Null, Foreign Key -> `allowlist.email` | The email of the owner user.                  |
| `systolic`   | `integer`                  | Not Null                                   | Systolic pressure in mmHg.                    |
| `diastolic`  | `integer`                  | Not Null                                   | Diastolic pressure in mmHg.                   |
| `logged_at`  | `timestamp with time zone` | Not Null, Default: `now()`                 | The date and time the measurement belongs to. |
| `created_at` | `timestamp with time zone` | Not Null, Default: `now()`                 | Internal audit timestamp.                     |

#### Drizzle Definition

```typescript
export const bloodPressureLogs = pgTable('blood_pressure_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userEmail: text('user_email').notNull(),
  systolic: integer('systolic').notNull(),
  diastolic: integer('diastolic').notNull(),
  loggedAt: timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

## 2. Validation Schemas (Zod)

These Zod schemas reside in `packages/shared/src/` to be shared between frontend and backend.

### Weight Validation

```typescript
import { z } from 'zod';

export const weightLogInputSchema = z.object({
  weight: z
    .number()
    .min(20, { message: 'O peso mínimo é 20 kg.' })
    .max(350, { message: 'O peso máximo é 350 kg.' }),
  loggedAt: z.string().datetime({ message: 'Data inválida.' }).optional(),
});

export type WeightLogInput = z.infer<typeof weightLogInputSchema>;
```

### Blood Pressure Validation

```typescript
export const bpLogInputSchema = z.object({
  systolic: z
    .number()
    .int()
    .min(40, { message: 'A pressão sistólica mínima é 40 mmHg.' })
    .max(300, { message: 'A pressão sistólica máxima é 300 mmHg.' }),
  diastolic: z
    .number()
    .int()
    .min(30, { message: 'A pressão diastólica mínima é 30 mmHg.' })
    .max(200, { message: 'A pressão diastólica máxima é 200 mmHg.' }),
  loggedAt: z.string().datetime({ message: 'Data inválida.' }).optional(),
});

export type BPLogInput = z.infer<typeof bpLogInputSchema>;
```
