# Launch Readiness Report — SensOS Developer Portal v0.1.0

**Date:** 2026-07-26  
**Target:** https://sensos.org  
**Channel:** Developer Preview  
**Verdict:** **READY FOR PUBLIC DEVELOPER PREVIEW**

## Executive summary

The portal presents as an official standards documentation site: consistent navigation, RFC SSOT pages, architecture/graph/compliance surfaces, SEO basics, GitHub Pages packaging, and graceful Graphify fallbacks. Automated link audit of the production build reported **0 broken internal links** across **25 HTML pages** and **809 hrefs**.

## Quality checklist

| Check | Status | Notes |
|---|---|---|
| No broken internal links | ✓ | `npm run audit:links` clean |
| No empty pages | ✓ | All nav destinations render content |
| Navigation complete | ✓ | Home, RFC, Architecture, Products, Developer, Governance, Graph, Compliance, GitHub |
| Metadata present | ✓ | title, description, canonical, OG, Twitter, docs-version, build-time |
| Mobile friendly | ✓ | Responsive grids, architecture table scroll, Graph workspace stacks |
| Dark mode | ✓ | Theme toggle + system preference + FOUC-prevention script |
| GitHub Pages compatible | ✓ | Static `dist/`, `CNAME`, Actions workflow, sitemap/robots |
| Graph optional | ✓ | Seed catalog + placeholders without `public/graph/*` |
| Markdown rendering | ✓ | Astro content collections + Shiki dual theme |
| Custom 404 | ✓ | `/404.html` with Home / RFC / Search links |
| Compliance dashboard | ✓ | Complete preview UI + specification matrix |
| Release docs | ✓ | CHANGELOG, RELEASE_NOTES_v0.1, README, LICENSE |

## Navigation verification

| Item | Route | Build output |
|---|---|---|
| Home | `/` | `dist/index.html` |
| RFC | `/rfc` | `dist/rfc/index.html` |
| Architecture | `/architecture` | `dist/architecture/index.html` |
| Products | `/products` | `dist/products/index.html` |
| Developer | `/developer` | `dist/developer/index.html` |
| Governance | `/governance` | `dist/governance/index.html` |
| Graph | `/graph` | `dist/graph/index.html` |
| Compliance | `/compliance` | `dist/compliance/index.html` |
| GitHub | external | `https://github.com/GemminAI/sensos-docs` |

## RFC surface

- Consistent frontmatter: title, status, category, version, updated, repository, supersedes, superseded_by, related
- Prev / Next adjacent navigation
- Related RFCs + GraphProvider relations (References / Referenced By / Components / Repositories)
- Open in Graph → `/graph?rfc=…`
- GitHub Edit + Download Markdown; PDF placeholder disabled

## Graph fallback

- Without artifacts: Explorer uses seed catalog; iframe shows informative placeholder; artifact downloads marked Missing
- With artifacts in `public/graph/`: auto-detected at build/runtime and merged by GraphifyProvider

## SEO / discoverability

- Canonical URLs per page
- Open Graph + Twitter card tags
- `favicon.svg`, `og.svg`
- `robots.txt` → sitemap
- `@astrojs/sitemap` → `sitemap-index.xml`
- `public/CNAME` → `sensos.org`

## Performance notes (GitHub Pages)

- Static HTML/CSS/JS only; Graph client bundle ~21 KB gzip ~6.5 KB
- Fonts loaded with `display=swap` and non-blocking stylesheet pattern
- CSS minified via Vite; stylesheets inlined when small (`inlineStylesheets: 'auto'`)
- No large hero images; SVG favicon/OG assets

## Accessibility

- Skip link to `#main-content`
- `:focus-visible` outlines
- ARIA labels on Graph workspace, footer metadata, primary nav
- Status/contrast via CSS variables for light/dark themes
- Keyboard-reachable buttons in Graph Explorer (sidebar/search/inspector)

## Known preview limitations (accepted for v0.1)

1. Compliance numeric rates are Preview placeholders until rfc-auditor CI exists
2. Graphify HTML may be absent at launch (seed catalog remains usable)
3. PDF download not implemented
4. Search is not full-body Pagefind yet
5. MCP server not shipped (GraphProvider API prepared)

## Release command

```bash
npm run release:check
# → build + internal link audit
```

## Go / no-go

**GO** for Developer Preview publication on https://sensos.org after merging to `main` and confirming GitHub Pages + DNS for `sensos.org`.

Post-launch monitoring: Actions deploy success, custom domain HTTPS, `/sitemap-index.xml`, `/compliance/index.json`, `/graph` fallback behavior.
