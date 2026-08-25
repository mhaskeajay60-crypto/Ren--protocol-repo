import { describe, expect, it } from "vitest";
import { parseMarkdownManuscript, todaySprintSummary, trimOptionsMarkup, wordWindowSummary } from "./authorToolkit";

describe("author toolkit helpers", () => {
  it("renders the three human-readable PDF trim choices with the saved trim selected", () => {
    const markup = trimOptionsMarkup("paperback");

    expect(markup).toContain('value="letter"');
    expect(markup).toContain("Letter · US manuscript");
    expect(markup).toContain("A5 · compact reading");
    expect(markup).toContain('<option value="paperback" selected>6×9 · paperback</option>');
  });

  it("summarizes only completed focus sprints from the requested local calendar day", () => {
    expect(
      todaySprintSummary(
        [
          { at: "2026-08-25T01:00:00.000Z", minutes: 25 },
          { at: "2026-08-25T02:00:00.000Z", minutes: 10 },
          { at: "2026-08-24T23:00:00.000Z", minutes: 30 },
        ],
        "2026-08-25",
      ),
    ).toEqual({ focusMinutes: 35, sessionCount: 2 });
  });

  it("parses H2 folios from an editable manuscript Markdown export", () => {
    expect(parseMarkdownManuscript("# Neo Domain Online\n\n## Chapter 01: Signal\n\nFirst scene.\n\n---\n\n## Chapter 02: Echo\n\nSecond scene.")).toEqual({
      title: "Neo Domain Online",
      chapters: [
        { title: "Chapter 01: Signal", body: "First scene." },
        { title: "Chapter 02: Echo", body: "Second scene." },
      ],
    });
  });

  it("summarizes a chosen local writing window without inventing activity", () => {
    expect(wordWindowSummary({ "2026-08-24": 320, "2026-08-25": 180 }, ["2026-08-23", "2026-08-24", "2026-08-25"])).toEqual({
      totalWords: 500,
      activeDays: 2,
      maxWords: 320,
    });
  });
});
