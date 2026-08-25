import { describe, expect, it } from "vitest";
import { DUMP_BOOK_IMAGE_LIMIT, DUMP_BOOK_TEXT_LIMIT, classifyDumpBookFile, isDumpBookSizeAllowed, normalizeDumpBookUrl } from "./dumpBook";

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
});
