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

type RelationshipInput = { fromId?: unknown; toId?: unknown; kind?: unknown; stage?: unknown; dynamic?: unknown; tension?: unknown; readerVisibility?: unknown; chapterId?: unknown; visualStyle?: unknown; secretKnower?: unknown; secretNote?: unknown };
type CharacterInput = { id?: unknown; name?: unknown };

export const relationshipVisibilityOptions = ['Private to author', 'Visible to reader', 'Reveal later', 'Unclear'] as const;
export const relationshipKindOptions = ['Family', 'Love', 'Friend', 'Rival', 'Enemy', 'Killer / Target', 'Master / Student', 'Ally', 'Unknown', 'Complicated'] as const;
export const relationshipVisualStyleOptions = ['Auto from bond', 'Family', 'Love', 'Friend', 'Rival', 'Enemy', 'Killer / Target', 'Master / Student', 'Ally', 'Unknown', 'Hidden secret'] as const;

export function normalizeRelationshipVisibility(value: unknown): (typeof relationshipVisibilityOptions)[number] {
  const requested = String(value || '').trim();
  return relationshipVisibilityOptions.includes(requested as (typeof relationshipVisibilityOptions)[number])
    ? (requested as (typeof relationshipVisibilityOptions)[number])
    : 'Private to author';
}

export function normalizeRelationshipVisualStyle(value: unknown): (typeof relationshipVisualStyleOptions)[number] {
  const requested = String(value || '').trim();
  return relationshipVisualStyleOptions.includes(requested as (typeof relationshipVisualStyleOptions)[number])
    ? (requested as (typeof relationshipVisualStyleOptions)[number])
    : 'Auto from bond';
}

export function relationshipVisualToken(kind: unknown, visualStyle: unknown): string {
  const source = normalizeRelationshipVisualStyle(visualStyle) === 'Auto from bond'
    ? String(kind || '').trim()
    : normalizeRelationshipVisualStyle(visualStyle);
  const normalized = source.toLowerCase();
  if (normalized.includes('family')) return 'family';
  if (normalized.includes('love') || normalized.includes('romance')) return 'love';
  if (normalized.includes('friend')) return 'friend';
  if (normalized.includes('rival')) return 'rival';
  if (normalized.includes('killer')) return 'killer';
  if (normalized.includes('enemy')) return 'enemy';
  if (normalized.includes('master') || normalized.includes('mentor')) return 'mentor';
  if (normalized.includes('ally')) return 'ally';
  if (normalized.includes('hidden') || normalized.includes('secret')) return 'secret';
  return 'unknown';
}

export function savedRelationshipWebLinks(relations: unknown, characters: unknown) {
  const namesById = new Map(
    (Array.isArray(characters) ? characters : [])
      .map(character => [String((character as CharacterInput).id || ''), String((character as CharacterInput).name || '').trim()] as const)
      .filter(([id, name]) => id && name),
  );
  const seen = new Set<string>();
  return (Array.isArray(relations) ? relations : [])
    .map(relation => {
      const item = relation as RelationshipInput;
      const fromId = String(item.fromId || '');
      const toId = String(item.toId || '');
      const from = namesById.get(fromId) || '';
      const to = namesById.get(toId) || '';
      const key = [fromId, toId].sort().join(':');
      if (!from || !to || fromId === toId || seen.has(key)) return null;
      seen.add(key);
      return {
        fromId,
        toId,
        from,
        to,
        kind: String(item.kind || 'Connection').trim() || 'Connection',
        stage: String(item.stage || '').trim(),
        dynamic: String(item.dynamic || '').trim(),
        tension: String(item.tension || '').trim(),
        readerVisibility: normalizeRelationshipVisibility(item.readerVisibility),
        chapterId: String(item.chapterId || '').trim(),
        visualStyle: normalizeRelationshipVisualStyle(item.visualStyle),
        visualToken: relationshipVisualToken(item.kind, item.visualStyle),
        secretKnower: String(item.secretKnower || '').trim(),
        secretNote: String(item.secretNote || '').trim(),
      };
    })
    .filter((relation): relation is { fromId: string; toId: string; from: string; to: string; kind: string; stage: string; dynamic: string; tension: string; readerVisibility: (typeof relationshipVisibilityOptions)[number]; chapterId: string; visualStyle: (typeof relationshipVisualStyleOptions)[number]; visualToken: string; secretKnower: string; secretNote: string } => Boolean(relation));
}

export function focusedRelationshipWebLinks(relations: unknown, characters: unknown, focusCharacterId: unknown) {
  const focusId = String(focusCharacterId || '').trim();
  const links = savedRelationshipWebLinks(relations, characters);
  return focusId ? links.filter(link => link.fromId === focusId || link.toId === focusId) : links;
}
