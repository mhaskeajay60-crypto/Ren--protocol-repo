export type AtlasStat = { label: string; value: string };

export const atlasCategoryLabels: Record<string, string> = {
  characters: 'Character Codex',
  worldRules: 'System Board',
  locations: 'World Map',
  lore: 'Lore Glossary',
  factions: 'Faction Hall',
  artifacts: 'Artifact Cabinet',
  plotThreads: 'Quest Board',
};

export const statPresets: Record<'vitals' | 'attributes', AtlasStat[]> = {
  vitals: [{ label: 'HP', value: '' }, { label: 'MP', value: '' }, { label: 'SP', value: '' }],
  attributes: [{ label: 'STR', value: '' }, { label: 'AGI', value: '' }, { label: 'DEF', value: '' }, { label: 'Magic DEF', value: '' }, { label: 'Mana', value: '' }],
};

export function normalizeProfileStats(input: unknown, limit = 12): AtlasStat[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  return input
    .map(item => ({ label: String((item as AtlasStat)?.label || '').trim(), value: String((item as AtlasStat)?.value || '').trim() }))
    .filter(item => item.label)
    .filter(item => {
      const key = item.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.max(1, limit));
}

export function atlasRecordType(category: string, record: Record<string, unknown>): string {
  const explicit = String(record.atlasType || '').trim();
  if (explicit) return explicit;
  if (category === 'worldRules') return 'World law';
  if (category === 'locations') return 'Unmapped place';
  if (category === 'lore') return 'Archive term';
  if (category === 'factions') return 'Group';
  if (category === 'artifacts') return 'Relic';
  if (category === 'plotThreads') return 'Quest';
  return 'Record';
}
