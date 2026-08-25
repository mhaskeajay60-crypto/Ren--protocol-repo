import { describe, expect, it } from "vitest";
import { todaySprintSummary, trimOptionsMarkup } from "./authorToolkit";

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
});
