export type PlayerBackup = {
  format: 'ren-protocol-player-backup';
  version: 1;
  exportedAt: string;
  character: Record<string, unknown>;
  storyProgress: {
    projectTitle: string;
    chapterCount: number;
    chapterWords: number;
    activeChapterTitle: string;
    activeChapterWords: number;
    totalScenes: number;
    completeScenes: number;
  };
};

export function createPlayerBackup(input: {
  character: Record<string, unknown>;
  projectTitle: string;
  chapterCount: number;
  chapterWords: number;
  activeChapterTitle: string;
  activeChapterWords: number;
  totalScenes: number;
  completeScenes: number;
  exportedAt?: string;
}): PlayerBackup {
  const { id: _id, history: _history, ...character } = input.character;
  return {
    format: 'ren-protocol-player-backup',
    version: 1,
    exportedAt: input.exportedAt || new Date().toISOString(),
    character,
    storyProgress: {
      projectTitle: String(input.projectTitle || 'Untitled Novel'),
      chapterCount: Math.max(0, Number(input.chapterCount) || 0),
      chapterWords: Math.max(0, Number(input.chapterWords) || 0),
      activeChapterTitle: String(input.activeChapterTitle || 'Untitled chapter'),
      activeChapterWords: Math.max(0, Number(input.activeChapterWords) || 0),
      totalScenes: Math.max(0, Number(input.totalScenes) || 0),
      completeScenes: Math.max(0, Number(input.completeScenes) || 0),
    },
  };
}

export function parsePlayerBackup(value: unknown): PlayerBackup | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<PlayerBackup>;
  if (candidate.format !== 'ren-protocol-player-backup' || candidate.version !== 1) return null;
  if (!candidate.character || typeof candidate.character !== 'object' || !String(candidate.character.name || '').trim()) return null;
  if (!candidate.storyProgress || typeof candidate.storyProgress !== 'object') return null;
  return candidate as PlayerBackup;
}
