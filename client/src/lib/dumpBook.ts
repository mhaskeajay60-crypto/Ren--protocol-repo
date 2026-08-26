export const DUMP_BOOK_IMAGE_LIMIT = 1_000_000;
export const DUMP_BOOK_TEXT_LIMIT = 300_000;
export const DUMP_BOOK_LOCKER_FILE_LIMIT = 10 * 1024 * 1024;
export const DUMP_BOOK_INBOX_STATUSES = ["Raw", "Working", "Proposed", "Filed", "Archived"] as const;

export type DumpBookFileKind = "image" | "text" | null;
export type DumpBookLockerFileKind = "image" | "text" | "pdf" | null;
export type DumpBookMaterialKind = "text" | "link" | "image" | "text_file" | "note";
export type DumpBookFilter = "all" | DumpBookMaterialKind;
export type DumpBookInboxStatus = typeof DUMP_BOOK_INBOX_STATUSES[number];

export type SearchableDumpBookItem = {
  kind: DumpBookMaterialKind;
  title?: string;
  fileName?: string;
  content?: string;
  url?: string;
  mime?: string;
  tags?: string[];
};

export function normalizeDumpBookTags(value: string | string[]): string[] {
  const unique = new Map<string, string>();
  const source = Array.isArray(value) ? value.join(",") : String(value || "");
  source.split(",")
    .map(tag => tag.trim().replace(/^#+/, "").replace(/\s+/g, " "))
    .filter(Boolean)
    .slice(0, 12)
    .forEach(tag => {
      const safe = tag.slice(0, 32);
      if (!unique.has(safe.toLowerCase())) unique.set(safe.toLowerCase(), safe);
    });
  return Array.from(unique.values());
}

export function normalizeDumpBookInboxStatus(value: unknown): DumpBookInboxStatus {
  return DUMP_BOOK_INBOX_STATUSES.includes(value as DumpBookInboxStatus)
    ? value as DumpBookInboxStatus
    : "Raw";
}

export function splitDumpBookIdeas(value: string): string[] {
  const clean = String(value || "").replace(/\r\n?/g, "\n").trim();
  if (!clean) return [];

  return clean
    .split(/\n+/)
    .map(line => line.trim().replace(/^(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 40);
}

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

export function classifyDumpBookLockerFile(name: string, mimeType: string): DumpBookLockerFileKind {
  const lowerName = String(name || "").toLowerCase();
  if (["image/png", "image/jpeg", "image/webp"].includes(mimeType)) return "image";
  if (["text/plain", "text/markdown"].includes(mimeType) || /\.(txt|md|markdown)$/.test(lowerName)) return "text";
  if (mimeType === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
  return null;
}

export function isDumpBookLockerSizeAllowed(kind: DumpBookLockerFileKind, size: number): boolean {
  return Boolean(kind) && Number.isFinite(size) && size >= 0 && size <= DUMP_BOOK_LOCKER_FILE_LIMIT;
}

export function matchesDumpBookDiscovery(item: SearchableDumpBookItem, query: string, filter: DumpBookFilter): boolean {
  if (filter !== "all" && item.kind !== filter) return false;
  const term = String(query || "").trim().toLowerCase();
  if (!term) return true;
  return [item.title, item.fileName, item.content, item.url, item.mime, item.kind, ...normalizeDumpBookTags(item.tags || [])]
    .some(value => String(value || "").toLowerCase().includes(term));
}
