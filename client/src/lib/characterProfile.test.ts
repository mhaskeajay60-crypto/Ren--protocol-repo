import { describe, expect, it } from 'vitest';
import { appendProfileListItem, characterProfileProgress, characterProfileTier, mergeCharacterProfileRecord, splitCharacterProfileList } from './characterProfile';

describe('character profile helpers', () => {
  it('turns optional talent text into a compact unique dossier list', () => {
    expect(splitCharacterProfileList('Swordplay, Swordplay\nStorm sense; Map reading', 4)).toEqual([
      'Swordplay',
      'Storm sense',
      'Map reading',
    ]);
  });

  it('measures only supplied profile information and keeps an unknown tier neutral', () => {
    expect(characterProfileProgress({ role: 'Protagonist', profileTalents: 'Strategy', relationships: 'Ryu' })).toEqual({ filled: 3, total: 8 });
    expect(characterProfileTier({ profileImportance: 'Unconfirmed' })).toBe('Character');
    expect(characterProfileTier({ profileImportance: 'Spotlight' })).toBe('Spotlight');
  });

  it('adds dossier fields without discarding existing Masterbook fields or history', () => {
    const existing = { id: 'ren', name: 'Ren', history: [{ action: 'Record created' }], legacyKey: 'keep this', role: 'Old role' };
    expect(mergeCharacterProfileRecord(existing, { role: 'Protagonist', profileTalents: 'Strategy', profileStats: [{ label: 'HP', value: '120' }] })).toEqual({
      id: 'ren',
      name: 'Ren',
      history: [{ action: 'Record created' }],
      legacyKey: 'keep this',
      role: 'Protagonist',
      profileTalents: 'Strategy',
      profileStats: [{ label: 'HP', value: '120' }],
    });
  });

  it('adds an approved new skill only once while keeping the existing profile list', () => {
    expect(appendProfileListItem('Swordplay, Gate sense', 'Rift Step')).toBe('Swordplay, Gate sense, Rift Step');
    expect(appendProfileListItem('Swordplay, Gate sense', 'gate sense')).toBe('Swordplay, Gate sense');
  });
});
