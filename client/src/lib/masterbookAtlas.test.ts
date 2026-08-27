import { describe, expect, it } from 'vitest';
import { atlasRecordType, focusedRelationshipWebLinks, normalizeProfileStats, normalizeRelationshipVisibility, normalizeRelationshipVisualStyle, relationshipVisualToken, savedRelationshipWebLinks, statPresets } from './masterbookAtlas';

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
    ], characters)).toEqual([expect.objectContaining({ fromId: 'ren', toId: 'ryu', from: 'Ren', to: 'Ryu', kind: 'Family', stage: 'Strained', readerVisibility: 'Private to author', visualStyle: 'Auto from bond', visualToken: 'family', secretKnower: '', secretNote: '' })]);
  });

  it('keeps relationship focus and reader visibility author-selected and backwards compatible', () => {
    const characters = [{ id: 'ren', name: 'Ren' }, { id: 'ryu', name: 'Ryu' }, { id: 'mira', name: 'Mira' }];
    const relations = [
      { fromId: 'ren', toId: 'ryu', kind: 'Ally', readerVisibility: 'Reveal later', chapterId: 'chapter-03' },
      { fromId: 'mira', toId: 'ryu', kind: 'Rival', readerVisibility: 'not a setting' },
    ];
    expect(focusedRelationshipWebLinks(relations, characters, 'ren')).toEqual([
      expect.objectContaining({ from: 'Ren', to: 'Ryu', readerVisibility: 'Reveal later', chapterId: 'chapter-03' }),
    ]);
    expect(focusedRelationshipWebLinks(relations, characters, 'ryu')).toHaveLength(2);
    expect(normalizeRelationshipVisibility('not a setting')).toBe('Private to author');
  });

  it('keeps bond colours author-selected and falls back to a bond kind when no style is picked', () => {
    expect(normalizeRelationshipVisualStyle('Hidden secret')).toBe('Hidden secret');
    expect(normalizeRelationshipVisualStyle('not a style')).toBe('Auto from bond');
    expect(relationshipVisualToken('Killer / Target', 'Auto from bond')).toBe('killer');
    expect(relationshipVisualToken('Friend', 'Hidden secret')).toBe('secret');
  });
});
