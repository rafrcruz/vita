import { sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  real,
  integer,
  date,
} from 'drizzle-orm/pg-core';

// Allowlist: e-mails autorizados a acessar a aplicação (ver data-model.md).
export const allowlist = pgTable(
  'allowlist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    role: text('role', { enum: ['admin', 'member'] })
      .notNull()
      .default('member'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    createdBy: text('created_by'),
  },
  (table) => [
    // Unicidade case-insensitive por e-mail.
    uniqueIndex('allowlist_email_lower_unique').on(sql`lower(${table.email})`),
  ]
);

export const weightLogs = pgTable('weight_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userEmail: text('user_email').notNull(),
  weight: real('weight').notNull(),
  loggedAt: timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const bloodPressureLogs = pgTable('blood_pressure_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userEmail: text('user_email').notNull(),
  systolic: integer('systolic').notNull(),
  diastolic: integer('diastolic').notNull(),
  loggedAt: timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Perfil do usuário: 1 linha por usuário (ver data-model.md). Campos opcionais.
export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userEmail: text('user_email').notNull(),
    fullName: text('full_name'),
    birthDate: date('birth_date'),
    heightCm: real('height_cm'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // No máximo um perfil por usuário (case-insensitive).
    uniqueIndex('user_profiles_email_lower_unique').on(sql`lower(${table.userEmail})`),
  ]
);

export type AllowlistRow = typeof allowlist.$inferSelect;
export type AllowlistInsert = typeof allowlist.$inferInsert;

export type WeightLogsRow = typeof weightLogs.$inferSelect;
export type WeightLogsInsert = typeof weightLogs.$inferInsert;

export type BloodPressureLogsRow = typeof bloodPressureLogs.$inferSelect;
export type BloodPressureLogsInsert = typeof bloodPressureLogs.$inferInsert;

export type UserProfilesRow = typeof userProfiles.$inferSelect;
export type UserProfilesInsert = typeof userProfiles.$inferInsert;
