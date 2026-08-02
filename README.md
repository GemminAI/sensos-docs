# SensOS Developer Portal

> **AI agents and contributors: read [`README_FIRST.md`](./README_FIRST.md) before any RFC.**
> It is the constitution of this repository (canonical sources, classification, implementation boundaries).

Official documentation portal for the **SensOS** ecosystem.

| | |
|---|---|
| **Site** | https://sensos.org |
| **Version** | 0.1.0 Developer Preview |
| **Repository** | https://github.com/GemminAI/sensos-docs |

This repository is the Single Source of Truth (SSOT) for RFCs, architecture contracts, product identities, governance, Graph navigation metadata, and compliance indexes.

It is **not** a marketing site and does **not** host runtime implementation sources.

## Project Overview

Built with [Astro](https://astro.build) as a static site for GitHub Pages:

- Markdown RFC content collections under `docs/rfc/`
- Shared navigation, dark mode, responsive layout
- GraphProvider-backed semantic explorer (`/graph`)
- Machine-readable JSON under `/api/v1/*` and `/compliance/index.json`

Audience: developers, researchers, reviewers, contributors, and tooling agents.

## Local Development

```bash
npm ci
npm run dev
```

Open http://localhost:4321

```bash
npm run build    # output → dist/
npm run preview  # serve dist locally
npm run check    # Astro/TS check
```

Requires Node.js 20+.

## GitHub Pages

- Workflow: `.github/workflows/ci.yml`
- Build artifact: `dist/`
- Custom domain: `public/CNAME` → `sensos.org`
- Pushes to `main` build and deploy to GitHub Pages

Ensure the GitHub Pages source is **GitHub Actions** and the custom domain DNS points to Pages.

## Directory Structure

```text
docs/
├── index.md
├── rfc/                 # RFC markdown (SSOT body)
├── architecture/
├── products/
├── governance/
├── developer/
├── graph/               # Graphify integration notes
└── compliance/
public/
├── CNAME
├── robots.txt
├── favicon.svg
├── og.svg
├── compliance/index.json
└── graph/               # optional Graphify outputs
src/
├── components/
├── layouts/
├── lib/graph/           # GraphProvider abstraction
├── pages/               # routes + API JSON endpoints
└── styles/
```

## Adding RFCs

1. Add `docs/rfc/RFC-….md` with frontmatter:

```yaml
---
title: Example Title
status: Proposed
category: Runtime protocol
version: "1.0.0"
updated: 2026-07-26
repository: GemminAI/nvs-runtime
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0199
---
```

2. Open a PR against `main`.
3. Follow change control in [RFC-NVS-GOV-0001](https://sensos.org/rfc/RFC-NVS-GOV-0001).
4. Do not manually treat `/compliance/index.json` as authoritative.

## Graph Integration

Optional visualization + semantic navigation:

```bash
pip install graphifyy
graphify .
mkdir -p public/graph
cp graphify-out/graph.html graphify-out/graph.json graphify-out/GRAPH_REPORT.md public/graph/
```

Details: [`docs/graph/README.md`](docs/graph/README.md)

The site builds successfully when `public/graph/` is empty (seed catalog fallback).

## Compliance API

| Path | Purpose |
|---|---|
| `/compliance/index.json` | Health metrics + per-RFC matrix |
| `/api/v1/rfc.json` | RFC index |
| `/api/v1/rfc/{id}.json` | RFC metadata + markdown |
| `/api/v1/products.json` | Product identity map |
| `/api/v1/graph/metadata.json` | GraphProvider metadata |
| `/api/v1/graph/nodes.json` | Graph nodes |
| `/api/v1/graph/edges.json` | Graph edges |
| `/api/v1/graph/node/{id}.json` | Node + neighbors |

## Related repositories

| Repository | URL |
|---|---|
| SensOS Docs (this repo) | https://github.com/GemminAI/sensos-docs |
| NVS Runtime | https://github.com/GemminAI/nvs-runtime |

## Release docs

- [CHANGELOG.md](./CHANGELOG.md)
- [RELEASE_NOTES_v0.1.md](./RELEASE_NOTES_v0.1.md)
- [LAUNCH_READINESS.md](./LAUNCH_READINESS.md)

## License

Copyright © GemminAI. See [LICENSE](./LICENSE).
