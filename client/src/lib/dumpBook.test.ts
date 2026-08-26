import { describe, expect, it } from "vitest";
import { DUMP_BOOK_IMAGE_LIMIT, DUMP_BOOK_LOCKER_FILE_LIMIT, DUMP_BOOK_TEXT_LIMIT, classifyDumpBookFile, classifyDumpBookLockerFile, filterDismissedStoryVaultConnections, findStoryVaultConnections, isDumpBookLockerSizeAllowed, isDumpBookSizeAllowed, matchesDumpBookDiscovery, normalizeDumpBookInboxStatus, normalizeDumpBookTags, normalizeDumpBookUrl, splitDumpBookIdeas, storyVaultConnectionDismissalKey } from "./dumpBook";

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

  it("accepts approved local-locker files through 10 MB and refuses larger or unsupported files", () => {
    expect(classifyDumpBookLockerFile("map.webp", "image/webp")).toBe("image");
    expect(classifyDumpBookLockerFile("chapter-notes.md", "")).toBe("text");
    expect(classifyDumpBookLockerFile("world-guide.pdf", "application/pdf")).toBe("pdf");
    expect(classifyDumpBookLockerFile("archive.zip", "application/zip")).toBeNull();
    expect(isDumpBookLockerSizeAllowed("pdf", DUMP_BOOK_LOCKER_FILE_LIMIT)).toBe(true);
    expect(isDumpBookLockerSizeAllowed("text", DUMP_BOOK_LOCKER_FILE_LIMIT + 1)).toBe(false);
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

  it("uses Raw for older Inbox items and keeps known statuses", () => {
    expect(normalizeDumpBookInboxStatus(undefined)).toBe("Raw");
    expect(normalizeDumpBookInboxStatus("Working")).toBe("Working");
    expect(normalizeDumpBookInboxStatus("Unknown")).toBe("Raw");
  });

  it("splits pasted lines and bullets into bounded local idea cards", () => {
    expect(splitDumpBookIdeas("- Give Aren a false memory\n• North Gate is closed\n3. Show the storm earlier"))
      .toEqual(["Give Aren a false memory", "North Gate is closed", "Show the storm earlier"]);
    expect(splitDumpBookIdeas(" ")).toEqual([]);
  });

  it("offers only explained local connections that share meaningful terms", () => {
    const suggestions = findStoryVaultConnections("The North Gate closes during the storm before Aren arrives.", [
      { id: "chapter-1", kind: "chapter", title: "Chapter 1: North Gate", text: "Aren walks toward the gate as a storm begins." },
      { id: "location-1", kind: "location", title: "North Gate", text: "A sealed entrance outside the city." },
      { id: "character-1", kind: "character", title: "Mira", text: "A careful archivist." },
    ]);

    expect(suggestions.map(item => item.id).sort()).toEqual(["chapter-1", "location-1"]);
    expect(suggestions.find(item => item.id === "chapter-1")?.matchedTerms).toContain("storm");
    expect(suggestions.find(item => item.id === "location-1")?.matchedTerms).toContain("north");
  });

  it("hides only the author-dismissed local connection for one saved idea", () => {
    const suggestions = findStoryVaultConnections("Aren reaches the North Gate during the storm.", [
      { id: "chapter-1", kind: "chapter", title: "North Gate", text: "Aren waits through a storm." },
      { id: "location-1", kind: "location", title: "North Gate", text: "The city entrance." },
    ]);
    const dismissal = storyVaultConnectionDismissalKey("idea-1", "chapter-1");

    expect(filterDismissedStoryVaultConnections(suggestions, "idea-1", [dismissal]).map(item => item.id)).toEqual(["location-1"]);
    expect(filterDismissedStoryVaultConnections(suggestions, "idea-2", [dismissal]).map(item => item.id).sort()).toEqual(["chapter-1", "location-1"]);
  });
});
