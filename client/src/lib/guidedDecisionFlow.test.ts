import { describe, expect, it } from "vitest";
import { hasStoryDecision, proposalTitleFrom } from "./guidedDecisionFlow";

describe("guided decision flow helpers", () => {
  it("requires a meaningful story decision before continuing", () => {
    expect(hasStoryDecision("Short")).toBe(false);
    expect(hasStoryDecision("The tower has a hidden watcher.")).toBe(true);
  });

  it("keeps an entered title or derives a concise fallback title", () => {
    expect(proposalTitleFrom("The tower has a hidden watcher at night.", "Tower watcher")).toBe("Tower watcher");
    expect(proposalTitleFrom("The tower has a hidden watcher at night.", "")).toBe("The tower has a hidden watcher at night.");
  });
});
