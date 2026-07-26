# Graphify integration

Graphify is an **optional visualization layer** for the SensOS Developer Portal.
It does not replace RFC text. Canonical documentation remains under `docs/` and
the rendered portal pages.

The Graph UI talks only to the **`GraphProvider`** abstraction:

- Current: `GraphifyProvider` (seed catalog + optional `public/graph/*` artifacts)
- Reserved: `HEKBGraphProvider`, `Neo4jProvider`, `CustomAPIProvider`

Methods intended for future MCP / agent use (not an MCP server itself):

```ts
GraphProvider.getNode(id)
GraphProvider.getNeighbors(id)
GraphProvider.search(query)
GraphProvider.getPath(from, to)
GraphProvider.getMetadata()
```

## Purpose

Help developers explore:

- RFC relationships
- Repository relationships
- Architecture dependencies
- Runtime layers
- HEXT object flow
- Kernel interactions

## Generate Graphify output

Install the CLI (package name on PyPI is `graphifyy`):

```bash
pip install graphifyy
graphify install   # optional: wire into your AI coding assistant
```

From the repository root (or an AI assistant `/graphify` skill):

```bash
# Typical local generation — outputs default to graphify-out/
graphify .
# or, from an assistant:
# /graphify .
```

Useful variants:

```bash
graphify . --code-only          # AST-only, no LLM
graphify update .               # incremental refresh
graphify query "RFC-NVS-0201"   # query existing graph.json
```

Expected raw output directory (Graphify default):

```text
graphify-out/
├── graph.html
├── graph.json
└── GRAPH_REPORT.md
```

## Where to place generated files

Copy (or CI-publish) artifacts into the portal static directory:

```text
public/graph/
├── graph.html        # optional interactive iframe
├── graph.json        # optional primary graph document
├── nodes.json        # optional split node list
├── edges.json        # optional split edge list
├── metadata.json     # optional generation metadata
└── GRAPH_REPORT.md   # optional human report
```

Example:

```bash
mkdir -p public/graph
cp graphify-out/graph.html graphify-out/graph.json graphify-out/GRAPH_REPORT.md public/graph/
# optionally also publish nodes.json / edges.json / metadata.json
```

The Astro build copies `public/` into `dist/` unchanged.

## How GitHub Pages serves them

| Local path | Public URL |
|---|---|
| `public/graph/graph.html` | https://sensos.org/graph/graph.html |
| `public/graph/graph.json` | https://sensos.org/graph/graph.json |
| `public/graph/GRAPH_REPORT.md` | https://sensos.org/graph/GRAPH_REPORT.md |

The portal page **https://sensos.org/graph** embeds `graph.html` when present and
links the other artifacts. Deep links use query parameters:

```text
/graph?rfc=RFC-NVS-0199
/graph?view=architecture
/graph?repo=GemminAI/nvs-runtime
```

## How to update the graph

1. Re-run Graphify against the docs (and optionally linked repositories).
2. Replace files under `public/graph/`.
3. Commit and push (or let CI publish the artifacts).
4. Confirm https://sensos.org/graph shows the embedded visualization.

## Graceful fallback

If `public/graph/` is empty or incomplete:

- `npm run build` still succeeds
- `/graph` shows a placeholder instead of an iframe
- RFC “Open in Graph →” still navigates to `/graph?rfc=…`
- Download buttons appear only for files that exist

Never commit secrets into Graphify caches. Prefer regenerating artifacts in CI
when graphs include multi-repo sources.
