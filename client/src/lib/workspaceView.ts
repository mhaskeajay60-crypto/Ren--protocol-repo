export const workspaceViewValues = ["auto", "phone", "desktop"] as const;

export type WorkspaceView = (typeof workspaceViewValues)[number];

export function normalizeWorkspaceView(value: unknown): WorkspaceView {
  const candidate = String(value ?? "").trim().toLowerCase();
  return workspaceViewValues.includes(candidate as WorkspaceView)
    ? (candidate as WorkspaceView)
    : "auto";
}

export function workspaceViewLabel(value: unknown): string {
  return {
    auto: "Auto",
    phone: "Phone",
    desktop: "Desktop tools",
  }[normalizeWorkspaceView(value)];
}
