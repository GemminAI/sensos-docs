export const DOCS_VERSION = '0.2.0';
export const DOCS_CHANNEL = 'Enterprise Preview';

/** Evaluated at build time for footer / SEO. */
export const BUILD_TIME = new Date().toISOString();

export const SITE = {
  name: 'SensOS',
  shortName: 'SensOS',
  description:
    'SensOS is an observation-centered runtime safety platform that observes AI behavior, detects semantic trajectory risks, and intervenes safely without modifying model weights.',
  url: 'https://sensos.org',
  repo: 'https://github.com/GemminAI/sensos-docs',
  repoPath: 'GemminAI/sensos-docs',
  editBase: 'https://github.com/GemminAI/sensos-docs/edit/main/docs',
  org: 'GemminAI',
  orgLegal: 'Gemmina Intelligence LLC.',
  copyright: 'Copyright © Gemmina Intelligence LLC.',
  license: 'Public interface standards are published for interoperability. Implementation details remain proprietary.',
  licenseLabel: 'See repository LICENSE',
  licenseUrl: 'https://github.com/GemminAI/sensos-docs/blob/main/LICENSE',
  twitter: '@GemminAI',
  locale: 'en_US',
  version: DOCS_VERSION,
  channel: DOCS_CHANNEL,
  contactEmail: 'enterprise@gemminai.com',
} as const;

/** Primary public navigation — product site with open standards. */
export const NAV = [
  { label: 'Product', href: '/' },
  { label: 'Open Standards', href: '/Open-Standards' },
  { label: 'Developers', href: '/developer' },
  { label: 'Resources', href: '/resources' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'GitHub', href: SITE.repo, external: true },
] as const;

export const PRODUCTS = [
  {
    slug: 'sensos',
    name: 'SensOS',
    summary:
      'Observation-centered runtime safety platform for production AI systems.',
    repository: 'GemminAI/sensos',
    docsHref: '/products/sensos',
    status: 'Active',
  },
  {
    slug: 'hekb',
    name: 'HEKB',
    summary:
      'Durable knowledge and audit substrate for governed AI operations.',
    repository: 'GemminAI/hekb',
    docsHref: '/products/hekb',
    status: 'Active',
  },
  {
    slug: 'nvs-kernel',
    name: 'NVS Kernel',
    summary:
      'Semantic evaluation engine exposing a public safety and observation ABI.',
    repository: 'GemminAI/nvs-kernel',
    docsHref: '/products/nvs-kernel',
    status: 'Active',
  },
  {
    slug: 'nvs-runtime',
    name: 'NVS Runtime',
    summary:
      'Observation runtime implementing public interoperability contracts.',
    repository: 'GemminAI/nvs-runtime',
    docsHref: '/products/nvs-runtime',
    status: 'Active',
  },
  {
    slug: 'meaning-mapper',
    name: 'Meaning Mapper',
    summary:
      'Reference service that maps raw observations into HEXT Observation Objects.',
    repository: 'GemminAI/meaning-mapper',
    docsHref: '/products/meaning-mapper',
    status: 'Active',
  },
] as const;
