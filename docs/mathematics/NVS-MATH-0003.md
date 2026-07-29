---
title: Semantic Metric
id: NVS-MATH-0003
status: Proposed
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
related:
  - RFC-NVS-0205
  - NVS-MATH-0001
  - NVS-MATH-0002
  - NVS-MATH-0004
---

## Abstract

This specification defines the **Semantic Metric**: the type-theoretic and geometric structure NVS-Kernel uses to quantify a relation between two semantic objects. It consolidates two archive sources that address the same underlying question — "what does it mean to measure a semantic relation?" — from two different angles: a ten-component **Enriched Metric Bundle** with an algebraic composition structure (RFC-STS05), and standard information-geometric metric theory (RFC0031, Fisher information metric, geodesics, natural gradient). The document publishes the structural type of the metric bundle and the standard mathematics it may draw on; it does not publish NVS-Kernel's exact tuned composition, decay, or projection formulas, which remain proprietary.

## Purpose

To give downstream specifications (RFC-NVS-0205 and others) a single, implementation-neutral vocabulary for "how strongly/plausibly/geometrically related are two semantic objects," so that they can reason about semantic relations as typed, structured quantities without depending on NVS-Kernel's private calibration.

## Scope

**In scope:**
- The algebraic type of the Enriched Metric Bundle vector $\mathbf{v}_{AB}$ and the domain of each of its ten components.
- The general categorical framing of $\mathbf{v}_{AB}$ as an object of a symmetric monoidal "metric category" $\mathcal{V}$ enriching the Knowledge Category.
- The existence and type signature of a composition operator, a temporal decay endofunctor, and a projection functor into a differentiable execution substrate — as structural interfaces, not as concrete formulas.
- Standard, textbook information geometry (Fisher information metric, geodesic action functional, Hessian curvature decomposition, natural gradient) as background mathematics available to NVS-Kernel.

**Out of scope:**
- The exact tuned composition formulas, decay constants, and projection matrices used by NVS-Kernel in practice (proprietary; see redaction notes below).
- The CFI ("Contradiction Field Index") journalism-domain application in RFC0031 — only its general mathematical formalism is extracted here.
- STLE's internal neural execution details beyond the existence of a projection functor into weight-tensor space.

## Dependencies

- **NVS-MATH-0001, NVS-MATH-0002** — assumed prerequisite type-system/category-theoretic foundations (referenced, not restated here).
- **RFC-NVS-0205** — consumes this specification's Semantic Metric type.
- **NVS-MATH-0004 (Observation Geometry)** — every Observation Object is structurally bound to a Metric Bundle as defined here (see that document and RFC-STS09 §2.1).
- Standard external mathematics: symmetric monoidal category theory, Riemannian geometry, Shannon information theory, Amari-style information geometry.

## Definitions

**Enriched Metric Bundle vector.** For a morphism $f: A \to B$ in the Knowledge Category, its metric state is a vector

$$\mathbf{v}_{AB} = (c_{AB},\, E_{AB},\, \kappa_{AB},\, \chi_{AB},\, H_{AB},\, d_{AB},\, C_{AB},\, \theta_{AB},\, s_{AB},\, t_{AB})$$

with ten typed components (source: `RFC-STS/RFC-STS05_v1.4.md` §2.1, "Metric Component Definitions"):

| Symbol | Name | Domain | Role |
|---|---|---|---|
| $c_{AB}$ | Confidence | $[0,1]$ | Consensus probability of the relation |
| $E_{AB}$ | Semantic Energy | $\mathbb{R}^+$ | Activation potential / attention weight |
| $\kappa_{AB}$ | Sectional Curvature | $\mathbb{R}$ | Local geometric deformation of the manifold near the relation |
| $\chi_{AB}$ | Manifold Torsion | $\mathbb{R}$ | Geometric twist / directional skew along the path |
| $H_{AB}$ | Information Entropy | $\mathbb{R}^+$ | Structural uncertainty of the transmission path |
| $d_{AB}$ | Geodesic Distance | $\mathbb{R}^+$ | Localized distance across the latent manifold |
| $C_{AB}$ | Causality Index | $[-1,1]$ | Directed influence; $\to 1$ strict causal implication, $\to -1$ reverse causation, $\to 0$ independence |
| $\theta_{AB}$ | Phase Angle | $[0,2\pi)$ | Complex-plane narrative phase for non-Euclidean trajectory projection |
| $s_{AB}$ | Temporal Stability | $[0,1]$ | Resistance coefficient to temporal decay |
| $t_{AB}$ | Temporal Anchor | $\mathbb{R}$ | Unix epoch of initial observation / last assertion |

This ten-field structure is a type/architecture definition (a schema of what a semantic metric bundle *is*), not a tuned algorithm, and is treated as publishable per the redaction policy below.

**Metric Bundle Category $\mathcal{V}$.** $\mathbf{v}_{AB}$ is an object of a symmetric monoidal category $(\mathcal{V}, \otimes, I)$ that the Knowledge Category $\mathcal{K}$ is enriched over (source: RFC-STS05 §2.3.2). This is a standard application of $\mathcal{V}$-enriched category theory: publishable as structure.

**Composition operator $\odot$.** For contiguous morphisms $f: A \to B$, $g: B \to C$, a composite bundle is produced by

$$\odot : \underline{\mathrm{Hom}}(B,C) \otimes \underline{\mathrm{Hom}}(A,B) \longrightarrow \underline{\mathrm{Hom}}(A,C)$$

defined element-wise over the ten components (source: RFC-STS05 §2.2). This type signature — an element-wise binary operator realizing the monoidal product $\otimes$ on Hom-objects — is standard enrichment-structure vocabulary and is publishable. **The concrete per-component formulas are not** (see Private implementation note, below).

**Temporal decay endofunctor.** A flow $\Phi_{\Delta t} : \mathcal{V} \to \mathcal{V}$ models continuous-time state drift: $\mathbf{v}(t_0+\Delta t) = \Phi_{\Delta t}(\mathbf{v}(t_0))$ (source: RFC-STS05 §3.1). The existence of such an endofunctor, and the qualitative fact that it is monotone in the decay-favoring direction (confidence and energy non-increasing, entropy non-decreasing, bounded by a limit), is publishable; **its exact functional form and decay constants are not.**

**Projection functor (STLE).** A separate functor maps $\mathcal{V}$-valued metric bundles into the linear-algebraic category of neural weight tensors, for execution on differentiable hardware (source: RFC-STS05 §3.2). Its existence and type ($\mathcal{V} \to (\mathbb{R}^{D\times D}, \mathbb{R}^D)$-valued pairs) is publishable; **its exact construction is not.**

**Information-geometric metric tensor (standard theory).** For a parametric family of distributions $p_\theta$ over a state space, the Fisher information metric is

$$g_{ij}(\theta) = \mathbb{E}\!\left[\frac{\partial \log p_\theta}{\partial \theta_i}\frac{\partial \log p_\theta}{\partial \theta_j}\right]$$

and induces a Riemannian distance $d^2(S_1,S_2) = (S_1-S_2)^\top g(S)(S_1-S_2)$ (small-displacement / local quadratic form), a geodesic action functional $E[\gamma] = \tfrac{1}{2}\int_0^1 \dot\gamma^\top g(\gamma)\dot\gamma\,dt$ whose minimizer $\gamma^*$ is the geodesic, and a natural-gradient update rule $\Delta\theta = -\eta\, H^{-1}\nabla \mathcal{E}$ using the Hessian $H$ of an energy/loss functional in place of the identity metric (source: `RFCv3/RFC0031.md` §1.2, §2, §4, §6). This is standard Amari-style information geometry, textbook mathematics, and is publishable in full generality. RFC0031's own worked example — the CFI (Contradiction Field Index) space, its EGEM energy decomposition $E_{total} = \lambda_1 E_{UG} + \lambda_2 E_{Val} + \lambda_3 E_{Field}$, and its Hessian decomposition $H_{CFI} = F + H_{UG} + H_{Evidence}$ — is a journalism-domain application and is **out of scope** for NVS-Kernel; only the general theory above is extracted. The general fact that a Hessian of a sum decomposes additively into the Hessians of its summands (ordinary multivariable calculus) is stated without the CFI-specific summands.

> **Private implementation note:** The exact functional form, calibration constants, and derivation of the metric bundle's composition operator $\odot$ (RFC-STS05 §2.2, all seven component formulas), its temporal decay rates and thresholds ($\lambda_c, \lambda_E, \lambda_H, c_\text{threshold}, H_\text{limit}$), and the STLE projection matrices ($\mathbf{W}_\text{relation}, \boldsymbol{\Omega}, \mathbf{u}_\text{relation}$) are proprietary to NVS-Kernel and are maintained in the private NVS-Kernel documentation. This public specification defines only their interface: $\odot : \mathcal{V}\otimes\mathcal{V}\to\mathcal{V}$ element-wise; $\Phi_{\Delta t}:\mathcal{V}\to\mathcal{V}$ a decay endofunctor monotone in confidence/energy (non-increasing) and entropy (non-decreasing, bounded); and the STLE projection $\mathcal{V} \to \mathbb{R}^{D\times D}\times\mathbb{R}^D$ producing a transition matrix and bias tensor consumed by a differentiable block $\mathbf{x}_B = \sigma(\mathbf{M}_f\mathbf{x}_A + \mathbf{b}_f)$.

## Mathematical assumptions

1. Each component of $\mathbf{v}_{AB}$ is assumed real-valued (or integer-epoch, for $t_{AB}$) and confined to its declared domain at all times; the archive does not specify enforcement mechanics beyond the compiler diagnostics in RFC-STS05 §3.4.
2. The composition operator $\odot$ is assumed associative up to the same coherence conditions required of any enrichment structure over a monoidal category (RFC-STS05 §2.3.2); the archive does not include a proof of associativity or of the monoidal coherence (pentagon/triangle) axioms for $\odot$ concretely — this is inherited, not demonstrated, structure.
3. Causal composition assumes a total, non-degenerate temporal ordering ($t_{AB} \neq t_{BC}$ resolved via strict inequality) is available on all temporal anchors; simultaneity is not modeled.
4. The Fisher information metric $g_{ij}$ is assumed to arise from a smooth, regular parametric family $p_\theta$ (standard regularity conditions for Fisher information to be well-defined and positive semi-definite); the archive does not state these conditions explicitly but they are required for the cited formulas to be valid.
5. The geodesic action functional and its minimizing curve are assumed to exist on the manifold in question (existence of geodesics is a differential-geometric regularity assumption, not proven for the NVS semantic manifold in the archive).

## Normative requirements

1. Every NVS-Kernel semantic relation MUST be representable as an Enriched Metric Bundle vector $\mathbf{v}_{AB}$ with exactly the ten typed components defined above.
2. Each component of $\mathbf{v}_{AB}$ MUST remain within its declared domain at all times; a value outside its domain MUST be treated as invalid and MUST NOT be composed.
3. A composition of two contiguous relations' metric bundles MUST be produced by a single, deterministic, element-wise operator $\odot$ conforming to the type signature $\underline{\mathrm{Hom}}(B,C)\otimes\underline{\mathrm{Hom}}(A,B) \to \underline{\mathrm{Hom}}(A,C)$; the exact per-component formula is implementation-private (see redaction note).
4. Causal composition MUST enforce strict temporal precedence: if the second relation's temporal anchor does not strictly follow the first's, the composed causality index MUST be treated as a defined error/zero condition (a causal-inversion fault), not silently propagated.
5. A temporal decay operation applied to a metric bundle MUST be representable as an endofunctor $\Phi_{\Delta t}:\mathcal{V}\to\mathcal{V}$ and MUST be monotone in the decay-favoring direction described under Definitions.
6. Confidence composition MUST NOT increase confidence beyond the confidence of either composed segment (composition SHOULD behave as a submultiplicative/monotone-non-increasing combination consistent with treating confidence as a probability-like quantity), even though the exact functional form is private.
7. Implementations that additionally compute a Fisher-information-style metric tensor SHOULD ensure $g_{ij}$ is positive semi-definite, per standard information-geometric convention; this is a SHOULD, not a MUST, because no surviving archive source mandates that NVS-Kernel's metric bundle itself be derived from a Fisher information metric — RFC0031's information geometry and RFC-STS05's metric bundle are two distinct formalisms not yet unified in the archive (see Open Issues).
8. A metric bundle or its composition MUST NOT be published, logged, or exposed publicly with an accompanying disclosure of the private composition/decay/projection constants referenced above.

## References

- RFC-STS05 v1.4, "STS Enriched Metric Bundles & Semantic Tensor Spaces" — `RFC-STS/RFC-STS05_v1.4.md` (Archive) — source of the ten-component Enriched Metric Bundle, the monoidal composition operator $\odot$, the temporal decay endofunctor $\Phi_{\Delta t}$, the STLE projection functor, and the NIR serialization schema.
- RFC0031, "Information Geometry of CFI Space" — `RFCv3/RFC0031.md` (Archive) — source of the Fisher information metric $g_{ij}$, the induced quadratic-form distance, the geodesic action functional, the Hessian curvature decomposition, and the natural gradient update rule (general theory only; CFI-specific application out of scope).

## Implementation implications

- Any NVS-Kernel component that stores, transmits, or compares semantic relations MUST use a serialization that can carry all ten Metric Bundle fields (see RFC-STS05 §3.3 NIR schema for a private-implementation reference shape; the field *names/types* shown there — `confidence`, `energy`, `curvature_kappa`, `torsion_chi`, `entropy`, `geodesic_distance`, `causality`, `phase_theta_rad`, `stability`, `timestamp_epoch` — are structural and publishable; the accompanying `dynamic_rules` calibration block in that schema (decay lambdas, dissipation action) is proprietary and MUST NOT be reproduced with concrete values in public documentation).
- Systems consuming composed metric bundles should treat $\odot$, $\Phi_{\Delta t}$, and the STLE projection as opaque, versioned NVS-Kernel services with a stable public type signature, not as formulas to reimplement from this specification.
- Any future public exposure of an information-geometric metric (Fisher-style $g_{ij}$) for NVS-Kernel's own semantic manifold should cite this document's Definitions section for the standard-theory baseline, and must independently determine (in private documentation) whether/how it maps onto the existing $\mathbf{v}_{AB}$ components — no such mapping currently exists in the archive.

## Related RFCs

- RFC-NVS-0205
- NVS-MATH-0001
- NVS-MATH-0002
- NVS-MATH-0004 (Observation Geometry — every Observation Object is bound to a Metric Bundle as defined here)

## Open Issues / Contradictions

1. **No formal bridge between RFC0031's information geometry and RFC-STS05's metric bundle.** RFC0031 defines a full Riemannian metric tensor $g_{ij}$ over a continuous state manifold, with geodesics as minimum-energy curves. RFC-STS05 defines geodesic distance $d_{AB}$ as one scalar component of a discrete, per-relation metric bundle, combined under composition via a law-of-cosines-style formula using the phase angle $\theta$ (formula itself redacted above). No archive source states whether RFC-STS05's $\kappa_{AB}$ (sectional curvature) is the same mathematical object as RFC0031's Hessian-derived curvature $H_{CFI}$, or whether RFC-STS05's $d_{AB}$ is intended to be an instance of RFC0031's $g_{ij}$-induced distance. Treat as two coexisting, not-yet-unified formalizations until a bridging document exists. **TODO:** no surviving source material found reconciling these two treatments of "semantic distance/curvature"; do not fabricate a mapping.
2. **CFI-space vs. NVS-Kernel scope.** RFC0031 is written for a journalism-specific "Contradiction Field Index" application (Gemmina Intelligence's Pure Information Laboratory), not explicitly for NVS-Kernel. It is unclear from the archive whether RFC0031's information geometry was ever intended to generalize to NVS-Kernel's semantic manifold, or is domain-specific to CFI only. This document extracts only the general mathematical formalism per the canonicalization brief; the applicability question itself is unresolved.
3. **No archive proof that composed geodesic distance satisfies metric-space axioms.** RFC-STS05's composition formula for $d_{AC}$ is not accompanied by a proof that repeated composition preserves the triangle inequality or non-negativity in all cases; this is assumed, not demonstrated, in the source.
4. **Inherited gaps carried forward from RFC-STS05 itself:** RFC-STS10 ("Mathematical Foundations," which would give the full formal treatment of Functor/Monoidal Category underlying this document's Definitions) is cited as a forward reference but does not exist yet. RFC-HEKB00, cited as the owner of the Knowledge Category $\mathcal{K}$ that $\mathcal{V}$ enriches, also does not exist in the archive — though a public HEKB constitutional document is now published alongside this batch as RFC-NVS-0209 (HEKB Memory Model), which may partially close this gap; readers should confirm against that document directly. Both gaps are noted here for completeness, not introduced by this document.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
