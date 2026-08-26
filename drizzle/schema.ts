import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** A separately protected shared-universe workspace. It never imports browser-local demo data automatically. */
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 96 }).notNull(),
  description: text("description"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("teams_slug_unique").on(table.slug),
  index("teams_creator_index").on(table.createdByUserId),
]);

/** Membership is scoped to a team; a global application role never grants team access. */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "writer"]).notNull(),
  defaultVisibility: mysqlEnum("defaultVisibility", ["private", "team", "restricted"]).default("private").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("team_members_team_user_unique").on(table.teamId, table.userId),
  index("team_members_user_index").on(table.userId),
  index("team_members_team_index").on(table.teamId),
]);

/** Invitation tokens are stored only as a SHA-256 hash; the raw copyable link token is never retained. */
export const teamInvitations = mysqlTable("team_invitations", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  inviteeEmail: varchar("inviteeEmail", { length: 320 }).notNull(),
  role: mysqlEnum("role", ["writer"]).default("writer").notNull(),
  defaultVisibility: mysqlEnum("defaultVisibility", ["private", "team", "restricted"]).default("private").notNull(),
  tokenHash: varchar("tokenHash", { length: 64 }).notNull(),
  invitedByUserId: int("invitedByUserId").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "revoked", "expired"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  acceptedAt: timestamp("acceptedAt"),
}, (table) => [
  uniqueIndex("team_invitations_token_hash_unique").on(table.tokenHash),
  index("team_invitations_team_status_index").on(table.teamId, table.status),
  index("team_invitations_email_index").on(table.inviteeEmail),
]);

export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TeamInvitation = typeof teamInvitations.$inferSelect;
