export const PDF_TRIMS = [
  { value: "letter", label: "Letter · US manuscript" },
  { value: "a5", label: "A5 · compact reading" },
  { value: "paperback", label: "6×9 · paperback" },
] as const;

export type FocusSprint = {
  at?: string;
  minutes?: number;
};

export function trimOptionsMarkup(current: string = "letter") {
  return PDF_TRIMS.map(
    ({ value, label }) => `<option value="${value}" ${current === value ? "selected" : ""}>${label}</option>`,
  ).join("");
}

export function todaySprintSummary(sprints: FocusSprint[] = [], dateKey: string) {
  const today = sprints.filter(sprint => String(sprint.at || "").slice(0, 10) === dateKey);
  return {
    focusMinutes: today.reduce((sum, sprint) => sum + Number(sprint.minutes || 0), 0),
    sessionCount: today.length,
  };
}

export type MarkdownFolio = { title: string; body: string };

export function parseMarkdownManuscript(markdown: string) {
  const lines = String(markdown || "").replace(/\r/g, "").split("\n");
  const title = lines.find(line => /^#\s+/.test(line))?.replace(/^#\s+/, "").trim() || "";
  const chapters: MarkdownFolio[] = [];
  let current: MarkdownFolio | null = null;

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      if (current) {
        current.body = current.body.replace(/^---\s*$/gm, "").trim();
        chapters.push(current);
      }
      current = { title: line.replace(/^##\s+/, "").trim(), body: "" };
      continue;
    }
    if (current) current.body += `${current.body ? "\n" : ""}${line}`;
  }

  if (current) {
    current.body = current.body.replace(/^---\s*$/gm, "").trim();
    chapters.push(current);
  }

  return { title, chapters: chapters.filter(chapter => chapter.title || chapter.body) };
}

export function wordWindowSummary(words: Record<string, number> = {}, dateKeys: string[] = []) {
  const values = dateKeys.map(key => Number(words[key] || 0));
  return {
    totalWords: values.reduce((sum, value) => sum + value, 0),
    activeDays: values.filter(value => value > 0).length,
    maxWords: Math.max(1, ...values),
  };
}
