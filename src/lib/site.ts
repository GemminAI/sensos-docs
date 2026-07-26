export const DOCS_VERSION = '0.1.0';
export const DOCS_CHANNEL = 'Developer Preview';

/** Evaluated at build time for footer / SEO. */
export const BUILD_TIME = new Date().toISOString();

export const SITE = {
  name: 'SensOS Developer Portal',
  shortName: 'SensOS',
  description:
    'Official documentation portal for the SensOS ecosystem — RFC Series, Architecture, Products, Governance, Graph, and Compliance.',
  url: 'https://sensos.org',
  repo: 'https://github.com/GemminAI/sensos-docs',
  repoPath: 'GemminAI/sensos-docs',
  editBase: 'https://github.com/GemminAI/sensos-docs/edit/main/docs',
  org: 'GemminAI',
  orgLegal: 'Gemmina Intelligence LLC.',
  copyright: 'Copyright © GemminAI',
  license: 'Documentation © GemminAI. Specifications are published for ecosystem use under repository terms.',
  licenseLabel: 'See repository LICENSE',
  licenseUrl: 'https://github.com/GemminAI/sensos-docs/blob/main/LICENSE',
  twitter: '@GemminAI',
  locale: 'en_US',
  version: DOCS_VERSION,
  channel: DOCS_CHANNEL,
} as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'RFC', href: '/rfc' },
  { label: 'Architecture', href: '/architecture' },
  { label: 'Products', href: '/products' },
  { label: 'Developer', href: '/developer' },
  { label: 'Governance', href: '/governance' },
  { label: 'Graph', href: '/graph' },
  { label: 'Compliance', href: '/compliance' },
  { label: 'GitHub', href: SITE.repo, external: true },
] as const;

export const PRODUCTS = [
  {
    slug: 'sensos',
    name: 'SensOS',
    summary:
      'Observation-centered intelligence platform and ecosystem runtime for perception, reasoning, and control pipelines.',
    repository: 'GemminAI/nvs-runtime',
    docsHref: '/products/sensos',
    status: 'Active',
  },
  {
    slug: 'hekb',
    name: 'HEKB',
    summary:
      'Immutable knowledge substrate for canonical HEXT objects, audit evidence, and constraint-boundary storage.',
    repository: 'GemminAI/hekb',
    docsHref: '/products/hekb',
    status: 'Active',
  },
  {
    slug: 'nvs-kernel',
    name: 'NVS Kernel',
    summary:
      'Semantic geometry and belief/risk evaluation engine exposing the NVS-Kernel public ABI.',
    repository: 'GemminAI/nvs-kernel',
    docsHref: '/products/nvs-kernel',
    status: 'Active',
  },
  {
    slug: 'nvs-runtime',
    name: 'NVS Runtime',
    summary:
      'Reference observation runtime implementing L-Ports, DLNP, CBAC enforcement, and SDRP distribution.',
    repository: 'GemminAI/nvs-runtime',
    docsHref: '/products/nvs-runtime',
    status: 'Active',
  },
] as const;
