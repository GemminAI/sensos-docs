# Post-Release Report — SensOS Developer Portal v0.1.0

## Release Version

`v0.1.0` (Developer Preview)

## Release Date

2026-07-26 (UTC publish time: 2026-07-26T14:44:47Z)

## Commit SHA

`99eb37ce1150fb0112636274f65986d5c3d15116`

## Git Tag

`v0.1.0` → `99eb37ce1150fb0112636274f65986d5c3d15116`

Annotated message: `SensOS Developer Portal v0.1.0 Developer Preview`

## Pages URL

https://sensos.org

## GitHub Release URL

https://github.com/GemminAI/sensos-docs/releases/tag/v0.1.0

- Marked as **Latest** release
- **Not** marked as Pre-release

## Deployment Status

| Check | Result |
|---|---|
| GitHub Actions `Build Docs` | success ([run 30206716603](https://github.com/GemminAI/sensos-docs/actions/runs/30206716603)) |
| Astro build job | success |
| GitHub Pages deploy job | success |
| https://sensos.org | HTTP 200 |
| HTTPS certificate | Valid (Let's Encrypt, CN=sensos.org) |
| /robots.txt | HTTP 200 |
| /sitemap-index.xml | HTTP 200 |
| /404 | HTTP 200 |
| /graph | HTTP 200 (Graphify fallback placeholder present) |
| /compliance | HTTP 200 |
| /rfc | HTTP 200 |

## Verification Results (pre-publish)

- `npm run release:check` passed (build + 809 internal links, 0 broken)
- sitemap generated at build time
- `robots.txt` and `CNAME` present in `dist/`
- Graph fallback confirmed without `public/graph/graph.html`
- Navigation routes present for Home, RFC, Architecture, Products, Developer, Governance, Graph, Compliance
- README renders expected project overview / version metadata

## Known Issues

1. Compliance metrics remain **Preview** placeholders until rfc-auditor CI lands.
2. PDF download on RFC pages is still a disabled placeholder.
3. Graphify HTML artifacts are optional; explorer uses seed catalog until published.
4. GitHub Actions annotation: Node.js 20 actions are deprecated on runners (non-blocking; Node 24 forced).
5. Full-text search and MCP integration remain roadmap items.

## Conclusion

Public release of SensOS Developer Portal **v0.1.0 Developer Preview** completed successfully.
