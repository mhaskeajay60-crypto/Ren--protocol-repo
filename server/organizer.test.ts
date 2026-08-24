import { describe, expect, it } from "vitest";
import { parseComposerResponse, parseConsistencyResponse, parseOrganizerResponse, parseRewriteResponse } from "./routers";

describe("Brain Dump organizer response validation", () => {
  it("accepts a complete structured suggestion", () => {
    const result = parseOrganizerResponse(JSON.stringify({
      summary: "One potential character and one plot thread were identified.",
      items: [{
        type: "character",
        category: "Character",
        tags: ["protagonist", "cartography"],
        title: "Aren Vale",
        description: "A threshold cartographer mentioned in the material.",
        role: "Cartographer",
        status: "Active",
        stage: "",
        pov: "",
        linked: "Ember Gate",
      }],
    }));

    expect(result.items[0]?.title).toBe("Aren Vale");
    expect(result.items[0]?.type).toBe("character");
  });

  it("rejects a suggestion that lacks required review fields", () => {
    expect(() => parseOrganizerResponse(JSON.stringify({ summary: "Incomplete", items: [{ type: "note", title: "Loose idea" }] }))).toThrow();
  });

  it("accepts a guided chapter draft that remains separate from any manuscript", () => {
    const result = parseComposerResponse(JSON.stringify({
      sectionTitle: "The Gate Answers",
      section: "Aren stepped into the gate and the light forgot its own name. She held the map tight enough to crease the ink, listening for the first thing it would take from her.",
      craftNote: "The section follows close third-person tension and preserves the stated memory-cost rule.",
    }));

    expect(result.sectionTitle).toBe("The Gate Answers");
    expect(result.section).toContain("Aren");
  });

  it("accepts a review-only rewrite proposal and a structured consistency summary", () => {
    const rewrite = parseRewriteResponse(JSON.stringify({ rewrittenText: "Mara listened to the rain at the window and finally unfolded the letter with care.", craftNote: "Tightened the action and retained close-third tension." }));
    const consistency = parseConsistencyResponse(JSON.stringify({ summary: "The chapter holds a clear tense mood and introduces the letter effectively.", strengths: ["The archive setting anchors the scene."], flags: [{ severity: "watch", focus: "Letter timing", detail: "Clarify whether the letter is known to Mara before this chapter." }], openQuestions: ["What consequence follows the opening of the letter?"] }));
    expect(rewrite.rewrittenText).toContain("Mara");
    expect(consistency.flags[0]?.severity).toBe("watch");
  });
});
