import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SEED_EDGES, SEED_NODES } from '../catalog';
import { detectGraphArtifacts, GRAPH_PUBLIC_DIR } from '../artifacts';
import { MemoryGraphProvider } from '../memory';
import type { GraphEdge, GraphNode } from '../types';

type LooseObject = Record<string, unknown>;

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeNode(raw: LooseObject, index: number): GraphNode | null {
  const id = String(raw.id ?? raw.name ?? raw.label ?? `node-${index}`);
  if (!id) return null;

  const typeRaw = String(raw.type ?? raw.kind ?? raw.category ?? 'unknown').toLowerCase();
  let type: GraphNode['type'] = 'unknown';
  if (typeRaw.includes('rfc')) type = 'rfc';
  else if (typeRaw.includes('repo')) type = 'repository';
  else if (typeRaw.includes('layer') || /^l[0-7]$/i.test(id)) type = 'layer';
  else if (typeRaw.includes('product')) type = 'product';
  else if (typeRaw.includes('component') || typeRaw.includes('module')) type = 'component';
  else if (typeRaw.includes('doc')) type = 'document';

  return {
    id,
    title: String(raw.title ?? raw.label ?? raw.name ?? id),
    type,
    description: String(raw.description ?? raw.summary ?? raw.text ?? ''),
    repository: raw.repository ? String(raw.repository) : undefined,
    relatedRfcs: Array.isArray(raw.relatedRfcs)
      ? raw.relatedRfcs.map(String)
      : Array.isArray(raw.related_rfcs)
        ? raw.related_rfcs.map(String)
        : undefined,
    relatedComponents: Array.isArray(raw.relatedComponents)
      ? raw.relatedComponents.map(String)
      : undefined,
    implementationStatus: raw.implementationStatus
      ? String(raw.implementationStatus)
      : raw.status
        ? String(raw.status)
        : undefined,
    canonicalUrl: raw.canonicalUrl ? String(raw.canonicalUrl) : raw.url ? String(raw.url) : undefined,
    githubUrl: raw.githubUrl ? String(raw.githubUrl) : undefined,
    docsUrl: raw.docsUrl ? String(raw.docsUrl) : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : undefined,
    raw,
  };
}

function normalizeEdge(raw: LooseObject, index: number): GraphEdge | null {
  const source = String(raw.source ?? raw.from ?? raw.src ?? '');
  const target = String(raw.target ?? raw.to ?? raw.dst ?? '');
  if (!source || !target) return null;
  const type = String(raw.type ?? raw.relation ?? raw.label ?? 'references');
  return {
    id: String(raw.id ?? `edge-${index}-${source}-${target}`),
    source,
    target,
    type,
    label: String(raw.label ?? type),
    raw,
  };
}

async function readJsonIfPresent(path: string): Promise<unknown | null> {
  try {
    const text = await readFile(path, 'utf8');
    return JSON.parse(text) as unknown;
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
  const list = asArray(obj.nodes ?? obj.items ?? obj.vertices);
  return list
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
  const list = asArray(obj.edges ?? obj.links ?? obj.relationships);
  return list
    .map((item, index) => normalizeEdge((item ?? {}) as LooseObject, index))
    .filter((edge): edge is GraphEdge => Boolean(edge));
}

function mergeNodes(seed: GraphNode[], external: GraphNode[]): GraphNode[] {
  const map = new Map<string, GraphNode>();
  for (const node of seed) map.set(node.id, node);
  for (const node of external) {
    const existing = map.get(node.id);
    map.set(node.id, existing ? { ...existing, ...node, raw: node.raw ?? existing.raw } : node);
  }
  return [...map.values()];
}

function mergeEdges(seed: GraphEdge[], external: GraphEdge[]): GraphEdge[] {
  const seen = new Set<string>();
  const out: GraphEdge[] = [];
  for (const edge of [...seed, ...external]) {
    const key = `${edge.source}|${edge.type}|${edge.target}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(edge);
  }
  return out;
}

/**
 * Current production provider.
 * Loads optional Graphify / portal graph artifacts and merges them with the seed catalog.
 *
 * Future providers (HEKBGraphProvider, Neo4jProvider, CustomAPIProvider) should implement
 * the same GraphProvider interface and be selected from createGraphProvider().
 */
export class GraphifyProvider extends MemoryGraphProvider {
  private loaded = false;

  constructor() {
    const artifacts = detectGraphArtifacts();
    super('GraphifyProvider', SEED_NODES, SEED_EDGES, {
      sources: ['seed-catalog'],
      artifacts: {
        graphJson: artifacts.graphJson,
        nodesJson: artifacts.nodesJson,
        edgesJson: artifacts.edgesJson,
        metadataJson: artifacts.metadataJson,
        graphHtml: artifacts.graphHtml,
        report: artifacts.report,
      },
      notes: [
        'Seed catalog is always available.',
        'Graphify artifacts under public/graph/ are optional and merged when present.',
      ],
    });
  }

  async ensureLoaded(cwd = process.cwd()): Promise<this> {
    if (this.loaded) return this;
    this.loaded = true;

    const dir = join(cwd, GRAPH_PUBLIC_DIR);
    const artifacts = detectGraphArtifacts(cwd);
    const [graphJson, nodesJson, edgesJson, metadataJson] = await Promise.all([
      artifacts.graphJson ? readJsonIfPresent(join(dir, 'graph.json')) : null,
      artifacts.nodesJson ? readJsonIfPresent(join(dir, 'nodes.json')) : null,
      artifacts.edgesJson ? readJsonIfPresent(join(dir, 'edges.json')) : null,
      artifacts.metadataJson ? readJsonIfPresent(join(dir, 'metadata.json')) : null,
    ]);

    const externalNodes = [...extractNodes(nodesJson), ...extractNodes(graphJson)];
    const externalEdges = [...extractEdges(edgesJson), ...extractEdges(graphJson)];
    const nodes = mergeNodes(SEED_NODES, externalNodes);
    const edges = mergeEdges(SEED_EDGES, externalEdges);

    const meta = (metadataJson ?? {}) as Record<string, unknown>;
    this.replaceGraph(nodes, edges, {
      generated_at:
        typeof meta.generated_at === 'string'
          ? meta.generated_at
          : new Date().toISOString(),
      sources: [
        'seed-catalog',
        ...(artifacts.graphJson ? ['public/graph/graph.json'] : []),
        ...(artifacts.nodesJson ? ['public/graph/nodes.json'] : []),
        ...(artifacts.edgesJson ? ['public/graph/edges.json'] : []),
        ...(artifacts.metadataJson ? ['public/graph/metadata.json'] : []),
      ],
      artifacts: {
        graphJson: artifacts.graphJson,
        nodesJson: artifacts.nodesJson,
        edgesJson: artifacts.edgesJson,
        metadataJson: artifacts.metadataJson,
        graphHtml: artifacts.graphHtml,
        report: artifacts.report,
      },
      notes: [
        'GraphifyProvider merges optional artifacts with the SensOS seed catalog.',
        'UI and MCP-facing methods remain stable across provider swaps.',
      ],
    });

    return this;
  }
}

/** Placeholder stubs reserved for future swaps — do not use in production yet. */
export class HEKBGraphProvider extends MemoryGraphProvider {
  constructor() {
    super('HEKBGraphProvider', SEED_NODES, SEED_EDGES, {
      sources: ['future:hekb'],
      notes: ['Reserved provider stub.'],
    });
  }
}

export class Neo4jProvider extends MemoryGraphProvider {
  constructor() {
    super('Neo4jProvider', SEED_NODES, SEED_EDGES, {
      sources: ['future:neo4j'],
      notes: ['Reserved provider stub.'],
    });
  }
}

export class CustomAPIProvider extends MemoryGraphProvider {
  constructor() {
    super('CustomAPIProvider', SEED_NODES, SEED_EDGES, {
      sources: ['future:custom-api'],
      notes: ['Reserved provider stub.'],
    });
  }
}
