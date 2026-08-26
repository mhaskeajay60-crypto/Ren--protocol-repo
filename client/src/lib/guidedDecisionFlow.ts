export function hasStoryDecision(value: string) {
  return value.trim().length >= 10;
}

export function proposalTitleFrom(decision: string, enteredTitle: string) {
  const explicitTitle = enteredTitle.trim();
  if (explicitTitle) return explicitTitle.slice(0, 160);

  return decision.trim().split(/\s+/).slice(0, 9).join(" ").slice(0, 160);
}
