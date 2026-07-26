import type {
  GraphEdge,
  GraphMetadata,
  GraphNeighbor,
  GraphNode,
  GraphNodeType,
  GraphPath,
  GraphProvider,
  GraphSearchHit,
} from './types';

/** Shared in-memory graph operations used by seed and Graphify-backed providers. */
export class MemoryGraphProvider implements GraphProvider {
  readonly name: string;
  protected nodes = new Map<string, GraphNode>();
  protected edges: GraphEdge[] = [];
  protected metadataExtras: Partial<GraphMetadata> = {};

  constructor(name: string, nodes: GraphNode[], edges: GraphEdge[], metadataExtras: Partial<GraphMetadata> = {}) {
    this.name = name;
    this.replaceGraph(nodes, edges, metadataExtras);
  }

  replaceGraph(nodes: GraphNode[], edges: GraphEdge[], metadataExtras: Partial<GraphMetadata> = {}) {
    this.nodes = new Map(nodes.map((node) => [node.id, node]));
    this.edges = edges;
    this.metadataExtras = metadataExtras;
  }

  getMetadata(): GraphMetadata {
    return {
      provider: this.name,
      schema_version: '1.0.0',
      generated_at: this.metadataExtras.generated_at ?? null,
      node_count: this.nodes.size,
      edge_count: this.edges.length,
      sources: this.metadataExtras.sources ?? ['seed-catalog'],
      relationship_types: [
        ...new Set(this.edges.map((edge) => String(edge.type))),
      ].sort(),
      artifacts: this.metadataExtras.artifacts ?? {
        graphJson: false,
        nodesJson: false,
        edgesJson: false,
        metadataJson: false,
        graphHtml: false,
        report: false,
      },
      notes: this.metadataExtras.notes,
    };
  }

  getNode(id: string): GraphNode | null {
    return this.nodes.get(id) ?? this.findLoose(id);
  }

  protected findLoose(id: string): GraphNode | null {
    const lower = id.toLowerCase();
    for (const node of this.nodes.values()) {
      if (node.id.toLowerCase() === lower) return node;
      if (node.title.toLowerCase() === lower) return node;
    }
    return null;
  }

  getNeighbors(id: string): GraphNeighbor[] {
    const node = this.getNode(id);
    if (!node) return [];

    const results: GraphNeighbor[] = [];
    for (const edge of this.edges) {
      if (edge.source === node.id) {
        const target = this.nodes.get(edge.target);
        if (target) results.push({ edge, node: target, direction: 'outgoing' });
      } else if (edge.target === node.id) {
        const source = this.nodes.get(edge.source);
        if (source) results.push({ edge, node: source, direction: 'incoming' });
      }
    }
    return results;
  }

  search(query: string, limit = 20): GraphSearchHit[] {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [...this.nodes.values()].slice(0, limit).map((node) => ({
        node,
        score: 0,
        matchedOn: [],
      }));
    }

    const hits: GraphSearchHit[] = [];
    for (const node of this.nodes.values()) {
      const matchedOn: string[] = [];
      let score = 0;
      const fields: Array<[string, string | undefined]> = [
        ['id', node.id],
        ['title', node.title],
        ['type', node.type],
        ['description', node.description],
        ['repository', node.repository],
        ['status', node.implementationStatus],
        ['tags', node.tags?.join(' ')],
        ['relatedRfcs', node.relatedRfcs?.join(' ')],
        ['relatedComponents', node.relatedComponents?.join(' ')],
      ];

      for (const [key, value] of fields) {
        if (!value) continue;
        const hay = value.toLowerCase();
        if (hay === q) {
          matchedOn.push(key);
          score += 100;
        } else if (hay.startsWith(q)) {
          matchedOn.push(key);
          score += 60;
        } else if (hay.includes(q)) {
          matchedOn.push(key);
          score += 30;
        }
      }

      if (score > 0) hits.push({ node, score, matchedOn });
    }

    return hits.sort((a, b) => b.score - a.score || a.node.id.localeCompare(b.node.id)).slice(0, limit);
  }

  getPath(fromId: string, toId: string): GraphPath | null {
    const start = this.getNode(fromId);
    const goal = this.getNode(toId);
    if (!start || !goal) return null;
    if (start.id === goal.id) return { nodes: [start], edges: [] };

    const queue: string[] = [start.id];
    const prev = new Map<string, { id: string; edge: GraphEdge }>();
    const seen = new Set<string>([start.id]);

    while (queue.length) {
      const current = queue.shift()!;
      for (const neighbor of this.getNeighbors(current)) {
        if (seen.has(neighbor.node.id)) continue;
        seen.add(neighbor.node.id);
        prev.set(neighbor.node.id, { id: current, edge: neighbor.edge });
        if (neighbor.node.id === goal.id) {
          return this.rebuildPath(start.id, goal.id, prev);
        }
        queue.push(neighbor.node.id);
      }
    }
    return null;
  }

  private rebuildPath(
    fromId: string,
    toId: string,
    prev: Map<string, { id: string; edge: GraphEdge }>,
  ): GraphPath {
    const nodeIds: string[] = [toId];
    const edges: GraphEdge[] = [];
    let cursor = toId;
    while (cursor !== fromId) {
      const step = prev.get(cursor);
      if (!step) break;
      edges.unshift(step.edge);
      nodeIds.unshift(step.id);
      cursor = step.id;
    }
    return {
      nodes: nodeIds.map((id) => this.nodes.get(id)!).filter(Boolean),
      edges,
    };
  }

  listByType(type: GraphNodeType): GraphNode[] {
    return [...this.nodes.values()].filter((node) => node.type === type);
  }

  listNodes(): GraphNode[] {
    return [...this.nodes.values()];
  }

  listEdges(): GraphEdge[] {
    return [...this.edges];
  }
}
