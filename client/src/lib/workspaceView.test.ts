import { describe, expect, it } from "vitest";
import { normalizeWorkspaceView, workspaceViewLabel } from "./workspaceView";

describe("workspace view preference", () => {
  it("uses Auto when a saved preference is absent or unsupported", () => {
    expect(normalizeWorkspaceView()).toBe("auto");
    expect(normalizeWorkspaceView("wide-screen")).toBe("auto");
  });

  it("accepts the supported local workspace views", () => {
    expect(normalizeWorkspaceView("PHONE")).toBe("phone");
    expect(normalizeWorkspaceView("desktop")).toBe("desktop");
    expect(workspaceViewLabel("phone")).toBe("Phone");
    expect(workspaceViewLabel("desktop")).toBe("Desktop tools");
  });
});
