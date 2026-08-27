export type MasterbookMatch = { category: string; id: string; name: string };
export type CharacterUpdateSuggestion = {
  key: string;
  characterId: string;
  characterName: string;
  kind: 'status' | 'skill';
  value: string;
  source: string;
};

function escapedTerm(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function findExistingMasterbookMatches(masterbook: Record<string, Array<Record<string, unknown>>>, chapterText: string): MasterbookMatch[] {
  const plainText = String(chapterText || '').toLowerCase();
  if (!plainText.trim()) return [];
  const matches: MasterbookMatch[] = [];
  Object.entries(masterbook || {}).forEach(([category, entries]) => {
    (Array.isArray(entries) ? entries : []).forEach(entry => {
      const name = String(entry.name || '').trim();
      const id = String(entry.id || '').trim();
      if (!name || !id) return;
      const pattern = new RegExp(`(^|[^a-z0-9])${escapedTerm(name.toLowerCase())}($|[^a-z0-9])`, 'i');
      if (pattern.test(plainText)) matches.push({ category, id, name });
    });
  });
  return matches;
}

export function unlinkedMasterbookMatches(matches: MasterbookMatch[], existingLinks: Array<{ category?: string; id?: string }> = []) {
  const linked = new Set((existingLinks || []).map(link => `${link.category || ''}:${link.id || ''}`));
  return matches.filter(match => !linked.has(`${match.category}:${match.id}`));
}

export function findAuthorMarkedCharacterUpdates(characters: Array<Record<string, unknown>>, chapterText: string): CharacterUpdateSuggestion[] {
  const text = String(chapterText || '');
  if (!text.trim()) return [];
  const suggestions: CharacterUpdateSuggestion[] = [];
  const seen = new Set<string>();
  (Array.isArray(characters) ? characters : []).forEach(character => {
    const characterId = String(character.id || '').trim();
    const characterName = String(character.name || '').trim();
    if (!characterId || !characterName) return;
    const marker = `@${escapedTerm(characterName)}`;
    const statusPattern = new RegExp(`(^|[^a-z0-9_])${marker}\\s+(?:dies|is\\s+(?:dead|deceased))\\b`, 'ig');
    if (statusPattern.test(text)) {
      const key = `status:${characterId}:deceased`;
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({ key, characterId, characterName, kind: 'status', value: 'Deceased', source: `@${characterName} dies` });
      }
    }
    const skillPattern = new RegExp(`(^|[^a-z0-9_])${marker}\\s+(?:gains|learns|unlocks)\\s+(?:a\\s+)?(?:new\\s+)?skill\\s*:\\s*([^\\n.!?]{1,80})`, 'ig');
    for (const match of Array.from(text.matchAll(skillPattern))) {
      const value = String(match[2] || '').trim().replace(/[,;:]+$/, '');
      const key = `skill:${characterId}:${value.toLowerCase()}`;
      if (!value || seen.has(key)) continue;
      seen.add(key);
      suggestions.push({ key, characterId, characterName, kind: 'skill', value, source: `@${characterName} gains skill: ${value}` });
    }
  });
  return suggestions;
}

export function unappliedCharacterUpdates(suggestions: CharacterUpdateSuggestion[], approvals: Array<{ key?: string }> = []) {
  const applied = new Set((approvals || []).map(item => String(item.key || '')));
  return (suggestions || []).filter(suggestion => !applied.has(suggestion.key));
}
