export type MasterbookMatch = { category: string; id: string; name: string };

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
