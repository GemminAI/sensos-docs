---
title: Curvature Mathematics
id: NVS-MATH-0001
status: Proposed
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
related:
  - RFC-NVS-0205
  - RFC-NVS-0206
  - NVS-MATH-0002
---

## Abstract

This specification formalizes the mathematics of curvature used across the NVS-Kernel ecosystem. Curvature appears in the archive in two structurally distinct places: (1) as a static, per-relation scalar attribute of an edge in the Semantic Type System's Enriched Metric Bundle, grounded in standard Riemannian sectional curvature; and (2) as a dynamic, time-varying signal computed over a token-generation trajectory (hidden-state or context-transition sequence) and consumed as an instability/risk indicator. This document states the standard differential-geometric mathematics underlying both uses in full, and defines the public interface — type, role, and invariants only — for the GemminAI-tuned, proprietary quantities built on top of that standard mathematics. It does not disclose any proprietary formula, calibration constant, or derivation.

## Purpose

To give sensos-docs consumers a single, canonical, public reference for what "curvature" means wherever it appears in NVS-Kernel specifications, distinguishing (a) standard, textbook differential geometry that is safe to state precisely, from (b) GemminAI-specific tuned formulas and constants that operationalize that standard geometry and are proprietary. This document enables correct interpretation of curvature-valued fields and curvature-derived signals in dependent specifications without exposing NVS-Kernel's implementation-level intellectual property.

## Scope

**In scope:**
- The standard definition and role of sectional curvature as a component of the Enriched Metric Bundle vector (Archive/RFC-STS/RFC-STS05_v1.4.md).
- The standard tensor-algebra relationship between a local deformation (Jacobian) and a Riemannian metric via the Right Cauchy-Green deformation tensor (Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md).
- The general, standard numerical-differential-geometry *concept* of discrete curvature computed by comparing consecutive direction vectors along a sampled trajectory (Archive/RFC0032_40/RFC-0039-AIIE-Holonomy-Sampling-Loop-CDR.md), stated at the concept level only.
- The public interface (type/role/invariants) of the curvature-derived risk signal that a Runtime Safety Module consumes, as referenced in Archive/RFC-NVS-DAK/RFC-NVS-DAK01_v2.1.md, without its proprietary formula.

**Out of scope:**
- The exact tuned composition formulas, scaling constants, epsilon values, gain formulas, classifier thresholds, or window-size defaults found in any source document. These are proprietary and redacted per policy below.
- Geodesic distance, parallel transport, holonomy, and connection mathematics — see NVS-MATH-0002.
- The full Dynamic Abort Kernel architecture, its F17 attractor taxonomy, and its controller/policy layer — normatively owned by the RFC-NVS-DAK series and its sibling Runtime Safety Module specification (RFC-NVS-0206), not restated here.

## Dependencies

This document assumes familiarity with:
- Standard Riemannian geometry: manifolds, metric tensors, sectional curvature.
- Standard tensor algebra: Jacobian matrices, quadratic forms, matrix norms.
- Standard numerical differential geometry: finite-difference approximation of derivatives along a discretely sampled curve.

It has no normative dependency on unpublished material. It has an informative dependency on RFC-NVS-0206 (Runtime Safety Module), which is the consumer of the curvature-derived risk signal described at interface level in §"Definitions" below.

## Definitions

1. **Sectional curvature (κ_AB ∈ ℝ).** A per-relation scalar component of the Enriched Metric Bundle vector **v**_AB, representing the Riemannian sectional curvature of the local manifold surrounding a relation path between semantic objects A and B. Standard differential-geometric quantity. *Source:* Archive/RFC-STS/RFC-STS05_v1.4.md §2.1.1 (item 3).

2. **Deformation tensor (Jacobian, J).** For a micro-transition from context state x to y = x + dx, J is the standard Jacobian matrix J^i_j = ∂y^i/∂x^j, describing the local linear rate of change of the semantic coordinate system. Standard tensor calculus. *Source:* Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md §2.

3. **Right Cauchy-Green deformation tensor (C).** C = Jᵀ g J, where g is the Riemannian metric on the manifold. Standard continuum-mechanics/differential-geometry construction relating a local deformation to the ambient metric; quantifies which inter-concept distances stretch or compress under a context transition. *Source:* Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md §2.1.

4. **Deformation regime classification (dilation / compression / shear).** Standard continuum-mechanics vocabulary applied to the eigenstructure of C: eigenvalue > 1 indicates dilation (concept generalizes), eigenvalue < 1 indicates compression (concept narrows), growth of off-diagonal terms indicates shear (previously unrelated concepts become coupled). *Source:* Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md §3.

5. **Discrete trajectory curvature (κ_t) — interface only.** A non-negative, real-valued scalar computed at each step of a discretely sampled trajectory by comparing the change in local direction between consecutive segments — the general numerical-differential-geometry concept of approximating curvature via finite differences of a curve's tangent/velocity. *Source (concept only):* Archive/RFC0032_40/RFC-0039-AIIE-Holonomy-Sampling-Loop-CDR.md §2.
   > **Private implementation note:** The exact functional form, normalization, and zero-division guard constant used by NVS-Kernel to compute κ_t are proprietary to NVS-Kernel and are maintained in the private NVS-Kernel documentation. This public specification defines only its interface: κ_t is a non-negative real number produced once per trajectory step from a bounded local window of the trajectory.

6. **NVS-Kernel curvature-based risk signal — interface only.** A scalar, saturating function of κ_t used as part of a runtime instability/intervention decision. *Source (context only, not formalized here):* Archive/RFC-NVS-DAK/RFC-NVS-DAK01_v2.1.md §8.2 (Risk Function), §5.6 (Adaptive Gain Scheduler), §8.6 (Threshold Evaluation).
   > **Private implementation note:** The exact functional form of the risk function, its scaling constant, the gain formula that combines it with classifier confidence and policy weight, and all associated calibration thresholds are proprietary to NVS-Kernel and are maintained in the private NVS-Kernel documentation. This public specification defines only its interface: the risk signal is a bounded scalar in [0, 1) that is monotonically non-decreasing in κ_t, equals its minimum when κ_t = 0, and is consumed by the Runtime Safety Module (see sibling specification RFC-NVS-0206, not itself covered by this document) as one input to an intervention decision.

7. **Curvature singularity.** The exceptional condition in which a computed sectional curvature diverges (κ → ±∞) along a trajectory, indicating structural instability in the underlying manifold or its projection. Standard qualitative concept from differential geometry. *Source:* Archive/RFC-STS/RFC-STS05_v1.4.md §3.4 (item 3, `STS_ERR_CURVATURE_SINGULARITY`).

## Mathematical assumptions

- **A1.** The semantic/statistical manifolds referenced by these definitions are assumed locally smooth enough to admit a well-defined Riemannian metric tensor g and a well-defined sectional curvature at each point/relation. This is inherent to treating κ_AB as a Riemannian sectional curvature (Def. 1) and is standard differential geometry, not separately argued in the source archive.
- **A2.** Context transitions are assumed locally linear (first-order/Jacobian-approximable) between adjacent states, justifying the use of J as the deformation operator (Def. 2). *Source:* Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md §2.
- **A3.** Trajectories consumed by the discrete-curvature concept (Def. 5) are assumed to be finitely and regularly sampled sequences, so that continuous curvature is approximated by finite differences of consecutive local direction/velocity vectors. This is a standard numerical-differential-geometry assumption. *Source (concept only):* Archive/RFC0032_40/RFC-0039-AIIE-Holonomy-Sampling-Loop-CDR.md §2.
- **A4.** The metric g used in the Cauchy-Green construction (Def. 3) is assumed to be the same Riemannian metric that induces sectional curvature (Def. 1) and geodesic distance (see NVS-MATH-0002); the archive treats these as facets of one underlying manifold structure rather than independent metrics. *Source:* Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md §2.1; Archive/RFC-STS/RFC-STS05_v1.4.md §2.1.1.

## Normative requirements

1. An implementation that exposes a sectional curvature value κ_AB as a Metric Bundle component MUST represent it as a real number (κ_AB ∈ ℝ). *Source:* Archive/RFC-STS/RFC-STS05_v1.4.md §2.1.1.
2. An implementation that computes a deformation tensor MUST construct it as J^i_j = ∂y^i/∂x^j and, where a metric-relative stretch/compression measure is required, MUST derive it as C = Jᵀ g J rather than by an ad hoc distance difference. *Source:* Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md §2, §2.1.
3. An implementation that classifies deformation regimes SHOULD use the eigenvalue-based dilation/compression/shear vocabulary of Def. 4 rather than inventing an incompatible taxonomy, to preserve interoperability of public deformation reports. *Source:* Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md §3.
4. An implementation that exposes a discrete trajectory curvature signal κ_t MUST report it as a non-negative real number (κ_t ≥ 0) and MUST document it as zero (or numerically negligible) for a straight, unaccelerated trajectory segment. The exact computation MAY be proprietary; the sign and boundedness-from-below invariant MUST NOT be violated by any conforming implementation. *Source (invariant only, formula redacted):* Archive/RFC0032_40/RFC-0039-AIIE-Holonomy-Sampling-Loop-CDR.md §2; Archive/RFC-NVS-DAK/RFC-NVS-DAK01_v2.1.md §5.4 ("Return `curvature >= 0.0`").
5. A curvature-derived risk signal consumed by a Runtime Safety Module MUST be a bounded scalar that is monotonically non-decreasing in the underlying curvature signal and MUST NOT decrease as curvature increases. The exact bound, saturation behavior, and scaling MAY be proprietary and are out of scope of this document. *Source (invariant only, formula redacted):* Archive/RFC-NVS-DAK/RFC-NVS-DAK01_v2.1.md §8.2, §8.5.
6. An implementation MUST treat divergence of a computed sectional curvature (κ → ±∞) as a reportable singularity condition rather than silently clamping or discarding it. *Source:* Archive/RFC-STS/RFC-STS05_v1.4.md §3.4.
7. This document MUST NOT be read as specifying the exact curvature-composition formula used when combining sectional curvature across chained relations in the Enriched Metric Bundle (Archive/RFC-STS/RFC-STS05_v1.4.md §2.2.3 in source numbering); that formula involves a manifold-specific coupling constant judged proprietary tuning of standard curvature-combination mathematics and is redacted (see Open Issues below for the redaction rationale).

## References

**Normative:**
- Archive/RFC-STS/RFC-STS05_v1.4.md — Enriched Metric Bundle, sectional curvature component (§2.1.1), curvature singularity exception (§3.4).
- Archive/RFC0032_40/RFC-0036-AIIE-Semantic-Deformation-Tensor.md — Jacobian/deformation tensor, Cauchy-Green relation to the Riemannian metric.
- Archive/RFC0032_40/RFC-0039-AIIE-Holonomy-Sampling-Loop-CDR.md — discrete trajectory curvature concept (formula redacted).

**Informative:**
- Archive/RFC-NVS-DAK/RFC-NVS-DAK01_v2.1.md — context only; describes how a curvature-derived risk signal feeds an Adaptive Gain Scheduler and intervention policy. Formulas and constants not restated here; this document defines interface only.
- Standard references for the underlying mathematics: Riemannian Geometry (sectional curvature); Continuum Mechanics (Cauchy-Green deformation tensor); Numerical Differential Geometry (discrete curve curvature via finite differences).

## Implementation implications

- Implementations MAY compute sectional curvature using any numerically valid Riemannian estimator consistent with Def. 1, provided results are reported as real numbers and singularities (Def. 7) are surfaced rather than swallowed.
- Implementations that need a metric-aware deformation measure SHOULD use the standard Cauchy-Green construction (Def. 3) rather than a bespoke non-metric distance heuristic, to remain consistent with downstream consumers that expect a proper quadratic form.
- Implementations that expose a discrete trajectory curvature signal or a curvature-derived risk signal to public interfaces MUST honor the invariants in Normative Requirements 4–5 but MAY treat the internal formula, calibration constants, and thresholds as private; sensos-docs deliberately does not standardize those internals.
- Any component consuming the curvature-derived risk signal across a public API boundary SHOULD treat it purely as an opaque, bounded, monotone scalar and MUST NOT assume a specific closed-form relationship to κ_t beyond monotonicity.

## Related RFCs

- **RFC-NVS-0205** — related NVS specification (see sibling document tree; not read for this draft).
- **RFC-NVS-0206** — Runtime Safety Module; consumes the curvature-derived risk signal defined at interface level in Def. 6. Not read for this draft per task instructions; referenced by name only.
- **NVS-MATH-0002** — Geodesic Mathematics; covers geodesic distance, connections, parallel transport, and holonomy, which are related but distinct geometric structures from curvature.

## Open Issues / Contradictions

**Terminology overlap across sources (not a mathematical contradiction).** The archive uses the word "curvature" for two structurally different objects: (1) RFC-STS05's κ_AB, a static, per-relation-edge sectional curvature attached to a Knowledge Category morphism, composed algebraically across chained relations; and (2) RFC-0039's/RFC-NVS-DAK01's κ_t, a dynamic, per-decode-step discrete curvature of a hidden-state or context trajectory, computed via finite differences and consumed as a runtime risk signal. These are not competing definitions of the same quantity — they measure curvature of different underlying spaces (a knowledge-graph relation manifold vs. a generation-time trajectory) for different purposes (metric-bundle algebra vs. real-time instability detection) — so no contradiction is flagged for resolution. Readers and dependent specifications MUST NOT assume κ_AB and κ_t are interchangeable or numerically related.

**Redaction of RFC-STS05's curvature composition formula.** RFC-STS05 §2.2.3 (source numbering) gives an explicit formula for how sectional curvature combines when two relations compose (κ_AC = κ_AB + κ_BC minus a term scaled by a manifold-specific coupling constant and involving the gradient of κ_AB). Unlike the plain definition of sectional curvature itself, this composition rule is a bespoke algebraic law invented for the Enriched Metric Bundle's monoidal composition algebra, not a standard textbook Riemannian-geometry identity. Per this document's proprietary-redaction policy, it is treated as category (b) and is not restated here; only its qualitative existence is noted in Normative Requirement 7.

**No TODO placeholders required.** Every topic in this document's declared scope (sectional curvature, deformation tensor, discrete trajectory curvature, curvature-derived risk signal) has surviving source material in the four named archive files. No placeholder subsections were needed.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
