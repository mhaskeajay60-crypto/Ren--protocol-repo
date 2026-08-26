export type CharacterProfileRecord = Record<string, unknown>;

export const characterProfileFieldKeys = [
  'name',
  'role',
  'status',
  'profileImportance',
  'description',
  'profileTalents',
  'profilePowers',
  'profileStrengths',
  'stats',
  'profileMotivation',
  'relationships',
  'profileNotes',
] as const;

export function mergeCharacterProfileRecord(
  existing: CharacterProfileRecord,
  draft: Partial<CharacterProfileRecord>,
): CharacterProfileRecord {
  const next = { ...existing };
  characterProfileFieldKeys.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(draft, key)) next[key] = String(draft[key] || '').trim();
  });
  return next;
}

export function splitCharacterProfileList(value: unknown, limit = 5): string[] {
  return String(value || '')
    .split(/[\n,;|]+/)
    .map(item => item.trim())
    .filter(Boolean)
    .filter((item, index, all) => all.findIndex(other => other.toLowerCase() === item.toLowerCase()) === index)
    .slice(0, Math.max(1, limit));
}

export function characterProfileProgress(record: CharacterProfileRecord): { filled: number; total: number } {
  const keys = [
    'role',
    'description',
    'profileTalents',
    'profilePowers',
    'profileStrengths',
    'profileMotivation',
    'relationships',
  ];
  const filled = keys.filter(key => String(record[key] || '').trim()).length;
  return { filled, total: keys.length };
}

export function characterProfileTier(record: CharacterProfileRecord): string {
  const tier = String(record.profileImportance || '').trim();
  return ['Spotlight', 'Supporting', 'Minor'].includes(tier) ? tier : 'Character';
}
