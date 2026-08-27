import { describe, expect, it } from 'vitest';
import { createPlayerBackup, parsePlayerBackup } from './playerBackup';

describe('Player Backup', () => {
  it('creates a focused player snapshot without local record identity or history', () => {
    const backup = createPlayerBackup({
      character: { id: 'private-local-id', name: 'Ren', profileStats: [{ label: 'HP', value: '80' }], history: [{ note: 'private' }] },
      projectTitle: 'Neo Domain Online', chapterCount: 4, chapterWords: 9900, activeChapterTitle: 'Chapter 4', activeChapterWords: 1800, totalScenes: 9, completeScenes: 3, exportedAt: '2026-08-27T00:00:00.000Z',
    });
    expect(backup.character).toEqual({ name: 'Ren', profileStats: [{ label: 'HP', value: '80' }] });
    expect(backup.storyProgress.chapterWords).toBe(9900);
  });

  it('accepts only a recognised backup with a named character and progress snapshot', () => {
    const valid = createPlayerBackup({ character: { name: 'Ren' }, projectTitle: 'Neo', chapterCount: 0, chapterWords: 0, activeChapterTitle: 'One', activeChapterWords: 0, totalScenes: 0, completeScenes: 0 });
    expect(parsePlayerBackup(valid)?.character.name).toBe('Ren');
    expect(parsePlayerBackup({ format: 'other', version: 1 })).toBeNull();
    expect(parsePlayerBackup({ format: 'ren-protocol-player-backup', version: 1, character: {}, storyProgress: {} })).toBeNull();
  });
});
