---
title: Geodesic Mathematics
id: NVS-MATH-0002
status: Proposed
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
related:
  - RFC-NVS-0205
  - NVS-MATH-0001
  - NVS-MATH-0003
---

## Abstract

This specification formalizes the mathematics of geodesics, connections, parallel transport, and holonomy used across the NVS-Kernel ecosystem. As with curvature (NVS-MATH-0001), the archive mixes standard, textbook differential/information geometry — geodesic distance, the dual α-connection of information geometry, parallel transport, and holonomy — with GemminAI-specific tuned mechanisms built on top of that standard theory (a geodesic-distance composition rule with a manifold-specific angular term, a user-specific connection parameterization, and a constraint-driven repair objective). This document states the standard mathematics in full and defines only the public interface of the tuned mechanisms.

## Purpose

To give sensos-docs consumers a single, canonical, public reference for geodesic-related mathematics in NVS-Kernel: what a geodesic distance is and how it is defined on the relevant manifolds, what connection NVS-Kernel's semantic-navigation model uses, how parallel transport and holonomy are defined, and how these standard constructs are consumed by NVS-Kernel's reasoning-diagnostic mechanisms — without disclosing NVS-Kernel's proprietary tuned formulas.

## Scope

**In scope:**
- The geodesic-distance component of the Enriched Metric Bundle and the standard concept of geodesic distance as a metric-induced shortest-path length (Archive/RFC-STS/RFC-STS05_v1.4.md).
- The dual α-connection of information geometry (e-connection, m-connection, interpolated geometry) and the standard geodesic equation ∇_γ̇γ̇ = 0 (Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md).
- Semantic parallel transport and semantic holonomy as general geometric definitions (Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md).
- The public interface (type/role/invariants) of the tuned mechanisms built on the above: the geodesic-distance composition rule, the user-specific connection parameterization, and the holonomy-driven repair mechanism.

**Out of scope:**
- Curvature mathematics — see NVS-MATH-0001.
- The exact tuned composition formula for geodesic distance, the exact construction of a user-specific connection tensor, the exact holonomy diagnostic thresholds, and the exact repair-energy objective. These are proprietary and redacted per policy below.
- The full Holonomy Sampling Loop algorithm and NOMOS-CDR pipeline architecture, normatively owned by their source RFCs (RFC-0039 and successors), only referenced here for the geometric interface they consume.

## Dependencies

This document assumes familiarity with:
- Standard Riemannian geometry: metrics, geodesics, affine connections, parallel transport, holonomy.
- Standard information geometry: statistical manifolds, exponential families, the Amari dual (α-connection) formalism, e-connections and m-connections.
- Standard linear algebra: inner products, tensors, vector norms.

It has no normative dependency on unpublished material. It has an informative dependency on RFC-0039 (Holonomy Sampling Loop and Constraint-Driven Repair), which consumes the parallel-transport and holonomy definitions given here.

## Definitions

1. **Geodesic distance (d_AB ∈ ℝ⁺).** A per-relation scalar component of the Enriched Metric Bundle vector **v**_AB: the localized distance metric computed across the latent manifold along a locally shortest path — the standard Riemannian notion of geodesic distance induced by a metric tensor g. *Source:* Archive/RFC-STS/RFC-STS05_v1.4.md §2.1.1 (item 6).

2. **Geodesic distance composition — interface only.** When two relations compose (A→B, B→C), the geodesic distance of the composite path d_AC is derived from d_AB, d_BC, and the phase-angle difference between the two segments. *Source (context only, formula redacted):* Archive/RFC-STS/RFC-STS05_v1.4.md §2.2.6 (source numbering).
   > **Private implementation note:** The exact composition formula, including how the phase-angle term enters the combination, is proprietary to NVS-Kernel and is maintained in the private NVS-Kernel documentation. This public specification defines only its interface: d_AC is a non-negative real number, is symmetric in the ordering-independent parts of the inputs it is defined from, and reduces to a triangle-inequality-consistent combination of d_AB and d_BC in the degenerate case of zero angular offset between segments.

3. **Dual α-connection (Γ^(α)_ijk).** The standard Amari information-geometry connection coefficient on a statistical manifold parameterized by θ:
   Γ^(α)_ijk(θ) = 𝔼_θ[ ( ∂²log p(x|θ)/∂θ^i∂θ^j + ((1-α)/2) · ∂log p(x|θ)/∂θ^i · ∂log p(x|θ)/∂θ^j ) · ∂log p(x|θ)/∂θ^k ]
   This is standard, published information-geometry formalism (Amari-style dual connections), not GemminAI-specific. *Source:* Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md §2.1.

4. **e-connection and m-connection.** Special cases of Def. 3: α = +1 gives the e-connection (exponential; "logically flat" space governing literal inference and direct logical consequence); α = -1 gives the m-connection (mixture; governs metaphor, blended narratives, rhetorical mixing); intermediate α gives an interpolated geometry (partial reframing, hedged discourse). Standard Amari dual-connection terminology. *Source:* Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md §2.2.

5. **Geodesic equation.** A curve γ is a geodesic of connection ∇ if ∇_γ̇γ̇ = 0, i.e., its own tangent vector field is parallel-transported along itself. Standard differential geometry. *Source:* Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md §4.

6. **User-specific connection parameterization — interface only.** "Epistemic individuality" is realized by fixing the connection Γ as a user-specific tensor Γ^(α_user), so that a user's geodesic navigation follows ∇_γ̇γ̇ = 0 under that user-specific connection rather than a default consensus connection. *Source (concept only; source gives no explicit construction formula):* Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md §4.
   > **Private implementation note:** The mechanism by which a concrete Γ^(α_user) tensor is constructed or fitted for a given user is proprietary to NVS-Kernel; the source archive documents only its existence and role, not its derivation. This public specification defines only its interface: Γ^(α_user) is a connection of the same type as the standard dual α-connection (Def. 3), specific to a user or context, and substitutable into the standard geodesic equation (Def. 5) without changing that equation's form.

7. **Semantic parallel transport.** For a context transition curve γ(t) on manifold S and a Perspective Vector V(t) transported along it, parallel transport under connection ∇ is defined by ∇_γ̇(t)V(t) = 0. Standard differential geometry, applied to a semantic/statistical manifold. *Source:* Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md §2.

8. **Semantic holonomy / Holonomy Error (H(C)).** For a Perspective Vector parallel-transported along a closed curve C, with initial state V_i and final state V_f, the Holonomy Error is H(C) = ‖V_f − V_i‖, and the Holonomy Operator 𝓗(C): V_i ↦ V_f is the standard holonomy map of the connection around C. Non-zero holonomy indicates the manifold/connection is curved. Standard differential geometry. *Source:* Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md §3.

9. **Holonomy-driven diagnosis — interface only.** H(C) (Def. 8), together with the discrete trajectory curvature κ_t (NVS-MATH-0001 Def. 5), is used as an instability signal: small values indicate stable transport, large/diverging values indicate transport divergence and trigger a repair mechanism. *Source (context only, thresholds/algorithm redacted):* Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md §4–§5; Archive/RFC0032_40/RFC-0039-AIIE-Holonomy-Sampling-Loop-CDR.md §4.
   > **Private implementation note:** The exact triggering threshold(s), the sampling-loop algorithm that computes H(C) and κ_t in real time, and the exact repair objective used to reconstruct output once divergence is predicted are proprietary to NVS-Kernel and maintained in the private NVS-Kernel documentation. This public specification defines only its interface: H(C) is a non-negative real-valued diagnostic; NVS-Kernel MUST treat larger H(C) as indicating a less stable reasoning trajectory than smaller H(C); crossing an implementation-defined threshold MAY trigger a corrective action.

## Mathematical assumptions

- **A1.** The manifolds on which geodesic distance and holonomy are defined are assumed to carry a well-defined Riemannian metric g (for geodesic distance, Def. 1) or a well-defined affine connection ∇ (for parallel transport/holonomy, Defs. 7–8); this is inherent to using these as standard geometric constructs and is not separately argued in the source archive.
- **A2.** The statistical manifold underlying the α-connection (Def. 3) is assumed to be a regular parametric family p(x|θ) admitting the log-likelihood derivatives used in the connection-coefficient formula; this is the standard regularity assumption of information geometry. *Source:* Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md §2.1.
- **A3.** Context transition curves γ(t) and Perspective Vectors V(t) are assumed sufficiently smooth for the parallel-transport ODE ∇_γ̇(t)V(t) = 0 to admit a solution along the curve. Standard differential geometry. *Source:* Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md §2.
- **A4.** Holonomy is evaluated over closed curves C; the archive does not define holonomy for open paths, and this document makes no such extension. *Source:* Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md §3.

## Normative requirements

1. An implementation that exposes a geodesic distance value d_AB as a Metric Bundle component MUST represent it as a non-negative real number (d_AB ∈ ℝ⁺). *Source:* Archive/RFC-STS/RFC-STS05_v1.4.md §2.1.1.
2. An implementation that composes geodesic distances across chained relations MUST produce a non-negative result and SHOULD document any degenerate-case behavior (e.g., zero angular offset) against Def. 2's stated invariant; the exact composition formula MAY be proprietary. *Source (invariant only, formula redacted):* Archive/RFC-STS/RFC-STS05_v1.4.md §2.2.6.
3. An implementation that computes a dual α-connection MUST use α = +1 for the e-connection and α = -1 for the m-connection, consistent with Def. 4, and MUST treat intermediate α as an interpolated geometry rather than a discrete third case. *Source:* Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md §2.2.
4. An implementation that computes geodesics under any connection (default or user-specific) MUST solve the standard geodesic equation ∇_γ̇γ̇ = 0 (Def. 5); it MUST NOT substitute a different defining equation for what it calls a "geodesic." *Source:* Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md §4.
5. Where a user-specific connection Γ^(α_user) is used to personalize navigation, an implementation MUST substitute it into the same geodesic equation (Def. 5) rather than defining a separate personalized geometry with different structure; the construction of Γ^(α_user) itself MAY be proprietary. *Source (invariant only, construction redacted):* Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md §4.
6. An implementation that performs parallel transport MUST satisfy ∇_γ̇(t)V(t) = 0 along the transport curve under the active connection. *Source:* Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md §2.
7. An implementation that reports holonomy MUST compute it as H(C) = ‖V_f − V_i‖ for a closed curve C, MUST report H(C) ≥ 0, and MUST treat H(C) = 0 as the flat/no-drift case. *Source:* Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md §3.
8. An implementation that uses H(C) as a diagnostic signal MUST treat larger H(C) as indicating greater instability than smaller H(C) (monotonic severity ordering); the exact triggering threshold(s) and any composite repair objective built on H(C) MAY be proprietary and are out of scope of this document. *Source (invariant only, threshold/objective redacted):* Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md §4–§5; Archive/RFC0032_40/RFC-0039-AIIE-Holonomy-Sampling-Loop-CDR.md §4.

## References

**Normative:**
- Archive/RFC-STS/RFC-STS05_v1.4.md — geodesic distance component of the Enriched Metric Bundle (§2.1.1); composition rule referenced but redacted (§2.2.6, source numbering).
- Archive/RFC0032_40/RFC-0037-AIIE-Semantic-Connection-Alpha-Geometry.md — dual α-connection, e-/m-connections, geodesic equation, user-specific connection concept.
- Archive/RFC0032_40/RFC-0038-AIIE-Semantic-Parallel-Transport-Holonomy.md — parallel transport, holonomy error, holonomy-driven diagnosis concept.

**Informative:**
- Archive/RFC0032_40/RFC-0039-AIIE-Holonomy-Sampling-Loop-CDR.md — context only; describes how H(C) and κ_t feed a repair mechanism. Repair-objective formula not restated here.
- Standard references for the underlying mathematics: Riemannian Geometry (geodesics, connections, parallel transport, holonomy); Amari & Nagaoka-style Information Geometry (dual α-connections).

## Implementation implications

- Implementations MAY compute geodesic distance using any Riemannian-consistent shortest-path estimator, provided results are non-negative and composition behavior is documented against Def. 2's invariants without requiring disclosure of NVS-Kernel's internal formula.
- Implementations that support both e- and m-connection reasoning modes SHOULD expose α as a first-class parameter rather than hard-coding a single connection, to preserve interoperability with the standard Amari formalism.
- Implementations that personalize navigation via a user-specific connection MUST preserve the standard geodesic-equation contract (Normative Requirement 5) so that downstream consumers can reason about "a user's geodesic" using the same equation regardless of whose connection is active.
- Any component consuming H(C) or κ_t across a public API boundary SHOULD treat both purely as opaque, non-negative, monotone-severity diagnostics and MUST NOT assume a specific closed-form repair objective or threshold beyond the monotonicity invariant in Normative Requirement 8.

## Related RFCs

- **RFC-NVS-0205** — related NVS specification (see sibling document tree; not read for this draft).
- **NVS-MATH-0001** — Curvature Mathematics; the discrete trajectory curvature κ_t referenced in Def. 9 is defined there.
- **NVS-MATH-0003** — presumed related specification in the numbering sequence; not read for this draft and not available as source material for this document.

## Open Issues / Contradictions

**Terminology overlap across sources (not a mathematical contradiction).** As with curvature, "geodesic" and "distance" name two structurally different constructs in the archive: RFC-STS05's d_AB is a static per-relation-edge geodesic distance on the Knowledge Category's metric-bundle manifold, composed algebraically with a phase-angle term across chained relations; RFC-0037/RFC-0038's geodesics are trajectories of a Perspective Vector under a dual α-connection on a statistical/semantic manifold, diagnosed via parallel transport and holonomy. These serve different subsystems (STS Metric Bundle graph algebra vs. AIIE/NOMOS reasoning-trajectory diagnostics) and are not asserted to be the same manifold or the same metric. No contradiction is flagged for resolution; dependent specifications MUST NOT assume d_AB and the α-connection geodesics are interchangeable or numerically related.

**Redaction of RFC-STS05's geodesic composition formula.** RFC-STS05 §2.2.6 (source numbering) gives an explicit law-of-cosines-style formula combining d_AB and d_BC via the phase-angle difference θ_BC − θ_AB. This is a bespoke composition rule for the Enriched Metric Bundle, not a general Riemannian-manifold identity (general Riemannian manifolds do not admit a closed-form law-of-cosines composition of geodesic distances). Per this document's proprietary-redaction policy it is treated as category (b) and redacted; only its qualitative interface is given in Def. 2.

**Unpublished forward reference (informative, not a contradiction).** RFC-STS05 forward-references RFC-STS10 (Mathematical Foundations) for the general categorical treatment (Functor, Endofunctor, Monoidal Category) underlying its enrichment structure; RFC-STS10 is stated in the source as not yet published. This document's geodesic-distance scope does not depend on that categorical treatment, but readers should be aware the full categorical justification for RFC-STS05's constructs is presently incomplete in the archive.

**Resolved — NVS-MATH-0003.** This document's `related` field names NVS-MATH-0003 (Semantic Metric), published alongside this document in the same canonicalization batch; see that document for the Enriched Metric Bundle's full ten-component structure and its relationship to standard information geometry.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
