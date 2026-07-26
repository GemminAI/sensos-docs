# SensOS Developer Portal — Release Notes v0.1.0

**Channel:** Developer Preview  
**Date:** 2026-07-26  
**Site:** https://sensos.org  
**Repository:** https://github.com/GemminAI/sensos-docs

## Summary

Version 0.1 establishes the official SensOS documentation portal as the ecosystem Single Source of Truth (SSOT). The site is engineered for implementers and reviewers — not marketing.

## Major Features

1. **RFC Series** — Normative documents (GOV-0001, 0199–0203) with consistent metadata, related links, Prev/Next navigation, GitHub edit links, and Graph deep-links.
2. **Architecture** — Stack overview, SVG diagram, and interactive L0–L7 layer cards tied to RFCs and components.
3. **Graph Explorer** — Semantic navigation (sidebar, inspector, search, breadcrumbs) over a GraphProvider API. Works with a seed catalog when Graphify artifacts are absent.
4. **Products & Repositories** — Canonical identities for SensOS, HEKB, NVS Kernel, NVS Runtime and linked GitHub repositories.
5. **Governance & Compliance** — Constitutional principles and a public compliance dashboard backed by `/compliance/index.json`.
6. **Machine-readable APIs** — Static JSON for RFCs, products, graph metadata/nodes/edges, and compliance.

## Known Limitations

- Graphify HTML/JSON artifacts are optional; without them the explorer uses the seed catalog and placeholders for `graph.html`.
- Compliance metrics in v0.1 are **Preview** placeholders until `rfc-auditor` CI publishes authoritative values.
- PDF download on RFC pages remains a disabled placeholder.
- Search is client-side over a build-time index (not full-text across every markdown body).
- MCP servers are not shipped; GraphProvider is structured so agents can call the same methods later.
- Some RFCs remain **Proposed**; governance text is normative for process, not a claim of production certification.

## Future Roadmap

- Automated Graphify publish into `public/graph/`
- CI-generated compliance indexes with real pass rates
- PDF export for RFCs
- Full-text search (e.g. Pagefind)
- Optional HEKB / Neo4j GraphProvider backends
- Expanded RFC corpus (ABI, INFO, ARCH prefixes)

## Upgrade / Deploy Notes

```bash
npm ci
npm run build
# deploy dist/ via GitHub Pages (workflow on main)
```

Custom domain expects `public/CNAME` → `sensos.org`.
