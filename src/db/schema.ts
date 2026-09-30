import { mysqlTable, varchar, timestamp, boolean, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  organizationId: varchar('organization_id', { length: 36 }).notNull(),
  agencyId: varchar('agency_id', { length: 36 }),
  accountId: varchar('account_id', { length: 64 }),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).default('PENDING_ACTIVATION').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  failedLoginCount: int('failed_login_count').default(0).notNull(),
  photoUrl: varchar('photo_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const otps = mysqlTable('otps', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  code: varchar('code', { length: 10 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
