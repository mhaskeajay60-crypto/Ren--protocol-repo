import { and, count, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, teamCanonRecords, teamInvitations, teamJoinRequests, teamMembers, teams, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

async function requiredDb() {
  const db = await getDb();
  if (!db) throw new Error("The private team workspace database is unavailable.");
  return db;
}

export async function listTeamsForUser(userId: number) {
  const db = await requiredDb();
  return db.select({ team: teams, membership: teamMembers })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teamMembers.userId, userId));
}

export async function getTeamMembership(teamId: number, userId: number) {
  const db = await requiredDb();
  const result = await db.select().from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)))
    .limit(1);
  return result[0];
}

export async function getTeamById(teamId: number) {
  const db = await requiredDb();
  const result = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);
  return result[0];
}

export async function createTeamWithOwner(input: { name: string; slug: string; description: string; ownerUserId: number }) {
  const db = await requiredDb();
  return db.transaction(async (tx) => {
    const [created] = await tx.insert(teams).values({
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      createdByUserId: input.ownerUserId,
    });
    const teamId = Number(created.insertId);
    await tx.insert(teamMembers).values({
      teamId,
      userId: input.ownerUserId,
      role: "owner",
      defaultVisibility: "private",
    });
    return teamId;
  });
}

export async function listTeamMembers(teamId: number) {
  const db = await requiredDb();
  return db.select({
    id: teamMembers.id,
    userId: teamMembers.userId,
    role: teamMembers.role,
    defaultVisibility: teamMembers.defaultVisibility,
    joinedAt: teamMembers.joinedAt,
    name: users.name,
    email: users.email,
  }).from(teamMembers).innerJoin(users, eq(teamMembers.userId, users.id)).where(eq(teamMembers.teamId, teamId));
}

export async function listTeamInvitations(teamId: number) {
  const db = await requiredDb();
  return db.select().from(teamInvitations).where(eq(teamInvitations.teamId, teamId));
}

export async function listTeamJoinRequests(teamId: number) {
  const db = await requiredDb();
  return db.select({
    id: teamJoinRequests.id,
    teamId: teamJoinRequests.teamId,
    requesterUserId: teamJoinRequests.requesterUserId,
    requestedRole: teamJoinRequests.requestedRole,
    message: teamJoinRequests.message,
    status: teamJoinRequests.status,
    createdAt: teamJoinRequests.createdAt,
    reviewedAt: teamJoinRequests.reviewedAt,
    name: users.name,
    email: users.email,
  }).from(teamJoinRequests).innerJoin(users, eq(teamJoinRequests.requesterUserId, users.id))
    .where(eq(teamJoinRequests.teamId, teamId));
}

export async function listTeamJoinRequestsForUser(userId: number) {
  const db = await requiredDb();
  return db.select({ request: teamJoinRequests, team: teams })
    .from(teamJoinRequests).innerJoin(teams, eq(teamJoinRequests.teamId, teams.id))
    .where(eq(teamJoinRequests.requesterUserId, userId));
}

export async function getPendingTeamJoinRequest(teamId: number, requesterUserId: number) {
  const db = await requiredDb();
  const result = await db.select().from(teamJoinRequests)
    .where(and(eq(teamJoinRequests.teamId, teamId), eq(teamJoinRequests.requesterUserId, requesterUserId), eq(teamJoinRequests.status, "pending")))
    .limit(1);
  return result[0];
}

export async function getTeamJoinRequestById(requestId: number, teamId: number) {
  const db = await requiredDb();
  const result = await db.select().from(teamJoinRequests)
    .where(and(eq(teamJoinRequests.id, requestId), eq(teamJoinRequests.teamId, teamId)))
    .limit(1);
  return result[0];
}

export async function getTeamInvitationByTokenHash(tokenHash: string) {
  const db = await requiredDb();
  const result = await db.select().from(teamInvitations).where(eq(teamInvitations.tokenHash, tokenHash)).limit(1);
  return result[0];
}

export async function getTeamSeatUsage(teamId: number) {
  const db = await requiredDb();
  const now = new Date();
  const members = await db.select({ total: count() }).from(teamMembers).where(eq(teamMembers.teamId, teamId));
  const pending = await db.select({ total: count() }).from(teamInvitations)
    .where(and(eq(teamInvitations.teamId, teamId), eq(teamInvitations.status, "pending"), gt(teamInvitations.expiresAt, now)));
  const requested = await db.select({ total: count() }).from(teamJoinRequests)
    .where(and(eq(teamJoinRequests.teamId, teamId), eq(teamJoinRequests.status, "pending")));
  return Number(members[0]?.total || 0) + Number(pending[0]?.total || 0) + Number(requested[0]?.total || 0);
}

export async function createTeamJoinRequest(input: { teamId: number; requesterUserId: number; requestedRole: "writer" | "watcher"; message: string }) {
  const db = await requiredDb();
  const [created] = await db.insert(teamJoinRequests).values({
    teamId: input.teamId,
    requesterUserId: input.requesterUserId,
    requestedRole: input.requestedRole,
    message: input.message || null,
    status: "pending",
  });
  return Number(created.insertId);
}

export async function approveTeamJoinRequest(input: { requestId: number; teamId: number; rulerUserId: number }) {
  const db = await requiredDb();
  return db.transaction(async (tx) => {
    const request = await tx.select().from(teamJoinRequests)
      .where(and(eq(teamJoinRequests.id, input.requestId), eq(teamJoinRequests.teamId, input.teamId), eq(teamJoinRequests.status, "pending")))
      .limit(1);
    const pendingRequest = request[0];
    if (!pendingRequest) throw new Error("This join request is no longer pending.");
    await tx.insert(teamMembers).values({
      teamId: input.teamId,
      userId: pendingRequest.requesterUserId,
      role: pendingRequest.requestedRole,
      defaultVisibility: "private",
    }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
    await tx.update(teamJoinRequests).set({ status: "approved", reviewedByUserId: input.rulerUserId, reviewedAt: new Date() })
      .where(eq(teamJoinRequests.id, input.requestId));
    return pendingRequest;
  });
}

export async function rejectTeamJoinRequest(input: { requestId: number; teamId: number; rulerUserId: number }) {
  const db = await requiredDb();
  await db.update(teamJoinRequests).set({ status: "rejected", reviewedByUserId: input.rulerUserId, reviewedAt: new Date() })
    .where(and(eq(teamJoinRequests.id, input.requestId), eq(teamJoinRequests.teamId, input.teamId), eq(teamJoinRequests.status, "pending")));
}

export async function listApprovedTeamCanon(teamId: number) {
  const db = await requiredDb();
  return db.select({
    id: teamCanonRecords.id,
    category: teamCanonRecords.category,
    title: teamCanonRecords.title,
    decision: teamCanonRecords.decision,
    context: teamCanonRecords.context,
    status: teamCanonRecords.status,
    createdAt: teamCanonRecords.createdAt,
    reviewedAt: teamCanonRecords.reviewedAt,
    proposerName: users.name,
  }).from(teamCanonRecords).innerJoin(users, eq(teamCanonRecords.proposedByUserId, users.id))
    .where(and(eq(teamCanonRecords.teamId, teamId), eq(teamCanonRecords.status, "approved")));
}

export async function listTeamCanonForRuler(teamId: number) {
  const db = await requiredDb();
  return db.select({
    id: teamCanonRecords.id,
    category: teamCanonRecords.category,
    title: teamCanonRecords.title,
    decision: teamCanonRecords.decision,
    context: teamCanonRecords.context,
    status: teamCanonRecords.status,
    proposedByUserId: teamCanonRecords.proposedByUserId,
    reviewedAt: teamCanonRecords.reviewedAt,
    createdAt: teamCanonRecords.createdAt,
    proposerName: users.name,
    proposerEmail: users.email,
  }).from(teamCanonRecords).innerJoin(users, eq(teamCanonRecords.proposedByUserId, users.id))
    .where(eq(teamCanonRecords.teamId, teamId));
}

export async function listTeamCanonForProposer(teamId: number, userId: number) {
  const db = await requiredDb();
  return db.select().from(teamCanonRecords)
    .where(and(eq(teamCanonRecords.teamId, teamId), eq(teamCanonRecords.proposedByUserId, userId)));
}

export async function getTeamCanonRecord(recordId: number, teamId: number) {
  const db = await requiredDb();
  const result = await db.select().from(teamCanonRecords)
    .where(and(eq(teamCanonRecords.id, recordId), eq(teamCanonRecords.teamId, teamId))).limit(1);
  return result[0];
}

export async function createTeamCanonProposal(input: { teamId: number; category: "character" | "world_rule" | "location" | "lore" | "plot" | "other"; title: string; decision: string; context: string; proposedByUserId: number }) {
  const db = await requiredDb();
  const [created] = await db.insert(teamCanonRecords).values({
    teamId: input.teamId,
    category: input.category,
    title: input.title,
    decision: input.decision,
    context: input.context || null,
    status: "pending",
    proposedByUserId: input.proposedByUserId,
  });
  return Number(created.insertId);
}

export async function reviewTeamCanonProposal(input: { recordId: number; teamId: number; rulerUserId: number; decision: "approve" | "reject" }) {
  const db = await requiredDb();
  const status = input.decision === "approve" ? "approved" : "rejected";
  await db.update(teamCanonRecords).set({ status, reviewedByUserId: input.rulerUserId, reviewedAt: new Date() })
    .where(and(eq(teamCanonRecords.id, input.recordId), eq(teamCanonRecords.teamId, input.teamId), eq(teamCanonRecords.status, "pending")));
}

export async function createTeamInvitation(input: {
  teamId: number;
  inviteeEmail: string;
  tokenHash: string;
  invitedByUserId: number;
  expiresAt: Date;
}) {
  const db = await requiredDb();
  const [created] = await db.insert(teamInvitations).values({
    teamId: input.teamId,
    inviteeEmail: input.inviteeEmail,
    role: "writer",
    defaultVisibility: "private",
    tokenHash: input.tokenHash,
    invitedByUserId: input.invitedByUserId,
    status: "pending",
    expiresAt: input.expiresAt,
  });
  return Number(created.insertId);
}

export async function acceptTeamInvitation(input: { invitationId: number; teamId: number; userId: number; defaultVisibility: "private" | "team" | "restricted" }) {
  const db = await requiredDb();
  return db.transaction(async (tx) => {
    await tx.insert(teamMembers).values({
      teamId: input.teamId,
      userId: input.userId,
      role: "writer",
      defaultVisibility: input.defaultVisibility,
    }).onDuplicateKeyUpdate({ set: { defaultVisibility: input.defaultVisibility, updatedAt: new Date() } });
    await tx.update(teamInvitations).set({ status: "accepted", acceptedAt: new Date() }).where(eq(teamInvitations.id, input.invitationId));
  });
}

export async function revokeTeamInvitation(invitationId: number, teamId: number) {
  const db = await requiredDb();
  await db.update(teamInvitations).set({ status: "revoked" })
    .where(and(eq(teamInvitations.id, invitationId), eq(teamInvitations.teamId, teamId)));
}
