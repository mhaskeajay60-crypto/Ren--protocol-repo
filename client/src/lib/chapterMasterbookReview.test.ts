import { describe, expect, it } from 'vitest';
import { findExistingMasterbookMatches, unlinkedMasterbookMatches } from './chapterMasterbookReview';

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
});
