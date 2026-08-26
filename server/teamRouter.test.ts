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
});
