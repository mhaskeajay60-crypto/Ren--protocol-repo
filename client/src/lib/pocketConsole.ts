export const POCKET_PLANNER_LANES = ['Seed', 'Planned', 'Drafting', 'Complete'] as const;

export type PocketPlannerLane = (typeof POCKET_PLANNER_LANES)[number];

export function normalizePocketPlannerLane(value: unknown): PocketPlannerLane {
  return POCKET_PLANNER_LANES.includes(value as PocketPlannerLane) ? (value as PocketPlannerLane) : 'Seed';
}
