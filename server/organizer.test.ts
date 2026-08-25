import { describe, expect, it } from "vitest";
import { parseBulkMasterbookResponse, parseCoWriterResponse, parseComposerResponse, parseConsistencyResponse, parseCriticResponse, parseDialogueResponse, parseLoreResponse, parseOrganizerResponse, parseRewriteResponse, parseTemporaryExtractionResponse } from "./routers";

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

  it("accepts a direct Claude Critic report with evidence and practical improvement steps", () => {
    const result = parseCriticResponse(JSON.stringify({
      overallScore: 6.5,
      verdict: "The premise is clear, but the scene delays its central pressure for too long.",
      scores: [
        ["hook", 6, "The opening image is atmospheric but does not establish an immediate question."],
        ["pacing", 5, "The scene repeats observation before the decision arrives."],
        ["character", 7, "Mara's caution is consistent in her choices."],
        ["dialogue", 6, "The exchange has intent but carries limited subtext."],
        ["clarity", 7, "The letter and immediate goal are understandable."],
        ["worldbuilding", 6, "The archive detail is intriguing but not yet consequential."],
        ["emotional_impact", 6, "The hesitation is felt but the cost remains abstract."],
        ["prose", 7, "The sentence rhythm supports the quiet mood."],
      ].map(([area, score, assessment]) => ({ area, score, assessment })),
      strengths: ["The setting carries a coherent uneasy mood."],
      issues: [{ severity: "important", issue: "Delayed pressure", evidence: "Mara observes the rain and shelves before acting on the letter.", whyItMatters: "The reader waits too long to understand what can change in the scene.", improvement: "Introduce the consequence of opening or refusing the letter within the first page, then let the atmosphere complicate that choice." }],
      nextSteps: ["Clarify the immediate consequence before expanding the archive atmosphere."],
    }));
    expect(result.overallScore).toBe(6.5);
    expect(result.issues[0]?.improvement).toContain("Introduce the consequence");
    expect(result.scores).toHaveLength(8);
  });

  it("accepts separate dialogue and lore workshop proposals for author review", () => {
    const dialogue = parseDialogueResponse(JSON.stringify({ summary: "Three slow-burn power dynamics for the same exchange.", variants: ["Guarded", "Sharper", "Quietly comic"].map(label => ({ label, text: "Mara folded the letter. ‘You knew I would come.’ The keeper did not look up.", craftNote: "Keeps the unequal information and slows the reveal." })) }));
    const lore = parseLoreResponse(JSON.stringify({ summary: "A provisional archive faction seed.", ideas: [{ type: "faction", title: "The Inkwardens", concept: "Archivists who erase names to delay a prophecy.", storyUse: "They can pressure Mara's choice about the letter.", caution: "Decide whether erasure is literal, legal, or magical before filing.", tags: ["archive", "prophecy"] }] }));
    expect(dialogue.variants).toHaveLength(3);
    expect(lore.ideas[0]?.type).toBe("faction");
  });

  it("accepts an author-controlled co-writer suggestion with separate scene decisions", () => {
    const result = parseCoWriterResponse(JSON.stringify({
      title: "The clerk's refusal",
      suggestion: "The clerk did not look up. A pale membrane crossed one eye as the coin returned across the slate.",
      craftNote: "Keeps the slow bureaucratic pressure in close third person.",
      choices: [
        { label: "Refuse the bribe", continuation: "The clerk returns the coin and asks for a faction seal instead.", consequence: "The scene raises the political cost without assuming any existing inventory." },
        { label: "Ask a question", continuation: "Ssziss asks who minted the coin before offering another word.", consequence: "The exchange opens a route into the enemy-swamp thread." },
        { label: "Leave quietly", continuation: "Ssziss folds the coin away and studies the guard's badge.", consequence: "The scene preserves secrecy but delays access to the archive." },
      ],
    }));
    expect(result.choices).toHaveLength(3);
    expect(result.suggestion).toContain("clerk");
  });

  it("accepts a separate image or PDF text extraction result without filing it", () => {
    const result = parseTemporaryExtractionResponse(JSON.stringify({
      text: "The brass tongue of the gate bell was warm.",
      note: "Readable text was extracted. Check names and line breaks against the original file before using it.",
    }));
    expect(result.text).toContain("gate bell");
    expect(result.note).toContain("Check names");
    expect(() => parseTemporaryExtractionResponse(JSON.stringify({ text: "Missing the review note" }))).toThrow();
  });

  it("accepts source-linked Masterbook candidates from a multi-item review without filing them", () => {
    const result = parseBulkMasterbookResponse(JSON.stringify({
      summary: "Two provisional records were found across the selected notes and PDF.",
      items: [{
        type: "location",
        category: "Worldbuilding",
        tags: ["gate", "city"],
        title: "Ember Gate",
        description: "A possible city threshold mentioned in both selected sources.",
        role: "",
        status: "Provisional",
        stage: "",
        pov: "",
        linked: "Aren Vale",
        sourceIds: ["dump-note-1", "dump-pdf-2"],
      }],
    }));
    expect(result.items[0]?.sourceIds).toEqual(["dump-note-1", "dump-pdf-2"]);
    expect(() => parseBulkMasterbookResponse(JSON.stringify({ summary: "Missing sources", items: [{ type: "lore" }] }))).toThrow();
  });
});
