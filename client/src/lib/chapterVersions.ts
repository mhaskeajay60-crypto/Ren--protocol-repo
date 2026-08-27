export const chapterVersionKeys = ["draft", "final"] as const;

export type ChapterVersionKey = (typeof chapterVersionKeys)[number];

type LegacyVersions = Partial<{
  draft: string;
  final: string;
  first: string;
  main: string;
}>;

export function normalizeChapterVersion(value: unknown): ChapterVersionKey {
  return value === "final" ? "final" : "draft";
}

export function chapterDraftText(versions: LegacyVersions | null | undefined): string {
  const values = versions || {};
  return String(values.draft || values.main || values.first || "");
}

export function chapterVersionLabel(value: unknown): string {
  return normalizeChapterVersion(value) === "final" ? "Final Draft" : "Chapter Draft";
}
