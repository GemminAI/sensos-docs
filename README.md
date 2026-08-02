# SensOS Developer Portal

> **AI agents and contributors:**
>
> Before reading any RFC, **MUST** read the following documents in order:
>
> 1. [`README_FIRST.md`](./README_FIRST.md)
> 2. [`Open Standards Charter`](./docs/open-standards/charter.md)
>
> These documents define the canonical philosophy, documentation hierarchy, implementation boundaries, and governance model of the SensOS Open Standards ecosystem.

---

# Official Open Standards Repository

SensOS is an **Enterprise AI Runtime Safety Platform** built on **Open Standards**.

This repository publishes the canonical interoperability specifications, governance documents, conformance requirements, and certification policies required to build **SensOS-compatible AI runtime systems**.

It is the **Single Source of Truth (SSOT)** for the SensOS Open Standards.

Unlike implementation repositories, this repository defines **WHAT** SensOS-compatible software must do—not **HOW** proprietary implementations achieve it.

---

| | |
|---|---|
| **Website** | https://sensos.org |
| **Repository** | https://github.com/GemminAI/sensos-docs |
| **Version** | 0.1.0 Developer Preview |
| **License** | See [LICENSE](./LICENSE) |

---

# Mission

SensOS enables safe, observable, interoperable AI runtime systems.

We believe that:

- Open interoperability accelerates innovation.
- Stable interfaces create healthy ecosystems.
- Implementations should compete on quality—not lock-in.
- Runtime intelligence should remain model independent.

---

# What This Repository Contains

This repository contains the normative specifications for the SensOS ecosystem, including:

- RFCs
- Open Standards
- Product identities
- Governance
- Conformance specifications
- Certification policies
- Architecture contracts
- Graph navigation metadata
- Compliance indexes

This repository **does not** contain production runtime implementations.

Product information is available at:

> **https://sensos.org**

---

# Documentation Philosophy

SensOS documentation follows a layered architecture.

| Documentation | Purpose |
|--------------|---------|
| Public RFC | WHAT the standard defines |
| Partner Specification | HOW to integrate |
| Enterprise Specification | Enterprise deployment guidance |
| Internal Engineering | HOW the platform works |
| Trade Secret | WHY SensOS wins |

AI agents and contributors **must never move information between these layers**.

---

# Project Overview

Built with **Astro** as a static documentation platform.

Features include:

- Markdown RFC collections
- Open Standards documentation
- Responsive documentation portal
- GraphProvider semantic explorer
- Machine-readable JSON APIs
- Compliance indexes
- GitHub Pages deployment

---

# Audience

This repository is intended for:

- Runtime developers
- SDK developers
- AI platform vendors
- Enterprise architects
- Standards contributors
- System integrators
- Researchers
- AI coding agents
- Reviewers
- Community contributors

---

# Canonical Reading Order

When contributing to the project, always read documents in the following order:

1. `README_FIRST.md`
2. Open Standards Charter
3. Documentation Philosophy
4. RFC Classification Policy
5. RFC-NVS-0000 (System Charter)
6. RFC Master Index
7. Relevant Public RFCs

Historical documents are preserved for research purposes but are **not automatically canonical**.

---

# Local Development

```bash
npm ci
npm run dev
```

Open:

```
http://localhost:4321
```

Build:

```bash
npm run build
npm run preview
npm run check
```

Requires:

- Node.js 20+

---

# GitHub Pages

Deployment:

- GitHub Actions
- Output directory: `dist/`
- Custom domain:

```
sensos.org
```

GitHub Pages should use:

- GitHub Actions
- Custom CNAME

---

# Directory Structure

```text
docs/
├── index.md
├── rfc/
├── open-standards/
├── architecture/
├── governance/
├── products/
├── developer/
├── graph/
└── compliance/

public/
├── CNAME
├── favicon.svg
├── robots.txt
├── og.svg
├── compliance/
└── graph/

src/
├── components/
├── layouts/
├── lib/
├── pages/
└── styles/
```

---

# RFC Workflow

To propose a new RFC:

1. Create

```
docs/rfc/RFC-XXXX.md
```

2. Include required frontmatter.

```yaml
---
title: Example RFC
status: Proposed
category: Runtime Protocol
version: "1.0.0"
updated: 2026-07-26
classification: Public Standard
audience: Public
repository: GemminAI/nvs-runtime
supersedes: []
superseded_by: []
related: []
---
```

3. Submit a Pull Request.

4. Follow the governance process defined by:

- RFC-NVS-GOV-0001
- RFC Classification Policy
- Open Standards Governance

---

# RFC Classification

Every RFC shall declare:

- Classification
- Audience
- Status
- Normative Level

Supported classifications:

| Classification | Audience |
|----------------|----------|
| Public Standard | Everyone |
| Partner Specification | Approved Partners |
| Enterprise Specification | Enterprise Customers |
| Internal Engineering | GemminAI Engineering |
| Trade Secret | Restricted |

---

# Open Standards

SensOS follows an **Open Standards** model.

Public specifications define:

- Interfaces
- Observable behavior
- Guarantees
- Compatibility
- Conformance
- Versioning
- Lifecycle

Public specifications **do not** define:

- Internal algorithms
- Runtime optimizations
- Execution Algebra
- Proprietary implementations
- Kernel internals
- Calibration methods
- Internal APIs
- Commercial know-how

This separation enables:

- Open interoperability
- Vendor neutrality
- Healthy competition
- Long-term innovation

---

# Graph Integration

Optional GraphProvider visualization.

```bash
pip install graphifyy

graphify .

mkdir -p public/graph

cp graphify-out/graph.html \
   graphify-out/graph.json \
   graphify-out/GRAPH_REPORT.md \
   public/graph/
```

The documentation site builds successfully even when `public/graph` is empty.

---

# Compliance API

| Endpoint | Description |
|-----------|-------------|
| `/api/v1/rfc.json` | RFC Index |
| `/api/v1/rfc/{id}.json` | RFC Metadata |
| `/api/v1/products.json` | Product Registry |
| `/api/v1/graph/metadata.json` | Graph Metadata |
| `/api/v1/graph/nodes.json` | Graph Nodes |
| `/api/v1/graph/edges.json` | Graph Edges |
| `/api/v1/graph/node/{id}.json` | Node Details |
| `/compliance/index.json` | Compliance Matrix |

---

# Conformance Program

SensOS encourages interoperable implementations.

Certification levels include:

### SensOS Compatible

Passes the public Conformance Test Suite.

### SensOS Certified

Validated by GemminAI.

### SensOS Enterprise Certified

Validated for enterprise production deployment,
security,
and operational compliance.

---

# Related Repositories

| Repository | Purpose |
|------------|----------|
| sensos-docs | Open Standards |
| nvs-runtime | Runtime implementation |
| hext | Semantic Object Standard |
| hekb | Knowledge Base |
| sensos-sdk *(future)* | SDK |
| sensos-cts *(future)* | Conformance Test Suite |
| sensos-examples *(future)* | Reference Examples |

---

# Release Documents

- CHANGELOG.md
- RELEASE_NOTES_v0.1.md
- LAUNCH_READINESS.md

---

# Open Standards Commitment

SensOS publishes standards—not implementations.

Our objective is to enable an open ecosystem where anyone can build compatible software while preserving implementation freedom and encouraging innovation.

Interoperability is open.

Implementation is proprietary.

Innovation remains competitive.

---

# License

Copyright © GemminAI.

See:

- LICENSE

---

# Build Compatible Software.

## Innovate Independently.

## Stay Interoperable.
