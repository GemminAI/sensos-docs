import { getCollection, render, type CollectionEntry } from 'astro:content';

export type OpenStandardsEntry = CollectionEntry<'openStandards'>;

const PAGE_SLUGS = [
  'Charter',
  'Classification',
  'Conformance',
  'Certification',
  'Documentation-Philosophy',
  'Governance',
  'Namespaces',
] as const;

export type OpenStandardsPageSlug = (typeof PAGE_SLUGS)[number];

const FILE_BY_PAGE: Record<OpenStandardsPageSlug, string> = {
  Charter: 'charter',
  Classification: 'classification',
  Conformance: 'conformance',
  Certification: 'certification',
  'Documentation-Philosophy': 'documentation-philosophy',
  Governance: 'governance',
  Namespaces: 'namespaces',
};

export const OPEN_STANDARDS_NAV = [
  { label: 'Overview', href: '/Open-Standards' },
  { label: 'Charter', href: '/Open-Standards/Charter' },
  { label: 'RFCs', href: '/Open-Standards/RFCs' },
  { label: 'Namespaces', href: '/Open-Standards/Namespaces' },
  { label: 'Classification', href: '/Open-Standards/Classification' },
  { label: 'Conformance', href: '/Open-Standards/Conformance' },
  { label: 'Certification', href: '/Open-Standards/Certification' },
  { label: 'Documentation Philosophy', href: '/Open-Standards/Documentation-Philosophy' },
  { label: 'Governance', href: '/Open-Standards/Governance' },
] as const;

export async function getOpenStandardsIndex(): Promise<OpenStandardsEntry> {
  const entries = await getCollection('openStandards');
  const index = entries.find((entry) => entry.id === 'index' || entry.id.endsWith('/index'));
  if (!index) {
    throw new Error('Missing docs/open-standards/index.md');
  }
  return index;
}

export async function getOpenStandardsPage(
  page: OpenStandardsPageSlug,
): Promise<OpenStandardsEntry> {
  const fileId = FILE_BY_PAGE[page];
  const entries = await getCollection('openStandards');
  const entry = entries.find(
    (item) => item.id === fileId || item.id.endsWith(`/${fileId}`) || item.id.replace(/\.md$/i, '') === fileId,
  );
  if (!entry) {
    throw new Error(`Missing open-standards document for ${page} (${fileId})`);
  }
  return entry;
}

export async function renderOpenStandards(entry: OpenStandardsEntry) {
  return render(entry);
}

export { PAGE_SLUGS };
