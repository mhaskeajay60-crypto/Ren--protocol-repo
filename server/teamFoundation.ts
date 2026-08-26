import { createHash, randomBytes } from "node:crypto";

export const TEAM_MEMBER_LIMIT = 5;
export const TEAM_INVITATION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

export function normalizeTeamEmail(value: string) {
  return value.trim().toLowerCase();
}

export function createTeamSlug(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 76) || "team";
  return `${base}-${randomBytes(4).toString("hex")}`;
}

export function createInvitationToken() {
  return randomBytes(32).toString("hex");
}

export function hashInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isInvitationActive(status: string, expiresAt: Date, now = new Date()) {
  return status === "pending" && expiresAt.getTime() > now.getTime();
}
