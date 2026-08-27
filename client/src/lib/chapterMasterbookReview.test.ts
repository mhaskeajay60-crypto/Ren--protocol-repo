import { describe, expect, it } from 'vitest';
import { findAuthorMarkedCharacterUpdates, findExistingMasterbookMatches, unappliedCharacterUpdates, unlinkedMasterbookMatches } from './chapterMasterbookReview';

describe('chapter Masterbook review', () => {
  const masterbook = {
    characters: [{ id: 'ren', name: 'Ren' }, { id: 'ryu', name: 'Ryu' }],
    locations: [{ id: 'gate', name: 'North Gate' }],
  };

  it('suggests only existing named records mentioned in the saved chapter text', () => {
    expect(findExistingMasterbookMatches(masterbook, 'Ren waited by the North Gate.')).toEqual([
      { category: 'characters', id: 'ren', name: 'Ren' },
      { category: 'locations', id: 'gate', name: 'North Gate' },
    ]);
    expect(findExistingMasterbookMatches(masterbook, 'Renaissance arrived at the gate.')).toEqual([]);
  });

  it('removes links the author has already deliberately added', () => {
    const matches = findExistingMasterbookMatches(masterbook, 'Ren waited by the North Gate.');
    expect(unlinkedMasterbookMatches(matches, [{ category: 'characters', id: 'ren' }])).toEqual([{ category: 'locations', id: 'gate', name: 'North Gate' }]);
  });

  it('suggests only explicit author-marked deaths and skills, then hides approved updates', () => {
    const updates = findAuthorMarkedCharacterUpdates(masterbook.characters, '@Ren dies in the gate fire.\n@Ryu gains skill: Wind Step.\nRen may be dead in a rumour.');
    expect(updates).toEqual([
      expect.objectContaining({ characterName: 'Ren', kind: 'status', value: 'Deceased', source: '@Ren dies' }),
      expect.objectContaining({ characterName: 'Ryu', kind: 'skill', value: 'Wind Step', source: '@Ryu gains skill: Wind Step' }),
    ]);
    expect(findAuthorMarkedCharacterUpdates(masterbook.characters, 'Ren dies, but this is only a draft note.')).toEqual([]);
    expect(unappliedCharacterUpdates(updates, [{ key: updates[0].key }])).toEqual([updates[1]]);
  });
});
