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
