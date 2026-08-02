# Documentation Migration Plan

**Adopted:** 2026-08-02  
**Objective:** Move from open engineering wiki → enterprise product site with open standards.

## Phase 0 — Immediate redaction (done in this change set)

| Document | Action | Destination of full text |
| --- | --- | --- |
| RFC-NVS-0208 | Public ABI-only rewrite | `docs/trade-secret/ENG-SPEC-HEXT-Execution-Algebra.md` |
| RFC-NVS-0203 | Public goals/guarantees rewrite | `docs/partner/PARTNER-SPEC-SDRP-Wire-Protocol.md` |
| RFC-NVS-0199 | Public CBAC concept rewrite | `docs/partner/PARTNER-SPEC-CBAC-Token-Grammar.md` |
| RFC-SensOS22 | Public boundary summary | `docs/internal/RFC-SensOS22-Domain-Boundary.md` |
| RFC-SensOS23 | Public goal principles | `docs/internal/RFC-SensOS23-Goal-Manager.md` |
| ADR-0001 | Remove from public emphasis | `docs/internal/ADR-0001-...` |
| Boundary / Batch reports | Internal only | `docs/internal/` |

## Phase 1 — Site IA (this change set)

1. Homepage becomes product narrative (CIO/CISO/investor).
2. Primary nav: Product, Standards, Developers, Resources, Enterprise, GitHub.
3. Architecture / Graph / Compliance demoted from primary nav.
4. Publish RFC philosophy (WHAT not HOW).

## Phase 2 — Remaining public RFC scrub (next sprint)

| Document | Required scrub |
| --- | --- |
| RFC-NVS-0200 | Keep layer contracts; remove any canonicalization micro-rules that are implementation-specific |
| RFC-NVS-0205 | Remove driver filenames; keep subsystem responsibilities |
| RFC-NVS-0206 | Keep public adapter guarantees; remove F17/defense-domain detail |
| RFC-NVS-0207 | Apply HEXT-E naming; keep Observation ABI |
| RFC-NVS-0209 | Keep qualitative model; ensure no TTL/ratios |
| NVS-MATH-0001–0005 | Keep typed interfaces; strip named private constants |
| RFC-SensOS21 | Remove module paths / EXP IDs; keep Law>Policy>Goal principles |
| RFC-NVS-GOV-0001 | Fix status inconsistencies; keep process transparency |

## Phase 3 — Repository split

1. Public GitHub hosts only Public tier + README stubs for other tiers.
2. Partner/Enterprise/Internal/Trade-secret move to private repositories.
3. LICENSE split: public standards terms vs partner evaluation license + patent policy.
4. `/api/v1/rfc/{id}` full-text export remains public-only contracts.

## Phase 4 — Enterprise fundraising readiness

1. Whitepaper + security overview pages live.
2. Case study placeholders replaced with approved customer stories.
3. Diligence pack generated from Enterprise tier (not Internal/Trade Secret).
4. Patent counsel confirms provisional filings covering still-private mechanisms.
