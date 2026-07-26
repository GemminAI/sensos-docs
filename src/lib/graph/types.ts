/** Canonical relationship labels displayed in the Graph UI and future MCP consumers. */
export const RELATIONSHIP_TYPES = [
  'defines',
  'implements',
  'references',
  'depends_on',
  'belongs_to',
  'supersedes',
  'superseded_by',
  'derived_from',
  'consumes',
  'produces',
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

export type GraphNodeType =
  | 'rfc'
  | 'repository'
  | 'layer'
  | 'product'
  | 'component'
  | 'document'
  | 'unknown';

export type ImplementationStatus =
  | 'Specified'
  | 'Partial'
  | 'Implemented'
  | 'CI Verified'
  | 'Placeholder'
  | 'Active'
  | 'Proposed'
  | string;

export interface GraphNode {
  id: string;
  title: string;
  type: GraphNodeType;
  description: string;
  repository?: string;
  relatedRfcs?: string[];
  relatedComponents?: string[];
  implementationStatus?: ImplementationStatus;
  canonicalUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  tags?: string[];
  /** Optional Graphify / provider-specific payload */
  raw?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType | string;
  label?: string;
  raw?: Record<string, unknown>;
}

export interface GraphNeighbor {
  edge: GraphEdge;
  node: GraphNode;
  direction: 'outgoing' | 'incoming';
}

export interface GraphPath {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphSearchHit {
  node: GraphNode;
  score: number;
  matchedOn: string[];
}

export interface GraphMetadata {
  provider: string;
  schema_version: string;
  generated_at?: string | null;
  node_count: number;
  edge_count: number;
  sources: string[];
  relationship_types: string[];
  artifacts: {
    graphJson: boolean;
    nodesJson: boolean;
    edgesJson: boolean;
    metadataJson: boolean;
    graphHtml: boolean;
    report: boolean;
  };
  notes?: string[];
}

export interface GraphFocus {
  rfc?: string;
  repo?: string;
  module?: string;
  view?: 'architecture' | 'rfc' | 'repository' | 'module' | 'document' | 'layer' | 'product';
  node?: string;
  layer?: string;
  product?: string;
}

/**
 * Provider-agnostic graph API.
 * Future MCP servers can call these methods without UI changes.
 */
export interface GraphProvider {
  readonly name: string;
  getMetadata(): Promise<GraphMetadata> | GraphMetadata;
  getNode(id: string): Promise<GraphNode | null> | GraphNode | null;
  getNeighbors(id: string): Promise<GraphNeighbor[]> | GraphNeighbor[];
  search(query: string, limit?: number): Promise<GraphSearchHit[]> | GraphSearchHit[];
  getPath(fromId: string, toId: string): Promise<GraphPath | null> | GraphPath | null;
  listByType?(type: GraphNodeType): Promise<GraphNode[]> | GraphNode[];
  listNodes?(): Promise<GraphNode[]> | GraphNode[];
  listEdges?(): Promise<GraphEdge[]> | GraphEdge[];
}

export type GraphArtifactFlags = {
  graphJson: boolean;
  nodesJson: boolean;
  edgesJson: boolean;
  metadataJson: boolean;
  graphHtml: boolean;
  report: boolean;
};

export type GraphExplorerGroup = {
  id: string;
  label: string;
  type: GraphNodeType;
  nodeIds: string[];
};
