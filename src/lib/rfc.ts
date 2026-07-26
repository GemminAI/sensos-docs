import { getCollection, type CollectionEntry } from 'astro:content';

export type RfcEntry = CollectionEntry<'rfc'>;

export function rfcHref(id: string): string {
  return `/rfc/${id}`;
}

export function sortRfcs(entries: RfcEntry[]): RfcEntry[] {
  return [...entries].sort((a, b) => a.id.localeCompare(b.id, 'en'));
}

export async function getAllRfcs(): Promise<RfcEntry[]> {
  const entries = await getCollection('rfc');
  return sortRfcs(entries);
}

export function findRfc(entries: RfcEntry[], id: string): RfcEntry | undefined {
  return entries.find((entry) => entry.id === id);
}

export function adjacentRfcs(entries: RfcEntry[], id: string) {
  const sorted = sortRfcs(entries);
  const index = sorted.findIndex((entry) => entry.id === id);
  return {
    prev: index > 0 ? sorted[index - 1] : undefined,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

export function formatDate(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

export function statusClass(status: string): string {
  const key = status.toLowerCase();
  if (key.includes('standard') || key.includes('accepted') || key.includes('normative')) {
    return 'status-standard';
  }
  if (key.includes('active') || key.includes('proposed')) {
    return 'status-active';
  }
  if (key.includes('draft')) {
    return 'status-draft';
  }
  if (key.includes('superseded') || key.includes('deprecated')) {
    return 'status-superseded';
  }
  return 'status-other';
}
