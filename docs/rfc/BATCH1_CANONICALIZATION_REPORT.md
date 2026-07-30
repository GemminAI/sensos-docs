# Batch 1 Canonicalization Report

**Prepared:** 2026-07-29
**Status:** Batch 1 complete, committed locally (5 commits, not pushed to `origin`). Awaiting review before Batch 2.
**Scope:** 11 documents across the 11 target areas specified — Runtime Constitution, Kernel Architecture, Observation Geometry, Curvature Mathematics, Geodesic Mathematics, Semantic Metric, Runtime State Space, Runtime Safety, Observation ABI, HEXT Object ABI, HEKB Memory Model.

---

## 1. Canonicalization Report

### 1.1 What was produced

| # | Document | Path | Sources consolidated |
|---|---|---|---|
| 1 | RFC-NVS-0204 — SensOS Runtime Constitution | `docs/rfc/RFC-NVS-0204.md` | RFC-SensOS01, RFC-NVS01 v2.4 (+ RFC-STS00 vocabulary only) |
| 2 | RFC-NVS-0205 — NVS-Kernel Architecture | `docs/rfc/RFC-NVS-0205.md` | RFC-SensOS12, RFC-SensOS16, RFC-SensOS13 |
| 3 | RFC-NVS-0206 — Runtime Safety Module (DAK), public interface | `docs/rfc/RFC-NVS-0206.md` | RFC-NVS-DAK00 v1.1, RFC-NVS-DAK01 v2.1 (+ RFC-STS04 vocabulary only) |
| 4 | RFC-NVS-0207 — Observation ABI | `docs/rfc/RFC-NVS-0207.md` | RFC-NVS74 v1.0.0, RFC-NVS70 v1.1.0 |
| 5 | RFC-NVS-0208 — HEXT Object ABI | `docs/rfc/RFC-NVS-0208.md` | RFC-HEXT000, RFC-HEXT001, RFC-HEXT005 |
| 6 | RFC-NVS-0209 — HEKB Memory Model | `docs/rfc/RFC-NVS-0209.md` | RFC-HEKB00 v1.1, RFC-HEKB01 v1.0, RFC-HEKB10 v1.1 |
| 7 | NVS-MATH-0001 — Curvature Mathematics | `docs/mathematics/NVS-MATH-0001.md` | RFC-STS05 v1.4, RFC-0036, RFC-0039 (+ RFC-NVS-DAK01 context) |
| 8 | NVS-MATH-0002 — Geodesic Mathematics | `docs/mathematics/NVS-MATH-0002.md` | RFC-STS05 v1.4, RFC-0037, RFC-0038 |
| 9 | NVS-MATH-0003 — Semantic Metric | `docs/mathematics/NVS-MATH-0003.md` | RFC-STS05 v1.4, RFCv3/RFC0031 |
| 10 | NVS-MATH-0004 — Observation Geometry | `docs/mathematics/NVS-MATH-0004.md` | RFC-STS09 v1.4, RFC-NVP34 v0.1 |
| 11 | NVS-MATH-0005 — Runtime State Space | `docs/mathematics/NVS-MATH-0005.md` | RFC-STS08 v1.4, RFC-0040, RFC-NVP32 v0.1, RFC-SensOS13 |

**19 distinct archive source documents** were read in full and consolidated into these 11 canonical documents. All source files remain untouched in the archive.

### 1.2 Numbering

New canonical identifiers assigned in the live `RFC-NVS-02xx` band, immediately following the already-published `RFC-NVS-0199`–`0203`/`RFC-NVS-GOV-0001`:

- `RFC-NVS-0204` through `RFC-NVS-0209` (six new RFCs).
- `NVS-MATH-0001` through `NVS-MATH-0005` (five new math specifications, a new identifier series under `docs/mathematics/`, not part of the Astro `RFC-*.md` content collection).

No existing published identifier was renamed, renumbered, or edited. `RFC-NVS-0199` through `0203` and `RFC-NVS-GOV-0001` were not modified.

### 1.3 Document quality

Every document includes all twelve required fields: Title, Status, Version, Purpose, Scope, Dependencies, Definitions, Mathematical assumptions, Normative requirements, References, Implementation implications, Related RFCs — plus an "Open Issues / Contradictions" section used consistently to surface unresolved tensions rather than silently resolve them, per your instruction.

### 1.4 Mathematical policy compliance

- No mathematics was invented. Every formula published is either (a) a standard, textbook construct (Riemannian geometry, Amari information geometry, category theory, Lie-group control theory, Shannon entropy, standard statistics) explicitly cited as such, or (b) a structural/type-level interface (name, domain, invariants) for a GemminAI-tuned quantity whose exact form is redacted.
- Where source RFCs overlapped on the same concept from different formalisms (e.g., two different mathematical treatments of "curvature," two different treatments of "observation"), they were consolidated side by side rather than artificially merged, and the lack of a unifying bridge was recorded as an open issue with a `TODO`, never fabricated.
- Where a required topic had genuinely no surviving source material (e.g., a full Meaning-Field-Thermodynamics-style formula, an exact 𝒢 curvature-observation function), no formula was invented; the gap is recorded explicitly.

### 1.5 Proprietary-boundary compliance

Every document that touched GemminAI-tuned mathematics carries one or more `> **Private implementation note:**` callouts, each naming exactly what was redacted and why. Across the batch, the following categories of content were consistently redacted:
- Exact closed-form formulas that operationalize standard math for NVS-Kernel specifically (DAK's gain/risk functions, RFC-STS05's composition formulas, RFC-0040's curvature normalization).
- Calibration constants, thresholds, window sizes, and other tuned parameters (DAK's frozen constants table, RFC-STS05's decay rates, retention TTLs in the HEKB memory model).
- Closed, proprietary classification taxonomies (DAK's F17 attractor categories).
- Proprietary construction/derivation procedures where only the existence of a mechanism, not its method, is in the archive (the user-specific connection tensor, the STLE projection matrices).

Two documents (RFC-NVS-0207 Observation ABI, RFC-NVS-0208 HEXT Object ABI) required **no redactions** — both are pure interoperability contracts whose entire content is meant for external consumption.

---

## 2. Cross-reference Matrix

Legend: ● = direct `related:` reference in frontmatter or body; (a) = archive-source dependency (not a sensos-docs cross-reference); (i) = informative/contextual only.

| | 0204 | 0205 | 0206 | 0207 | 0208 | 0209 | M-0001 | M-0002 | M-0003 | M-0004 | M-0005 | Live 0199-0203/GOV-0001 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **RFC-NVS-0204** (Constitution) | — | ● | | | | | | | | | | ● GOV-0001 |
| **RFC-NVS-0205** (Kernel Arch.) | ● | — | ● | ● | | | ●(driver) | ●(driver) | ●(driver) | | ●(driver) | |
| **RFC-NVS-0206** (Runtime Safety) | | ● | — | ● | | | ●(i, consumer) | | | | | ● GOV-0001 |
| **RFC-NVS-0207** (Observation ABI) | | ● | | — | ● | | | | | | | ● 0200 (i) |
| **RFC-NVS-0208** (HEXT Object ABI) | | | | ● | — | ● | | | | | | |
| **RFC-NVS-0209** (HEKB Memory) | | ● | | | ● | — | | | | | | |
| **NVS-MATH-0001** (Curvature) | | ● | ●(i) | | | | — | ● | | | | |
| **NVS-MATH-0002** (Geodesic) | | ● | | | | | ● | — | ● | | | |
| **NVS-MATH-0003** (Semantic Metric) | | ● | | | | | ● | ● | — | ● | | |
| **NVS-MATH-0004** (Observation Geom.) | | ● | | ● | | | | | ● | — | ● | |
| **NVS-MATH-0005** (Runtime State Space) | | ● | | | | | ● | | | ● | — | |

**Reading this matrix:**
- `RFC-NVS-0205` (Kernel Architecture) is the hub — every math spec and every other Batch-1 RFC ultimately connects back to it, consistent with its role as the architectural root that names the four Observation Drivers (`curvature.py`, `entropy.py`, `topology.py`, `memory.py`) and points each to its owning math spec.
- The math series (`NVS-MATH-0001`–`0005`) forms its own tightly cross-linked sub-graph, reflecting genuine mathematical dependency (e.g., Semantic Metric underlies Observation Geometry, since every Observation Object carries a Metric Bundle).
- Only `RFC-NVS-0207` and `RFC-NVS-0206` reference a **live, immutable** document (`RFC-NVS-0200`, `RFC-NVS-GOV-0001` respectively) — both as read-only informative citations. No Batch-1 document redefines or restates live content.
- `RFC-NVS-0208` (HEXT Object ABI) and `RFC-NVS-0209` (HEKB Memory Model) are comparatively peripheral — each has real archive-source depth but only shallow cross-reference into the rest of Batch 1, reflecting that HEXT and HEKB are each their own archive series with their own internal dependency graphs largely out of this batch's scope.

---

## 3. Remaining Open Issues

Consolidated from every document's "Open Issues / Contradictions" section. Grouped by severity/actionability.

### 3.1 Requires a governance/naming decision

1. **"HEXT" names two unrelated systems.** `RFC-NVS-0207`'s source (RFC-NVS74) uses "HEXT" for RFC-NVS20's Crystallized Knowledge Object / Evidence Container (ledger, provenance, final seal). `RFC-NVS-0208`'s source (RFC-HEXT000/001/005) uses "HEXT" for a completely different Observation-Space/Execution-Algebra architecture. Neither family references the other anywhere in the archive. **This needs a decision**: rename one, or establish and document an explicit bridge, before either `RFC-NVS-0207` or `RFC-NVS-0208` leaves Proposed status.
2. **SensOS↔NVS layering disagreement.** `RFC-SensOS01` states the canonical stack is `NVP → SensOS → NVS`. `RFC-NVS01` v2.4's own seven-layer architecture never names SensOS as a dependency — its own "Depends On" lists only NVP documents. `RFC-NVS-0204` records both positions without resolving them; resolution would need an amendment to one charter under `RFC-NVS-GOV-0001`'s process.
3. **DAK maturity mislabel.** `RFC-NVS-DAK`'s own `RFC_SERIES_INDEX.md` labels the entire Reference Standard (including the gain formula and F17 taxonomy) "Reference Implementation" maturity and lists them as "Frozen," while the Reference Standard's own body marks those same items `[Experimental]`. `RFC-NVS-0206` surfaces this but doesn't resolve it — worth fixing at the source (DAK series index) so future public claims about DAK don't over-state confidence.

### 3.2 Genuine mathematical gaps (nothing to fabricate; needs new research or a private-repo answer)

4. **No unifying "runtime state" object.** Physical state ($SE(3)$, RFC-STS08), abstract semantic-manifold state ($\mathcal{M}$, RFC-NVP32), Kernel-resident state (`NIR_SemanticState`, RFC-SensOS13), and empirically-observed LLM hidden state ($h_t$, RFC-0040) are four independently defined notions of "state" with no archived bridge between them. `NVS-MATH-0005` flags this as its central TODO.
5. **No bridge between RFC-STS05's algebraic Metric Bundle and RFC0031's Riemannian information geometry.** Both claim to define "semantic distance/curvature" but nothing in the archive states whether they're the same object. `NVS-MATH-0003` flags this.
6. **No bridge between RFC-STS09's categorical Observation Functor and RFC-NVP34's set-theoretic Observer tuple.** Both formalize "what is an observation" from different mathematical traditions with no stated correspondence. `NVS-MATH-0004` flags this.
7. **"Meaning Field Thermodynamics" has no surviving formal source at all.** The closest historical treatment (RFC-NVP18's `F(s,u,t)` free-energy functional) is one of the RFC-NVP02–23 files whose body was lost in a prior migration (documented in the Master Classification Report §4). This topic could not be included in Batch 1 for that reason — see Batch 2 recommendation below.

### 3.3 Lower-severity, informational

8. Several forward-referenced identifiers (`RFC-STS10`, `RFC-HEKB06`, `RFC-HEKB09`, `RFC-STS00_v1.2`) are cited throughout the archive but do not exist anywhere in the vault. Every Batch-1 document that inherits one of these citations notes it rather than treating it as resolved.
9. `RFC-NVS74`'s own unresolved items (Layer 6/7 table-naming collision, undetermined Protocol Buffers field-number registry location, four forward-referenced consumer RFCs that don't yet exist) are inherited into `RFC-NVS-0207` unresolved, exactly as they exist in the source.
10. `RFC-HEXT001`/`RFC-HEXT005`'s ambiguous forward reference to "RFC-HEXT006+" (which RFC-HEXT000 itself charters as an unrelated Signature Registry document) is inherited into `RFC-NVS-0208` unresolved.

---

## 4. Recommended Batch 2 Scope

Based on the Master Classification Report's minimal-set analysis and what Batch 1 actually surfaced while drafting, in priority order:

### 4.1 High priority — closes gaps Batch 1 exposed
- **Basin & Attractor Mathematics** (a `NVS-MATH-0006`) — named as a Batch-1 target-adjacent topic but not separately scoped this round; strong sources exist (`RFC-NVS33` Boundary Services, `RFC-NVS13` Collective Attractor Management, `RFC-NVS-DAK01`'s F17 taxonomy at interface level, `RFCv3/RFC0030`'s "Meaning Attractor"). Needed because `RFC-NVS-0205`'s Reference Observation Drivers table and `NVS-MATH-0001`'s curvature-risk signal both presuppose basin/attractor structure without defining it.
- **Stability & Constraint Pipeline** (a `NVS-MATH-0007`) — `RFC-STS04`'s Lyapunov/CBF material was cited informatively in `RFC-NVS-0206` but never formally canonicalized on its own; `RFC-NVS31` (Integrity Services) and `RFC-NVP31` (Semantic Temporal Logic) are additional strong sources.
- **Resolve or formally flag the "HEXT" naming collision** (§3.1 item 1) before continuing — this affects how any Batch 2 document referencing either "HEXT" concept should cite it.

### 4.2 Medium priority — completes the runtime picture
- **NVS Runtime Governance & Service Layer** — `RFC-NVS42` (MCP Bus), `RFC-NVS46`–`51` (Observation/Memory/Prediction/Planning services, Event Schema, Observability Gateway) were deliberately excluded from Batch 1 pending an explicit diff against the live `RFC-NVS-0200`/`0202` text (per the Master Classification Report §6.3). That diff should happen before this material is touched.
- **Calibration** — `RFC-NVS-CAL v2.1` (Metrology, Calibration and Registry Infrastructure) is a mature Canonical Candidate not covered by any Batch-1 document; the Constraint pipeline and the DAK Reference Standard both implicitly depend on calibration infrastructure that has no public specification yet.
- **DAK extension family** — `RFC-NVS-DAK02`–`06` (distributed runtime, security, replay, policy DSL, adapter ABI v2.0) are all current-release Canonical Candidates not yet given public specifications; `RFC-NVS-0206` only covers DAK00/01.

### 4.3 Lower priority / explicitly deferred (per Master Classification Report §7.7, unchanged)
- `RFC-NVS80`–`89` (Semantic Build System / Compiler toolchain) — a separate "Compiler" product concern from NVS-Kernel proper.
- The RFC0047–53 AIIE Governance Kernel and RFC0059–86 EpisOS/Semantic-Internet tracks — different product domains, several components self-graded as blocked on undefined variables.
- RFC-NVP02–23's lost-body topics — cannot be canonicalized without either recovering the lost source or commissioning new research; not a documentation-engineering task.

**Recommendation:** start Batch 2 with Basin/Attractor and Stability/Constraint math (§4.1), since both are direct, load-bearing gaps that Batch 1's own documents (`RFC-NVS-0205`, `RFC-NVS-0206`, `NVS-MATH-0001`) already reference but don't define — and resolve the HEXT naming collision as a prerequisite, since it affects citation hygiene going forward.

---

*End of Batch 1 Canonicalization Report. No further canonicalization work has begun. Awaiting review.*
