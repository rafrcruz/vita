import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

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

export type AllowlistRow = typeof allowlist.$inferSelect;
export type AllowlistInsert = typeof allowlist.$inferInsert;
