import { describe, expect, it } from 'vitest';
import { atlasRecordType, normalizeProfileStats, statPresets } from './masterbookAtlas';

describe('Masterbook Atlas helpers', () => {
  it('keeps player-defined stat labels and removes only empty or duplicate stat labels', () => {
    expect(normalizeProfileStats([{ label: 'HP', value: '120/120' }, { label: 'hp', value: 'ignored' }, { label: 'Soul Charge', value: 'A' }, { label: '', value: '7' }])).toEqual([
      { label: 'HP', value: '120/120' },
      { label: 'Soul Charge', value: 'A' },
    ]);
  });

  it('offers optional game-style presets without making them mandatory', () => {
    expect(statPresets.vitals.map(stat => stat.label)).toEqual(['HP', 'MP', 'SP']);
    expect(statPresets.attributes.map(stat => stat.label)).toContain('Magic DEF');
    expect(atlasRecordType('worldRules', { atlasType: 'Class system' })).toBe('Class system');
    expect(atlasRecordType('artifacts', {})).toBe('Relic');
  });
});
