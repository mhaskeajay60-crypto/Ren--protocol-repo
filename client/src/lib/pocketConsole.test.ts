import { describe, expect, it } from 'vitest';
import { normalizePocketPlannerLane } from './pocketConsole';

describe('Pocket Story Console planner lanes', () => {
  it('keeps an author-selected supported lane', () => {
    expect(normalizePocketPlannerLane('Drafting')).toBe('Drafting');
  });

  it('returns to the safe Idea lane for stale or unknown saved values', () => {
    expect(normalizePocketPlannerLane('Retired board')).toBe('Seed');
    expect(normalizePocketPlannerLane(undefined)).toBe('Seed');
  });
});
