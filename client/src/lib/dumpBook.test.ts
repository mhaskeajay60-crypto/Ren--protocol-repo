import { describe, expect, it } from "vitest";
import { DUMP_BOOK_IMAGE_LIMIT, DUMP_BOOK_TEXT_LIMIT, classifyDumpBookFile, isDumpBookSizeAllowed, matchesDumpBookDiscovery, normalizeDumpBookTags, normalizeDumpBookUrl } from "./dumpBook";

describe("Dump Book helpers", () => {
  it("keeps only safe HTTP(S) links", () => {
    expect(normalizeDumpBookUrl(" https://example.com/research ")).toBe("https://example.com/research");
    expect(normalizeDumpBookUrl("javascript:alert(1)")).toBe("");
  });

  it("recognizes supported compact image and text-file types", () => {
    expect(classifyDumpBookFile("reference.webp", "image/webp")).toBe("image");
    expect(classifyDumpBookFile("world-notes.md", "")).toBe("text");
    expect(classifyDumpBookFile("book.pdf", "application/pdf")).toBeNull();
  });

  it("enforces different local limits for images and text files", () => {
    expect(isDumpBookSizeAllowed("image", DUMP_BOOK_IMAGE_LIMIT)).toBe(true);
    expect(isDumpBookSizeAllowed("image", DUMP_BOOK_IMAGE_LIMIT + 1)).toBe(false);
    expect(isDumpBookSizeAllowed("text", DUMP_BOOK_TEXT_LIMIT)).toBe(true);
    expect(isDumpBookSizeAllowed("text", DUMP_BOOK_TEXT_LIMIT + 1)).toBe(false);
  });

  it("searches saved titles, contents, filenames, and links while honoring type filters", () => {
    const note = { kind: "text" as const, title: "Market clue", content: "The silver compass appears after rain." };
    const link = { kind: "link" as const, title: "Transit research", url: "https://example.com/trains" };
    const file = { kind: "text_file" as const, title: "Lore", fileName: "north-gate.md", content: "Gatekeeping customs" };

    expect(matchesDumpBookDiscovery(note, "compass", "all")).toBe(true);
    expect(matchesDumpBookDiscovery(link, "trains", "link")).toBe(true);
    expect(matchesDumpBookDiscovery(file, "north", "text_file")).toBe(true);
    expect(matchesDumpBookDiscovery(note, "market", "link")).toBe(false);
  });

  it("keeps compact unique custom tags and searches them like other local material", () => {
    expect(normalizeDumpBookTags(" #Neo Domain, Aren, neo domain, Chapter   3 ")).toEqual(["Neo Domain", "Aren", "Chapter 3"]);
    const item = { kind: "text" as const, title: "A clue", tags: ["Project Atlas", "Mira"] };
    expect(matchesDumpBookDiscovery(item, "mira", "all")).toBe(true);
  });
});
