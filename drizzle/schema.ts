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
  role: mysqlEnum("role", ["owner", "writer", "watcher"]).notNull(),
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

/** A signed-in person can request membership; only the team Ruler may approve or reject it. */
export const teamJoinRequests = mysqlTable("team_join_requests", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  requesterUserId: int("requesterUserId").notNull(),
  requestedRole: mysqlEnum("requestedRole", ["writer", "watcher"]).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "withdrawn"]).default("pending").notNull(),
  reviewedByUserId: int("reviewedByUserId"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("team_join_requests_team_status_index").on(table.teamId, table.status),
  index("team_join_requests_requester_index").on(table.requesterUserId),
]);

/** Deliberately submitted group decisions. Browser-local chapters and Story Vault material are never copied here automatically. */
export const teamCanonRecords = mysqlTable("team_canon_records", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  category: mysqlEnum("category", ["character", "world_rule", "location", "lore", "plot", "other"]).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  decision: text("decision").notNull(),
  context: text("context"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  proposedByUserId: int("proposedByUserId").notNull(),
  reviewedByUserId: int("reviewedByUserId"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("team_canon_records_team_status_index").on(table.teamId, table.status),
  index("team_canon_records_proposer_index").on(table.proposedByUserId),
]);

export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type TeamJoinRequest = typeof teamJoinRequests.$inferSelect;
export type TeamCanonRecord = typeof teamCanonRecords.$inferSelect;
