# Batch 2 Review Brief

**Prepared:** 2026-07-29  
**Status:** Ready for source review; canonical drafting has not begun.

## Objective

Close the two mathematical gaps surfaced by Batch 1 while preserving the public/private policy in `PUBLIC_PRIVATE_BOUNDARY_REPORT.md`.

| Priority | Proposed deliverable | Candidate sources | Review focus |
| --- | --- | --- | --- |
| 0 — gate | HEXT namespace and RFC-NVS-0208 split decision | RFC-NVS20; RFC-HEXT000, 001, 005 | Confirm that HEXT-E and HEXT-O (or approved alternatives) are distinct lineages; separate public object ABI from private execution algebra before new cross-references are introduced. |
| 1 | NVS-MATH-0006 — Basin and Attractor Mathematics | RFC-NVS13, RFC-NVS33, RFCv3/RFC0030, DAK01 interface-level material | Define public terms, state/basin/attractor invariants, and boundary-service interfaces. Exclude F17 taxonomy, thresholds, calibration, and controller logic. |
| 1 | NVS-MATH-0007 — Stability and Constraint Pipeline | RFC-STS04, RFC-NVS31, RFC-NVP31, supported standard control theory | Define public stability and constraint interfaces, including qualitative Lyapunov/CBF obligations where sourced. Exclude optimized solvers, tuned barriers, gains, and safety thresholds. |
| 2 | Calibration infrastructure review | RFC-NVS-CAL v2.1 | Determine the public registry/metrology contract and the private calibration implementation boundary; do not publish tuned datasets or constants. |
| 2 | DAK extension-family review | RFC-NVS-DAK02 through RFC-NVS-DAK06 | Classify distributed runtime, security, replay, policy DSL, and Adapter ABI v2.0 material into public contracts versus private mechanisms. |
| 3 — only after diff | Runtime governance/service-layer review | RFC-NVS42; RFC-NVS46 through RFC-NVS51; live RFC-NVS-0200 and RFC-NVS-0202 | Diff each archived source against the immutable live RFCs before reuse. Classify it as complementary, superseded, or conflicting; do not draft from it until that result is recorded. |

## Non-goals

- Do not reconstruct the lost mathematical bodies of RFC-NVP02 through RFC-NVP23.
- Do not turn historical AIIE/NOMOS material into normative NVS content without an explicit source-to-contract rationale.
- Do not publish formulas, tuned parameters, optimized solvers, classifier taxonomies, or calibration data merely because a source archive contains them.

## Completion Criteria

Batch 2 review is complete when each candidate source has: (1) an authority/status assessment, (2) a public/private content classification, (3) a dependency and terminology check against Batch 1, (4) an explicit list of redactions or private companions, and (5) a decision whether canonical drafting is authorized.
