export const DUMP_BOOK_IMAGE_LIMIT = 1_000_000;
export const DUMP_BOOK_TEXT_LIMIT = 300_000;

export type DumpBookFileKind = "image" | "text" | null;
export type DumpBookMaterialKind = "text" | "link" | "image" | "text_file" | "note";
export type DumpBookFilter = "all" | DumpBookMaterialKind;

export type SearchableDumpBookItem = {
  kind: DumpBookMaterialKind;
  title?: string;
  fileName?: string;
  content?: string;
  url?: string;
  mime?: string;
};

export function normalizeDumpBookUrl(value: string): string {
  try {
    const url = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function classifyDumpBookFile(name: string, mimeType: string): DumpBookFileKind {
  const lowerName = String(name || "").toLowerCase();
  if (["image/png", "image/jpeg", "image/webp"].includes(mimeType)) return "image";
  if (["text/plain", "text/markdown"].includes(mimeType) || /\.(txt|md|markdown)$/.test(lowerName)) return "text";
  return null;
}

export function isDumpBookSizeAllowed(kind: DumpBookFileKind, size: number): boolean {
  if (!Number.isFinite(size) || size < 0 || !kind) return false;
  return kind === "image" ? size <= DUMP_BOOK_IMAGE_LIMIT : size <= DUMP_BOOK_TEXT_LIMIT;
}

export function matchesDumpBookDiscovery(item: SearchableDumpBookItem, query: string, filter: DumpBookFilter): boolean {
  if (filter !== "all" && item.kind !== filter) return false;
  const term = String(query || "").trim().toLowerCase();
  if (!term) return true;
  return [item.title, item.fileName, item.content, item.url, item.mime, item.kind]
    .some(value => String(value || "").toLowerCase().includes(term));
}
