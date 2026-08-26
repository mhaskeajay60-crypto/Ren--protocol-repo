import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function unauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("private team router", () => {
  it("rejects an unauthenticated request before exposing any team data", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.team.mine()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects unauthenticated join requests and Ruler review attempts", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.team.requestJoin({ teamId: 1, requestedRole: "watcher", message: "Please let me read approved canon." })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.team.reviewJoinRequest({ teamId: 1, requestId: 1, decision: "approve" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects unauthenticated canon proposals and Ruler canon review attempts", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext());
    await expect(caller.team.proposeCanon({ teamId: 1, category: "lore", title: "The unseen watcher", decision: "The tower contains an unseen watcher.", context: "It supports the next gate scene." })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.team.reviewCanon({ teamId: 1, recordId: 1, decision: "approve" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
