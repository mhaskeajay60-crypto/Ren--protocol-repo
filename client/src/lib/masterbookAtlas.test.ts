import { describe, expect, it } from 'vitest';
import { atlasRecordType, normalizeProfileStats, savedRelationshipWebLinks, statPresets } from './masterbookAtlas';

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

  it('shows only deliberately saved relationships with two known different characters', () => {
    const characters = [{ id: 'ren', name: 'Ren' }, { id: 'ryu', name: 'Ryu' }];
    expect(savedRelationshipWebLinks([
      { fromId: 'ren', toId: 'ryu', kind: 'Family', stage: 'Strained' },
      { fromId: 'ren', toId: 'missing', kind: 'Unknown' },
      { fromId: 'ren', toId: 'ren', kind: 'Self' },
      { fromId: 'ryu', toId: 'ren', kind: 'Duplicate' },
    ], characters)).toEqual([{ fromId: 'ren', toId: 'ryu', from: 'Ren', to: 'Ryu', kind: 'Family', stage: 'Strained', dynamic: '' }]);
  });
});
