import { describe, expect, it } from "vitest";
import { canReadApprovedTeamCanon, canSubmitTeamCanon, createTeamSlug, hashInvitationToken, isInvitationActive, isTeamJoinRole, normalizeTeamEmail } from "./teamFoundation";

describe("team foundation privacy helpers", () => {
  it("normalizes invitation email comparisons", () => {
    expect(normalizeTeamEmail("  Writer@Example.COM ")).toBe("writer@example.com");
  });

  it("creates readable, distinct team slugs without trusting raw punctuation", () => {
    const slug = createTeamSlug("Neo Domain: Writers!");
    expect(slug).toMatch(/^neo-domain-writers-[a-f0-9]{8}$/);
  });

  it("allows only Writer and Watcher as member-request roles", () => {
    expect(isTeamJoinRole("writer")).toBe(true);
    expect(isTeamJoinRole("watcher")).toBe(true);
    expect(isTeamJoinRole("ruler")).toBe(false);
  });

  it("keeps Watchers read-only while allowing all members to read approved canon", () => {
    expect(canSubmitTeamCanon("owner")).toBe(true);
    expect(canSubmitTeamCanon("writer")).toBe(true);
    expect(canSubmitTeamCanon("watcher")).toBe(false);
    expect(canReadApprovedTeamCanon("watcher")).toBe(true);
  });

  it("hashes invitation tokens without retaining the raw token", () => {
    expect(hashInvitationToken("safe-token")).toMatch(/^[a-f0-9]{64}$/);
    expect(hashInvitationToken("safe-token")).toBe(hashInvitationToken("safe-token"));
  });

  it("accepts only pending, unexpired invitations", () => {
    const now = new Date("2026-08-26T00:00:00.000Z");
    expect(isInvitationActive("pending", new Date("2026-08-27T00:00:00.000Z"), now)).toBe(true);
    expect(isInvitationActive("accepted", new Date("2026-08-27T00:00:00.000Z"), now)).toBe(false);
    expect(isInvitationActive("pending", new Date("2026-08-25T00:00:00.000Z"), now)).toBe(false);
  });
});
