import { describe, expect, it } from "vitest";
import { chapterDraftText, chapterVersionLabel, normalizeChapterVersion } from "./chapterVersions";

describe("two-version chapter workflow", () => {
  it("maps all legacy working-version keys to Chapter Draft", () => {
    expect(normalizeChapterVersion("first")).toBe("draft");
    expect(normalizeChapterVersion("main")).toBe("draft");
    expect(normalizeChapterVersion("draft")).toBe("draft");
    expect(normalizeChapterVersion("final")).toBe("final");
  });

  it("keeps the newest working-draft text before falling back to legacy values", () => {
    expect(chapterDraftText({ first: "first copy", main: "main copy" })).toBe("main copy");
    expect(chapterDraftText({ first: "first copy" })).toBe("first copy");
    expect(chapterDraftText({ draft: "chapter draft", main: "older main" })).toBe("chapter draft");
  });

  it("uses clear labels for the two visible tabs", () => {
    expect(chapterVersionLabel("draft")).toBe("Chapter Draft");
    expect(chapterVersionLabel("final")).toBe("Final Draft");
  });
});
