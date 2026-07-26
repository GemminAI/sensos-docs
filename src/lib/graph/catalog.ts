import type { GraphEdge, GraphExplorerGroup, GraphNode } from './types';

const SITE = 'https://sensos.org';

function rfc(
  id: string,
  title: string,
  description: string,
  repository: string,
  status: string,
  related: string[],
  components: string[],
): GraphNode {
  return {
    id,
    title,
    type: 'rfc',
    description,
    repository,
    relatedRfcs: related,
    relatedComponents: components,
    implementationStatus: status,
    canonicalUrl: `${SITE}/rfc/${id}`,
    githubUrl: `https://github.com/${repository}`,
    docsUrl: `${SITE}/rfc/${id}`,
    tags: ['rfc'],
  };
}

function repo(id: string, title: string, description: string, docsUrl: string): GraphNode {
  return {
    id,
    title,
    type: 'repository',
    description,
    repository: id,
    implementationStatus: 'Active',
    canonicalUrl: `${SITE}/repositories/${id.split('/')[1]}`,
    githubUrl: `https://github.com/${id}`,
    docsUrl,
    tags: ['repository'],
  };
}

function layer(
  id: string,
  title: string,
  description: string,
  relatedRfcs: string[],
  relatedComponents: string[],
): GraphNode {
  return {
    id,
    title,
    type: 'layer',
    description,
    relatedRfcs,
    relatedComponents,
    implementationStatus: 'Specified',
    canonicalUrl: `${SITE}/architecture#${id.toLowerCase()}`,
    docsUrl: `${SITE}/architecture#${id.toLowerCase()}`,
    tags: ['layer', 'runtime'],
  };
}

function product(
  id: string,
  title: string,
  description: string,
  repository: string,
  docsSlug: string,
): GraphNode {
  return {
    id,
    title,
    type: 'product',
    description,
    repository,
    implementationStatus: 'Active',
    canonicalUrl: `${SITE}/products/${docsSlug}`,
    githubUrl: `https://github.com/${repository}`,
    docsUrl: `${SITE}/products/${docsSlug}`,
    tags: ['product'],
  };
}

function component(
  id: string,
  title: string,
  description: string,
  repository: string,
  relatedRfcs: string[],
): GraphNode {
  return {
    id,
    title,
    type: 'component',
    description,
    repository,
    relatedRfcs,
    relatedComponents: [],
    implementationStatus: 'Specified',
    canonicalUrl: `${SITE}/graph?node=${encodeURIComponent(id)}`,
    githubUrl: `https://github.com/${repository}`,
    docsUrl: `${SITE}/architecture`,
    tags: ['component'],
  };
}

/** Built-in SensOS semantic catalog used when Graphify artifacts are absent. */
export const SEED_NODES: GraphNode[] = [
  rfc(
    'RFC-NVS-GOV-0001',
    'SensOS Ecosystem Master Governance Specification',
    'Normative governance, change control, and compliance machine interfaces for the SensOS ecosystem.',
    'GemminAI/sensos-docs',
    'Normative',
    ['RFC-NVS-0199', 'RFC-NVS-0202'],
    ['Portal SSOT', 'RFC Editorial Board'],
  ),
  rfc(
    'RFC-NVS-0199',
    'NVS Capability-Based Access Control',
    'CBAC token model, scopes, delegation hops, and revocation for SensOS privileged actions.',
    'GemminAI/nvs-runtime',
    'Proposed',
    ['RFC-NVS-0200', 'RFC-NVS-0201', 'RFC-NVS-0202', 'RFC-NVS-GOV-0001'],
    ['CBAC', 'KMS', 'root_token_hash'],
  ),
  rfc(
    'RFC-NVS-0200',
    'NVS Model Context Protocol and Layer-Port ABI',
    'Defines L-Ports, L-ABI packet contracts, and L0–L7 layer responsibilities.',
    'GemminAI/nvs-runtime',
    'Proposed',
    ['RFC-NVS-0199', 'RFC-NVS-0201', 'RFC-NVS-0203'],
    ['L-Port', 'L-ABI', 'HEXT', 'content_id'],
  ),
  rfc(
    'RFC-NVS-0201',
    'Dynamic Layer Negotiation Protocol',
    'Discovery, negotiation, planning, binding, and observation lifecycle for L-Port pipelines.',
    'GemminAI/nvs-runtime',
    'Proposed',
    ['RFC-NVS-0199', 'RFC-NVS-0200', 'RFC-NVS-0202', 'RFC-NVS-0203'],
    ['DLNP', 'Pipeline Binder'],
  ),
  rfc(
    'RFC-NVS-0202',
    'SensOS Runtime Governance and Resource Management',
    'Admission control, budgets, cancellation, isolation, and immutable audit evidence.',
    'GemminAI/nvs-runtime',
    'Proposed',
    ['RFC-NVS-0199', 'RFC-NVS-0201', 'RFC-NVS-0203', 'RFC-NVS-GOV-0001'],
    ['Runtime Governance', 'Quota Engine'],
  ),
  rfc(
    'RFC-NVS-0203',
    'SensOS Distributed Runtime Protocol',
    'Cross-node attestation, remote L-Ports, budget propagation, and recovery boundaries.',
    'GemminAI/nvs-runtime',
    'Proposed',
    ['RFC-NVS-0199', 'RFC-NVS-0200', 'RFC-NVS-0201', 'RFC-NVS-0202'],
    ['SDRP', 'QUIC budget header'],
  ),

  repo(
    'GemminAI/sensos-docs',
    'sensos-docs',
    'Official SensOS Developer Portal — documentation SSOT and Graph surface.',
    `${SITE}/`,
  ),
  repo(
    'GemminAI/nvs-runtime',
    'nvs-runtime',
    'Reference observation runtime implementing L-Ports, DLNP, CBAC, and SDRP.',
    `${SITE}/products/nvs-runtime`,
  ),
  repo(
    'GemminAI/hekb',
    'hekb',
    'Immutable knowledge substrate for canonical HEXT objects and audit evidence.',
    `${SITE}/products/hekb`,
  ),
  repo(
    'GemminAI/nvs-kernel',
    'nvs-kernel',
    'Semantic geometry and belief/risk evaluation engine (NVS Kernel ABI).',
    `${SITE}/products/nvs-kernel`,
  ),

  layer('L0', 'L0 Ingest', 'Raw multimodal ingress and normalization.', ['RFC-NVS-0200'], ['Observation Runtime']),
  layer('L1', 'L1 Observe', 'Observation metadata: source, time, confidence.', ['RFC-NVS-0200'], ['Observation Runtime']),
  layer('L2', 'L2 Annotate', 'Semantic feature annotation.', ['RFC-NVS-0200'], ['Semantic Annotator']),
  layer('L3', 'L3 Store', 'HEXT canonicalization and immutable persistence.', ['RFC-NVS-0200'], ['HEXT', 'HEKB']),
  layer('L4', 'L4 Geometry', 'Semantic geometry over canonical HEXT.', ['RFC-NVS-0200'], ['NVS Kernel']),
  layer('L5', 'L5 Belief / Risk', 'Belief update and safety-boundary evaluation.', ['RFC-NVS-0200'], ['NVS Kernel']),
  layer('L6', 'L6 Control', 'Cybernetic control decisions.', ['RFC-NVS-0199', 'RFC-NVS-0200'], ['Control Node']),
  layer('L7', 'L7 Execute', 'Authorized policy application and outcomes.', ['RFC-NVS-0199', 'RFC-NVS-0200'], ['Execution Adapter']),

  product('product-sensos', 'SensOS', 'Observation-centered intelligence platform.', 'GemminAI/nvs-runtime', 'sensos'),
  product('product-hekb', 'HEKB', 'Immutable knowledge substrate.', 'GemminAI/hekb', 'hekb'),
  product('product-nvs-kernel', 'NVS Kernel', 'Geometry and belief/risk engine.', 'GemminAI/nvs-kernel', 'nvs-kernel'),
  product('product-nvs-runtime', 'NVS Runtime', 'Reference observation runtime.', 'GemminAI/nvs-runtime', 'nvs-runtime'),

  component('L-Port', 'L-Port', 'Self-describing runtime interface represented as a HEXT port object.', 'GemminAI/nvs-runtime', [
    'RFC-NVS-0200',
    'RFC-NVS-0201',
  ]),
  component('HEXT', 'HEXT', 'Canonical object model after L3 canonicalization.', 'GemminAI/hekb', ['RFC-NVS-0200']),
  component('HEKB', 'HEKB Substrate', 'Immutable store for HEXT and audit objects.', 'GemminAI/hekb', [
    'RFC-NVS-0200',
    'RFC-NVS-0202',
  ]),
  component('DLNP', 'DLNP', 'Dynamic Layer Negotiation Protocol engine.', 'GemminAI/nvs-runtime', [
    'RFC-NVS-0201',
    'RFC-NVS-0202',
  ]),
  component('SDRP', 'SDRP', 'Distributed runtime mesh protocol.', 'GemminAI/nvs-runtime', ['RFC-NVS-0203']),
  component('CBAC', 'CBAC', 'Capability-Based Access Control engine.', 'GemminAI/nvs-runtime', ['RFC-NVS-0199']),
  component('Runtime Governance', 'Runtime Governance', 'Admission, budget, cancellation, and audit controls.', 'GemminAI/nvs-runtime', [
    'RFC-NVS-0202',
  ]),
  component('NVS Kernel', 'NVS Kernel Engine', 'L4–L5 semantic geometry and risk evaluation.', 'GemminAI/nvs-kernel', [
    'RFC-NVS-0200',
  ]),
  component('Observation Runtime', 'Observation Runtime', 'Ingress and L0–L1 observation pipeline host.', 'GemminAI/nvs-runtime', [
    'RFC-NVS-0200',
  ]),
];

function edge(
  id: string,
  source: string,
  target: string,
  type: GraphEdge['type'],
): GraphEdge {
  return { id, source, target, type, label: String(type) };
}

/** Seed edges encoding the normative SensOS relationship skeleton. */
export const SEED_EDGES: GraphEdge[] = [
  edge('e1', 'RFC-NVS-0200', 'L-Port', 'defines'),
  edge('e2', 'RFC-NVS-0200', 'HEXT', 'defines'),
  edge('e3', 'RFC-NVS-0201', 'DLNP', 'defines'),
  edge('e4', 'RFC-NVS-0203', 'SDRP', 'defines'),
  edge('e5', 'RFC-NVS-0199', 'CBAC', 'defines'),
  edge('e6', 'RFC-NVS-0202', 'Runtime Governance', 'defines'),
  edge('e7', 'GemminAI/nvs-runtime', 'RFC-NVS-0199', 'implements'),
  edge('e8', 'GemminAI/nvs-runtime', 'RFC-NVS-0200', 'implements'),
  edge('e9', 'GemminAI/nvs-runtime', 'RFC-NVS-0201', 'implements'),
  edge('e10', 'GemminAI/nvs-runtime', 'RFC-NVS-0202', 'implements'),
  edge('e11', 'GemminAI/nvs-runtime', 'RFC-NVS-0203', 'implements'),
  edge('e12', 'GemminAI/nvs-kernel', 'NVS Kernel', 'implements'),
  edge('e13', 'GemminAI/hekb', 'HEKB', 'implements'),
  edge('e14', 'RFC-NVS-0201', 'RFC-NVS-0200', 'depends_on'),
  edge('e15', 'RFC-NVS-0201', 'RFC-NVS-0199', 'depends_on'),
  edge('e16', 'RFC-NVS-0202', 'RFC-NVS-0199', 'depends_on'),
  edge('e17', 'RFC-NVS-0202', 'RFC-NVS-0201', 'depends_on'),
  edge('e18', 'RFC-NVS-0203', 'RFC-NVS-0201', 'depends_on'),
  edge('e19', 'RFC-NVS-0203', 'RFC-NVS-0199', 'depends_on'),
  edge('e20', 'RFC-NVS-0200', 'RFC-NVS-0199', 'references'),
  edge('e21', 'L-Port', 'GemminAI/nvs-runtime', 'belongs_to'),
  edge('e22', 'DLNP', 'GemminAI/nvs-runtime', 'belongs_to'),
  edge('e23', 'SDRP', 'GemminAI/nvs-runtime', 'belongs_to'),
  edge('e24', 'HEXT', 'HEKB', 'consumes'),
  edge('e25', 'HEKB', 'HEXT', 'produces'),
  edge('e26', 'L3', 'HEXT', 'produces'),
  edge('e27', 'L4', 'NVS Kernel', 'belongs_to'),
  edge('e28', 'L5', 'NVS Kernel', 'belongs_to'),
  edge('e29', 'Observation Runtime', 'L0', 'produces'),
  edge('e30', 'Observation Runtime', 'L1', 'produces'),
  edge('e31', 'product-nvs-runtime', 'GemminAI/nvs-runtime', 'belongs_to'),
  edge('e32', 'product-hekb', 'GemminAI/hekb', 'belongs_to'),
  edge('e33', 'product-nvs-kernel', 'GemminAI/nvs-kernel', 'belongs_to'),
  edge('e34', 'product-sensos', 'GemminAI/nvs-runtime', 'depends_on'),
  edge('e35', 'RFC-NVS-GOV-0001', 'GemminAI/sensos-docs', 'belongs_to'),
  edge('e36', 'L-Port', 'DLNP', 'consumes'),
  edge('e37', 'DLNP', 'SDRP', 'derived_from'),
  edge('e38', 'CBAC', 'DLNP', 'references'),
  edge('e39', 'Runtime Governance', 'DLNP', 'references'),
  edge('e40', 'L0', 'L1', 'depends_on'),
  edge('e41', 'L1', 'L2', 'depends_on'),
  edge('e42', 'L2', 'L3', 'depends_on'),
  edge('e43', 'L3', 'L4', 'depends_on'),
  edge('e44', 'L4', 'L5', 'depends_on'),
  edge('e45', 'L5', 'L6', 'depends_on'),
  edge('e46', 'L6', 'L7', 'depends_on'),
];

/** Canonical breadcrumb example path for the Graph page default. */
export const DEFAULT_BREADCRUMB_PATH = [
  'RFC-NVS-0200',
  'L-Port',
  'GemminAI/nvs-runtime',
  'DLNP',
  'SDRP',
] as const;

export const EXPLORER_GROUPS: GraphExplorerGroup[] = [
  {
    id: 'rfcs',
    label: 'RFCs',
    type: 'rfc',
    nodeIds: SEED_NODES.filter((n) => n.type === 'rfc').map((n) => n.id),
  },
  {
    id: 'repositories',
    label: 'Repositories',
    type: 'repository',
    nodeIds: SEED_NODES.filter((n) => n.type === 'repository').map((n) => n.id),
  },
  {
    id: 'layers',
    label: 'Runtime Layers',
    type: 'layer',
    nodeIds: ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
  },
  {
    id: 'products',
    label: 'Products',
    type: 'product',
    nodeIds: SEED_NODES.filter((n) => n.type === 'product').map((n) => n.id),
  },
  {
    id: 'components',
    label: 'Architecture Components',
    type: 'component',
    nodeIds: SEED_NODES.filter((n) => n.type === 'component').map((n) => n.id),
  },
];

export const REPOSITORIES = [
  {
    slug: 'sensos-docs',
    id: 'GemminAI/sensos-docs',
    name: 'sensos-docs',
    overview:
      'Official SensOS Developer Portal and documentation SSOT. Publishes RFCs, architecture, governance, compliance, and the Graph semantic navigation layer.',
    architecture:
      'Static Astro site with Markdown RFCs, GraphProvider-backed exploration, and machine-readable JSON APIs.',
  },
  {
    slug: 'nvs-runtime',
    id: 'GemminAI/nvs-runtime',
    name: 'nvs-runtime',
    overview:
      'Reference observation runtime for SensOS. Hosts L-Ports, CBAC enforcement, DLNP pipelines, runtime governance, and SDRP distribution.',
    architecture:
      'Observation-centered runtime spanning L0–L7 with MCP surfaces, negotiation, and distributed mesh support.',
  },
  {
    slug: 'hekb',
    id: 'GemminAI/hekb',
    name: 'hekb',
    overview:
      'Immutable knowledge substrate for canonical HEXT objects, constraint boundaries, and audit evidence.',
    architecture:
      'Append-oriented knowledge boundary focused on canonical identity after L3, not a broad world-model KB.',
  },
  {
    slug: 'nvs-kernel',
    id: 'GemminAI/nvs-kernel',
    name: 'nvs-kernel',
    overview:
      'NVS Kernel engine for semantic geometry (L4) and belief/risk evaluation (L5).',
    architecture:
      'C-ABI oriented kernel workload isolated from observation ingress and application surfaces.',
  },
] as const;
