import { DEFAULT_BREADCRUMB_PATH, EXPLORER_GROUPS, SEED_EDGES, SEED_NODES } from './catalog';
import { MemoryGraphProvider } from './memory';
import type { GraphEdge, GraphFocus, GraphMetadata, GraphNode, GraphProvider } from './types';

type LooseObject = Record<string, unknown>;

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeNode(raw: LooseObject, index: number): GraphNode | null {
  const id = String(raw.id ?? raw.name ?? raw.label ?? `node-${index}`);
  if (!id) return null;
  const typeRaw = String(raw.type ?? raw.kind ?? 'unknown').toLowerCase();
  let type: GraphNode['type'] = 'unknown';
  if (typeRaw.includes('rfc') || id.startsWith('RFC-')) type = 'rfc';
  else if (typeRaw.includes('repo') || id.includes('/')) type = 'repository';
  else if (typeRaw.includes('layer') || /^l[0-7]$/i.test(id)) type = 'layer';
  else if (typeRaw.includes('product') || id.startsWith('product-') || id.startsWith('product:')) type = 'product';
  else if (typeRaw.includes('component') || typeRaw.includes('module')) type = 'component';

  return {
    id,
    title: String(raw.title ?? raw.label ?? raw.name ?? id),
    type,
    description: String(raw.description ?? raw.summary ?? ''),
    repository: raw.repository ? String(raw.repository) : undefined,
    relatedRfcs: Array.isArray(raw.relatedRfcs) ? raw.relatedRfcs.map(String) : undefined,
    relatedComponents: Array.isArray(raw.relatedComponents)
      ? raw.relatedComponents.map(String)
      : undefined,
    implementationStatus: raw.implementationStatus
      ? String(raw.implementationStatus)
      : raw.status
        ? String(raw.status)
        : undefined,
    canonicalUrl: raw.canonicalUrl ? String(raw.canonicalUrl) : undefined,
    githubUrl: raw.githubUrl ? String(raw.githubUrl) : undefined,
    docsUrl: raw.docsUrl ? String(raw.docsUrl) : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : undefined,
    raw,
  };
}

function normalizeEdge(raw: LooseObject, index: number): GraphEdge | null {
  const source = String(raw.source ?? raw.from ?? '');
  const target = String(raw.target ?? raw.to ?? '');
  if (!source || !target) return null;
  const type = String(raw.type ?? raw.relation ?? raw.label ?? 'references');
  return {
    id: String(raw.id ?? `edge-${index}`),
    source,
    target,
    type,
    label: String(raw.label ?? type),
    raw,
  };
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function extractNodes(payload: unknown): GraphNode[] {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload
      .map((item, index) => normalizeNode((item ?? {}) as LooseObject, index))
      .filter((node): node is GraphNode => Boolean(node));
  }
  const obj = payload as LooseObject;
  return asArray(obj.nodes ?? obj.items)
    .map((item, index) => normalizeNode((item ?? {}) as LooseObject, index))
    .filter((node): node is GraphNode => Boolean(node));
}

function extractEdges(payload: unknown): GraphEdge[] {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload
      .map((item, index) => normalizeEdge((item ?? {}) as LooseObject, index))
      .filter((edge): edge is GraphEdge => Boolean(edge));
  }
  const obj = payload as LooseObject;
  return asArray(obj.edges ?? obj.links)
    .map((item, index) => normalizeEdge((item ?? {}) as LooseObject, index))
    .filter((edge): edge is GraphEdge => Boolean(edge));
}

/**
 * Browser GraphProvider loader.
 * Starts with seed data immediately, then lazily merges optional public/graph artifacts.
 */
export async function loadClientGraphProvider(): Promise<{
  provider: GraphProvider;
  metadata: GraphMetadata;
}> {
  const provider = new MemoryGraphProvider('GraphifyProvider', SEED_NODES, SEED_EDGES, {
    sources: ['seed-catalog'],
    artifacts: {
      graphJson: false,
      nodesJson: false,
      edgesJson: false,
      metadataJson: false,
      graphHtml: false,
      report: false,
    },
  });

  const [graphJson, nodesJson, edgesJson, metadataJson, htmlHead, reportHead] = await Promise.all([
    fetchJson('/graph/graph.json'),
    fetchJson('/graph/nodes.json'),
    fetchJson('/graph/edges.json'),
    fetchJson('/graph/metadata.json'),
    fetch('/graph/graph.html', { method: 'HEAD' }).then((r) => r.ok).catch(() => false),
    fetch('/graph/GRAPH_REPORT.md', { method: 'HEAD' }).then((r) => r.ok).catch(() => false),
  ]);

  const externalNodes = [...extractNodes(nodesJson), ...extractNodes(graphJson)];
  const externalEdges = [...extractEdges(edgesJson), ...extractEdges(graphJson)];

  const nodeMap = new Map(SEED_NODES.map((node) => [node.id, node]));
  for (const node of externalNodes) {
    const existing = nodeMap.get(node.id);
    nodeMap.set(node.id, existing ? { ...existing, ...node } : node);
  }

  const edgeKeys = new Set<string>();
  const edges: GraphEdge[] = [];
  for (const edge of [...SEED_EDGES, ...externalEdges]) {
    const key = `${edge.source}|${edge.type}|${edge.target}`;
    if (edgeKeys.has(key)) continue;
    edgeKeys.add(key);
    edges.push(edge);
  }

  const meta = (metadataJson ?? {}) as LooseObject;
  provider.replaceGraph([...nodeMap.values()], edges, {
    generated_at: typeof meta.generated_at === 'string' ? meta.generated_at : null,
    sources: [
      'seed-catalog',
      ...(graphJson ? ['/graph/graph.json'] : []),
      ...(nodesJson ? ['/graph/nodes.json'] : []),
      ...(edgesJson ? ['/graph/edges.json'] : []),
      ...(metadataJson ? ['/graph/metadata.json'] : []),
    ],
    artifacts: {
      graphJson: Boolean(graphJson),
      nodesJson: Boolean(nodesJson),
      edgesJson: Boolean(edgesJson),
      metadataJson: Boolean(metadataJson),
      graphHtml: Boolean(htmlHead),
      report: Boolean(reportHead),
    },
  });

  return { provider, metadata: provider.getMetadata() };
}

export function parseFocusFromLocation(search: string): GraphFocus {
  const params = new URLSearchParams(search);
  return {
    rfc: params.get('rfc') ?? undefined,
    repo: params.get('repo') ?? undefined,
    module: params.get('module') ?? undefined,
    view: (params.get('view') as GraphFocus['view']) ?? undefined,
    node: params.get('node') ?? undefined,
    layer: params.get('layer') ?? undefined,
    product: params.get('product') ?? undefined,
  };
}

export function resolveInitialNodeId(provider: GraphProvider, focus: GraphFocus): string {
  const candidates = [
    focus.node,
    focus.rfc,
    focus.repo,
    focus.module,
    focus.layer,
    focus.product,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const node = provider.getNode(candidate);
    if (node && !(node instanceof Promise)) return node.id;
  }

  if (focus.view === 'architecture') return 'L-Port';
  if (focus.view === 'rfc') return 'RFC-NVS-0200';
  if (focus.view === 'repository') return 'GemminAI/nvs-runtime';
  if (focus.view === 'product') return 'product:sensos';
  if (focus.view === 'layer') return 'L0';

  return DEFAULT_BREADCRUMB_PATH[0];
}

export { EXPLORER_GROUPS, DEFAULT_BREADCRUMB_PATH, SEED_NODES };
