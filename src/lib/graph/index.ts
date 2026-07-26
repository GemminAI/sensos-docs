import { detectGraphArtifacts, GRAPH_BASE_URL } from './artifacts';
import {
  CustomAPIProvider,
  GraphifyProvider,
  HEKBGraphProvider,
  Neo4jProvider,
} from './providers/graphify';
import type { GraphFocus, GraphProvider } from './types';

export * from './types';
export * from './catalog';
export * from './artifacts';
export { MemoryGraphProvider } from './memory';
export {
  GraphifyProvider,
  HEKBGraphProvider,
  Neo4jProvider,
  CustomAPIProvider,
} from './providers/graphify';

export type GraphProviderName =
  | 'graphify'
  | 'hekb'
  | 'neo4j'
  | 'custom'
  | string;

let singleton: GraphifyProvider | null = null;

/**
 * Factory for server-side / build-time consumers.
 * Swap providers here without changing UI components.
 */
export async function createGraphProvider(
  name: GraphProviderName = 'graphify',
): Promise<GraphProvider> {
  switch (name) {
    case 'hekb':
      return new HEKBGraphProvider();
    case 'neo4j':
      return new Neo4jProvider();
    case 'custom':
      return new CustomAPIProvider();
    case 'graphify':
    default: {
      if (!singleton) singleton = new GraphifyProvider();
      await singleton.ensureLoaded();
      return singleton;
    }
  }
}

/** Convenience accessor — always returns a loaded GraphifyProvider (current default). */
export async function getGraphProvider(): Promise<GraphProvider> {
  return createGraphProvider('graphify');
}

export function graphPageHref(focus: GraphFocus = {}): string {
  const params = new URLSearchParams();
  if (focus.rfc) params.set('rfc', focus.rfc);
  if (focus.repo) params.set('repo', focus.repo);
  if (focus.module) params.set('module', focus.module);
  if (focus.view) params.set('view', focus.view);
  if (focus.node) params.set('node', focus.node);
  if (focus.layer) params.set('layer', focus.layer);
  if (focus.product) params.set('product', focus.product);

  const query = params.toString();
  return query ? `${GRAPH_BASE_URL}?${query}` : GRAPH_BASE_URL;
}

export function graphEmbedSrc(
  artifacts: ReturnType<typeof detectGraphArtifacts>,
  focus: GraphFocus = {},
): string | null {
  if (!artifacts.graphHtml && !artifacts.html) return null;
  const htmlUrl = artifacts.urls?.graphHtml ?? artifacts.htmlUrl;
  const hashParts: string[] = [];
  if (focus.node) hashParts.push(`node=${encodeURIComponent(focus.node)}`);
  if (focus.rfc) hashParts.push(`rfc=${encodeURIComponent(focus.rfc)}`);
  if (focus.repo) hashParts.push(`repo=${encodeURIComponent(focus.repo)}`);
  if (focus.module) hashParts.push(`module=${encodeURIComponent(focus.module)}`);
  if (focus.view) hashParts.push(`view=${encodeURIComponent(focus.view)}`);
  if (focus.layer) hashParts.push(`layer=${encodeURIComponent(focus.layer)}`);
  const hash = hashParts.length ? `#${hashParts.join('&')}` : '';
  return `${htmlUrl}${hash}`;
}

/** @deprecated Prefer imports from `./artifacts` — kept for existing components. */
export { detectGraphArtifacts, GRAPH_BASE_URL, GRAPH_PUBLIC_DIR } from './artifacts';

export const GRAPH_SECTION_CARDS = [
  {
    id: 'rfc',
    title: 'RFC Dependency Graph',
    description:
      'Normative relationships between RFCs — supersession, related specs, and protocol dependencies.',
    view: 'rfc' as const,
  },
  {
    id: 'repository',
    title: 'Repository Dependency Graph',
    description:
      'How sensos-docs, nvs-runtime, hekb, and nvs-kernel relate as implementation surfaces.',
    view: 'repository' as const,
  },
  {
    id: 'architecture',
    title: 'Architecture Graph',
    description:
      'Observation Runtime → HEXT → HEKB → NVS Kernel → DLNP → Governance → SDRP → Applications.',
    view: 'architecture' as const,
  },
  {
    id: 'module',
    title: 'Module Graph',
    description:
      'Internal module and Layer-Port interactions once Graphify maps runtime and kernel sources.',
    view: 'module' as const,
  },
  {
    id: 'document',
    title: 'Document Graph',
    description:
      'Documentation cross-links across RFCs, product pages, governance, and developer guides.',
    view: 'document' as const,
  },
] as const;
