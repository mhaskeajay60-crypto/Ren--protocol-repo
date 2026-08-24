import { describe, expect, it } from "vitest";
import { parseOrganizerResponse } from "./routers";

describe("Brain Dump organizer response validation", () => {
  it("accepts a complete structured suggestion", () => {
    const result = parseOrganizerResponse(JSON.stringify({
      summary: "One potential character and one plot thread were identified.",
      items: [{
        type: "character",
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
});
