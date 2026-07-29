---
title: Runtime State Space
id: NVS-MATH-0005
status: Proposed
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
related:
  - RFC-NVS-0205
  - NVS-MATH-0001
  - NVS-MATH-0004
---

## Abstract

This specification defines the mathematical structure of the **runtime state** that an NVS-Kernel Semantic Process occupies while executing: what a state *is* (its type and domain), what operators are legally applied to it (the transition algebra), and where instances of it live during their lifetime (the Kernel memory model). It consolidates four archive sources that each formalize one facet of this problem at a different layer of the stack — a physical/control-theoretic state representation on $SE(3)$ (RFC-STS08), an abstract algebraic transition structure over a semantic manifold (RFC-NVP32), an empirical pipeline that treats an LLM's hidden-state sequence as a trajectory on such a space (RFC-0040), and the Kernel memory regions that physically house state objects between operations (RFC-SensOS13). Standard Lie-group, hybrid-automaton, and abstract-algebra theory is stated openly. NVS-Kernel-specific encodings, tuned extraction/normalization procedures, and calibration methodology are named and typed only; their exact form is redacted as proprietary.

## Purpose

Prior to this document, "runtime state" was defined independently and inconsistently across at least four archived RFCs, each scoped to its own layer: a physical control-loop state struct (RFC-STS08 §3.4), an abstract semantic-manifold point (RFC-NVP32 §3.1), an empirically-observed LLM hidden-state vector (RFC-0040 §2), and a Kernel-resident object identified only by its memory region (RFC-SensOS13 §3). None of these sources formally unify these notions. This document exists to give downstream consumers — implementers of Semantic Tasks (RFC-SensOS19), Observation Modules (RFC-SensOS16), and physical-layer conformance verifiers (RFC-STS08) — a single canonical, public reference for what a runtime state object is, what algebraic operations are well-defined on it, and what invariants hold, without requiring access to the private NVS-Kernel implementation.

## Scope

**In scope:**

- The physical runtime state type: $SE(3)$/$\mathfrak{se}(3)$ Lie-group coordinates and their manifold-respecting update rule (RFC-STS08 §2.1).
- The structural (field-level) layout of the Continuous Hybrid Vector (CHV) as the canonical runtime representation of a physical state-space point plus discrete mode (RFC-STS08 §3.4).
- The Hybrid Automaton tuple as the discrete-mode structure a runtime state's `hybrid_mode` coordinate ranges over (RFC-STS08 §3.3).
- The abstract Semantic Transition Monoid acting on the semantic manifold $\mathcal{M}$: composition, identity, partial inverse, projection, embedding, canonicalization, and the collapse operator (RFC-NVP32 §3–§8).
- The five Kernel memory regions in which runtime state instances (`NIR_SemanticState` objects, CHV instances) are held, and their lifetime/ownership rules (RFC-SensOS13 §3).
- The *shape* of the pipeline by which a continuous hidden-state sequence is treated as a discretely-sampled trajectory on a runtime state space — extraction, time-synchronization, per-step deformation observation, multi-layer propagation, and baseline-relative validation — without the specific extraction/normalization formula or validation thresholds (RFC-0040 §2–§5).

**Out of scope:**

| Topic | Responsible source / RFC |
|---|---|
| Execution of the QP-CBF solver and Hybrid Automaton runtime dispatch | DAK/EXP-6000, per RFC-STS08 §3.2–§3.3 (this RFC verifies conformance only) |
| Exact normalized-curvature formula, epsilon regularizer, and lead-time/AUC-ROC thresholds | Proprietary; see Private Implementation Notes below |
| Metric tensor, geodesic, and exponential-map computation on $\mathcal{M}$ | RFC-NVP07 (Narrative Geometry) |
| Coordinate chart / dimensionality of the semantic manifold $\mathcal{M}$ itself | RFC-NVP03 (Narrative State Space), RFC-NVP11 (Semantic Coordinate Theory) |
| On-disk serialization and durability journaling | RFC-SensOS17 |
| Category-theoretic treatment of Category/Functor/Product underlying the Hybrid Automaton's product structure | Reserved for RFC-STS10 (Mathematical Foundations), not yet published |
| Verification procedures for the algebraic laws below | RFC-NVP33 (Semantic Verification Logic) |

## Dependencies

Normative:

- **RFC-STS00** (Constitution) §2 Axioms 4–5, §3 Canonical Notation Registry, §4 Responsibility Boundaries — source of the type-preservation and coherence axioms this document's physical-state definitions instantiate, and of the verification-only role of type-layout specifications (RFC-STS08 Archive/RFC-STS/RFC-STS08_v1.4.md).
- **RFC-STS04** — source of `Type<Constraint>` underlying the physical safe set $\mathcal{D}_s$.
- **RFC-NVP03** (Narrative State Space) — source of the semantic manifold $\mathcal{M}$ that RFC-NVP32's algebra acts on.
- **RFC-NVP05 / RFC-NVP18** — source of the semantic flow map $F$ underlying the transition operators defined below.
- **RFC-NVP07** (Narrative Geometry) — source of the metric $d_\mathcal{M}$ and exponential map used by the branch-merge operator.
- **RFC-SensOS03 / RFC-SensOS04 / RFC-SensOS06** — source of the Core Memory Block / Transient Scratchpad "Dual-Memory Model" that RFC-SensOS13's five Kernel regions extend.
- **RFC-SensOS12** — Kernel Architecture governing RFC-SensOS13.
- **RFC-NVS74** (Observation ABI) — source of the Observation lifecycle (`draft`/`final`) gating readability of Semantic Heap-resident state.
- **RFC-NVS20** (HEXT) — source of the sealed-container semantics underlying Crystallized Memory.

Informative (cited by RFC-0040 but not independently verified in this pass):

- RFC-0036 (Jacobian basis), RFC-0037 (Connection/geodesic reference), RFC-0038 (Holonomy Error), RFC-0039 (CDR repair loop). These are named in RFC-0040's cross-RFC dependency table as inputs to its instability pipeline; their own content was not read as part of authoring this document and is not asserted here — see NVS-MATH-0001 and NVS-MATH-0002, published alongside this document, which do read and formalize the public interface of RFC-0036 through RFC-0039.

## Definitions

**Physical runtime state (RFC-STS08 §2.1).** A physical state coordinate $x : \text{Type}\langle\text{State}\rangle$ is an element $T \in SE(3)$:

$$T = \begin{bmatrix} \mathbf{R} & \mathbf{p} \\ \mathbf{0}^T & 1 \end{bmatrix} \in SE(3), \qquad \mathbf{R} \in SO(3),\ \mathbf{p} \in \mathbb{R}^3$$

Rates of change live in the tangent space at the identity, the Lie algebra $\mathfrak{se}(3)$, related to $SE(3)$ by the standard exponential/logarithmic maps $\exp : \mathfrak{se}(3) \to SE(3)$, $\ln : SE(3) \to \mathfrak{se}(3)$. A velocity $\mathbf{v} = [\boldsymbol{\omega}, \mathbf{v}_{\text{trans}}]^T \in \mathbb{R}^6$ has wedge representation $\mathbf{v}^\wedge \in \mathfrak{se}(3)$, and state update is a manifold retraction rather than vector addition:

$$T_{k+1} = T_k \boxplus \Delta\mathbf{v}_k = T_k \exp(\Delta\mathbf{v}_k^\wedge)$$

This is standard Lie-group control theory; it is stated here as the required representation for any physical-layer runtime state, not as GemminAI-specific mathematics.

**Continuous Hybrid Vector (CHV) — structural type (RFC-STS08 §3.4).** The canonical runtime representation of a physical state-space point plus its discrete mode. As a structural interface (field name, type, conceptual role — not memory-layout micro-detail):

| Field | Type | Role |
|---|---|---|
| `timestamp` | `double` | Temporal anchor |
| `hybrid_mode` | `uint32` | Discrete mode $q \in \mathcal{Q}$ (Hybrid Automaton, below) |
| `state_mean` | `double[12]` | Lie-group state coordinates |
| `covariance` | `double[144]` | State-estimation uncertainty (12×12) |
| `control_target` | `double[6]` | Target-goal coordinates |
| `potential_gradient` | `double[6]` | Potential-gradient coordinates |
| `sequence_id`, `status_flags` | `uint32` | Bookkeeping |

**Hybrid Automaton (RFC-STS08 §3.3).** A tuple $\mathcal{H} = \langle \mathcal{Q}, \mathcal{D}, \mathcal{E}, \mathcal{G}, \text{Res} \rangle$: $\mathcal{Q}$ the discrete mode set (bound to CHV's `hybrid_mode`), $\mathcal{D}(q)$ the continuous dynamics domain for mode $q$, $\mathcal{E}$ the transition edges, $\mathcal{G}(e)$ a guard condition, and $\text{Res}(e)$ the reset map applied to continuous state at a transition. This is standard hybrid-systems formalism.

**Semantic runtime state space (RFC-NVP32 §3.1).** The manifold $\mathcal{M}$ (RFC-NVP03), together with a distinguished attractor set $A = \{s_1^*, \ldots, s_K^*\} \subset \mathcal{M}$, a collapse set $\mathcal{C} = \bigcup_k \mathcal{B}(S_{d,k}) \subset \mathcal{M}$, a target basin $\mathcal{B}(s^*_\text{target})$, and a metric $d_\mathcal{M}$.

**Semantic Transition Monoid (RFC-NVP32 §3.2).** $(\mathcal{T}(\mathcal{M}), \circ, \mathrm{Id})$: $\mathcal{T}(\mathcal{M}) \subseteq \text{End}(\mathcal{M})$ the set of semantically admissible transition operators (measurable, continuous a.e. except at separatrices), $\circ$ composition, $\mathrm{Id}$ the identity map. In general non-commutative.

**Elementary / free / controlled transition operators (RFC-NVP32 §4).** $T_u(s) = \mathbb{E}_\xi[F(s, u, \xi)]$ for control input $u$; the free transition $T_0 = T_{u=0}$; a trajectory operator $T_{\mathbf{u}} = T_{u(T-1)} \circ \cdots \circ T_{u(0)}$ over a control sequence.

**Projection, embedding, canonicalization (RFC-NVP32 §5, §8).** The basin projection $\pi_{[s^*]}(s) = \lim_{t\to\infty} T_0^t(s)$; the embedding $\iota_{[s^*]} : \mathcal{B}(s^*) \hookrightarrow \mathcal{M}$ with $\pi_{[s^*]} \circ \iota_{[s^*]} = \mathrm{Id}_{\mathcal{B}(s^*)}$; the canonicalization quotient map $\kappa : \mathcal{M} \to \mathcal{M}/{\sim_{s^*}}$, $\kappa(s) = \Pi(s)$.

**Collapse operator and recovery (RFC-NVP32 §5.3, §7.1).** $\mathfrak{C} : \mathcal{M} \to \mathcal{C}$, $\mathfrak{C}(s) = \lim_{t\to\infty} T_0^t(s)$ for $s$ in the escape boundary $\partial_\tau\mathcal{B}(s^*)$; the recovery operator $R : \mathcal{C} \to \mathcal{B}(s^*_\text{target})$, a controlled partial inverse restoring a collapsed state to the target basin.

**Observation mapping (RFC-NVP32 §6).** $\mathcal{O} : \mathcal{M} \to \mathcal{X}$, mapping a semantic state to an observable feature vector in $\mathcal{X} = \mathbb{R}^d$; factorizes through the Segmented Feature Matrix (RFC-NVS72) and the six-channel score notation (RFC-NVS73).

**Kernel memory regions housing runtime state instances (RFC-SensOS13 §3).** Five regions, each with its own lifetime and mutability rule:

| Region | Lifetime | Mutable? | Role for runtime state |
|---|---|---|---|
| Semantic Stack | one Semantic Task | scratch only | transient per-invocation working values |
| Observation Cache | draft-to-decision window | replace-only | candidate Observation Objects pending Level 0–3 validation |
| Semantic Heap | process/trajectory lifetime | append-only | canonical immutable `NIR_SemanticState` objects |
| Trajectory Memory | trajectory lifetime | append-only | ordered history of state handles + committed Observations for one trajectory |
| Crystallized Memory | indefinite | immutable | HEXT-sealed, read-only historical state |

**Runtime state trajectory as a discretely-sampled curve.** RFC-0040 §2 treats a reasoning process's sequence of internal hidden states $h_t$, extracted under teacher forcing (ground-truth or hallucination text forced as input, internal states observed rather than sampled outputs), as a discretely-sampled curve on a state space, synchronized step-for-step with next-token generation probability. This is the empirical, LLM-side instantiation of "a trajectory on a runtime state space" that the physical ($SE(3)$/CHV) and semantic ($\mathcal{M}$) definitions above formalize abstractly.

> **Private implementation note:** The exact functional form, calibration, and derivation of the per-step trajectory-deformation quantity RFC-0040 computes over this curve (its "Normalized Discrete Trajectory Curvature") are proprietary to NVS-Kernel and are maintained in the private NVS-Kernel documentation. This public specification defines only its interface: a scalar quantity computed per (layer, trajectory-step), non-negative-real-valued, intended to isolate directional change in the state-velocity direction while being insensitive to activation-scale — increasing under sharper directional change of consecutive step-velocities and decreasing (holding direction fixed) as raw step magnitude grows.

## Mathematical assumptions

- $SE(3)$ is treated as a smooth Lie group and $\mathfrak{se}(3)$ as its tangent space at the identity; all physical-state interpolation and filtering is assumed to occur via manifold retraction ($\boxplus/\boxminus$), never flat vector-space linear interpolation.
- Physical control dynamics are assumed affine in control: $\dot{x} = f(x) + g(x)u$.
- Transition operators on $\mathcal{M}$ are assumed measurable with respect to the Borel $\sigma$-algebra and continuous almost everywhere, with discontinuity permitted only at separatrices.
- The Semantic Transition Monoid is assumed non-commutative in general; commutativity is a special case holding only when transitions act on orthogonal semantic dimensions.
- Global invertibility of a transition operator does not hold in general; operators are assumed only *partially* invertible, restricted to the interior of a stable basin away from separatrices and collapse states.
- A discretely-sampled hidden-state sequence $h_t$ is assumed to be a valid, information-preserving discretization of an underlying continuous state trajectory for the purposes of computing per-step deformation quantities; no source in this batch supplies a formal proof of this discretization's fidelity.
- The Kernel memory model assumes single-writer, append-only semantics for the Semantic Heap and Trajectory Memory, and strictly LIFO, single-owner semantics for the Semantic Stack.

## Normative requirements

Physical runtime state (RFC-STS08):

- Implementations MUST represent physical runtime state as an element of $SE(3)$ (or, for rates of change, $\mathfrak{se}(3)$), not as a naive flat vector space, in order to prevent coordinate-representation singularities and drift.
- State interpolation and estimator updates (e.g. Kalman filtering) over physical runtime state MUST use retraction operations ($\boxplus/\boxminus$) defined directly on the Lie manifold.
- A CHV instance's `hybrid_mode` field MUST correspond one-to-one with a mode $q \in \mathcal{Q}$ of the governing Hybrid Automaton.
- A runtime-state-space conformance verifier MUST NOT itself execute the QP-CBF solver or perform Hybrid Automaton dispatch; it MUST restrict itself to asserting that the controller's inputs and outputs conform to the type invariants specified here.

Semantic transition algebra (RFC-NVP32):

- An implementation of a transition operator MUST classify near-separatrix states (within a small implementation-defined tolerance of a basin boundary) using threshold-based classification rather than exact boundary evaluation, since exact evaluation is numerically unstable there.
- Implementations SHOULD periodically re-project long composition chains of transition operators back onto the manifold (using the applicable metric) to bound floating-point drift.
- An `ObservationMapping` implementation SHOULD be stateless (no hidden context) so that observation is reproducible across replay.
- Before a transition operator is deployed in a live pipeline, implementations SHOULD verify projection idempotency ($\pi \circ \pi = \pi$), the fixed-point property of attractors under the free transition, and collapse idempotency ($\mathfrak{C} \circ \mathfrak{C} = \mathfrak{C}$); a failed verification MUST be reported as an Open Integrity Item rather than silently ignored.
- The following algebraic statements are **not** established laws and MUST NOT be relied upon as such by a conformant implementation, pending resolution in the source RFC (see Open Issues below): the asymptotic Observation Invariance law, "Collapse Absorbs Recovery" ($\mathfrak{C} \circ R = \mathrm{Id}_\mathcal{C}$), and Recovery idempotency ($R \circ R = R$).

Kernel memory model (RFC-SensOS13):

- A Semantic Heap-resident runtime state node MUST NOT be handed out as readable to a consumer until an Observation Module has recorded a valid, committed Observation against it.
- A Semantic Heap node MUST NOT be mutated in place; a new runtime state is always a new node produced by applying a registered transition operator.
- A Semantic Stack frame MUST be cleared unconditionally when its owning Semantic Task completes or is preempted, and MUST NOT be persisted or included in any content hash.
- A Crystallized Memory page MUST be immutable; a correction to committed state MUST take the form of a new `observation_id` with the prior one marked superseded, never an in-place edit.

Trajectory extraction as runtime state observation (RFC-0040):

- A hidden-state vector $h_t$ used as a runtime-state-space sample at trajectory step $t$ MUST be extracted in strict synchronization with the token-generation probability for step $t+1$.
- Padding-token artifacts (zero log-probability) MUST be excluded from trajectory analysis.
- Any per-step deformation/instability quantity computed over the trajectory SHOULD be evaluated across multiple intermediate-layer representations, not only the final output layer, since instability precursors may appear in intermediate layers before final-layer uncertainty degrades.
- The exact normalization formula, its numerical-stability constants, and validation thresholds are implementation-private (see Private Implementation Notes) and MUST NOT be inferred or reconstructed from this public specification.

## References

Primary sources (paths relative to `Research/RFC/Archive/`):

- `RFC-STS/RFC-STS08_v1.4.md` — Physical AI & Runtime Type-Layout Verification: $SE(3)/\mathfrak{se}(3)$ Lie theory, QP-CBF structure, Hybrid Automaton tuple, CHV layout.
- `RFC0032_40/RFC-0040-AIIE-Semantic-Geometry-Runtime-Empirical.md` — Semantic Geometry Runtime Empirical Implementation Standard: trajectory extraction protocol, layer-wise observation architecture, validation protocol shape.
- `RFC-NVP/RFC-NVP32_Semantic_State_Transition_Algebra_v0.1.md` — Semantic State Transition Algebra: transition monoid, composition, identity, inverse, projection, embedding, collapse, canonicalization.
- `RFC-SensOS/RFC-SensOS13_Memory_Management_v2.0.md` — Kernel Memory Management: the five Kernel memory regions.

Cited, not independently re-verified in this pass: RFC-STS00, RFC-STS04, RFC-STS10, RFC-NVP01, RFC-NVP02, RFC-NVP03, RFC-NVP05, RFC-NVP07, RFC-NVP08, RFC-NVP09, RFC-NVP11, RFC-NVP12, RFC-NVP13, RFC-NVP18, RFC-NVP20, RFC-NVP22, RFC-NVP31, RFC-NVP33, RFC-NVP34, RFC-SensOS03, RFC-SensOS04, RFC-SensOS05, RFC-SensOS06, RFC-SensOS08, RFC-SensOS11, RFC-SensOS12, RFC-SensOS14, RFC-SensOS16, RFC-SensOS17, RFC-SensOS18, RFC-SensOS19, RFC-NVS20, RFC-NVS71, RFC-NVS72, RFC-NVS73, RFC-NVS74, RFC-0036, RFC-0037, RFC-0038, RFC-0039, RFC-HEKB02, RFC-HEKB03, RFC-HEKB05, RFC-HEKB06.

## Implementation implications

- A physical-layer NVS-Kernel implementation exposing runtime control state MUST lay out that state consistently with the CHV structural fields above (temporal anchor, discrete mode, Lie-group coordinates, uncertainty, target/gradient coordinates, sequence bookkeeping); the exact byte-level packing and alignment strategy is an implementation choice not fixed by this document.
- Because the Semantic Heap's append-only invariant (RFC-SensOS13 §3.1) and the Semantic Transition Monoid's operator-application model (RFC-NVP32 §4–§5) describe the same underlying action — producing a new state from an old one via a registered operator, never in-place mutation — a conformant runtime SHOULD implement "apply transition operator" as "write new Semantic Heap node," with no separate mutation path.
- Because Semantic Heap read access is gated on committed Observation (RFC-SensOS13 §3.1 rule 3), any consumer of a runtime-state-space transition (including a downstream $\pi$, $\kappa$, or $\mathcal{O}$ application) MUST treat an as-yet-unobserved transition result as not-yet-canonical, and MUST NOT branch application logic on it before the corresponding Observation Object reaches `lifecycle: final`.
- An instability/deformation observation over a runtime-state trajectory (RFC-0040-style) is naturally an Observation Module (RFC-SensOS16) producing a draft Observation Object into the Observation Cache (RFC-SensOS13 §3.3) prior to promotion — this document specifies that integration point structurally; it does not specify the module's internal computation, which remains proprietary.
- A physical-layer state-space verifier (RFC-STS08's own stated role) and a semantic-layer transition-algebra property checker (RFC-NVP32 §13.3) are structurally the same kind of component — a conformance/invariant auditor sitting outside the write path — even though they audit different layers; implementers MAY share verification infrastructure between them, though this document does not mandate it.

## Related RFCs

RFC-NVS-0205, NVS-MATH-0001, NVS-MATH-0004, RFC-STS00, RFC-STS04, RFC-STS08, RFC-STS10, RFC-NVP01, RFC-NVP02, RFC-NVP03, RFC-NVP05, RFC-NVP07, RFC-NVP18, RFC-NVP22, RFC-NVP31, RFC-NVP32, RFC-NVP33, RFC-NVP34, RFC-SensOS03, RFC-SensOS04, RFC-SensOS06, RFC-SensOS08, RFC-SensOS11, RFC-SensOS12, RFC-SensOS13, RFC-SensOS14, RFC-SensOS16, RFC-SensOS17, RFC-SensOS18, RFC-SensOS19, RFC-NVS20, RFC-NVS74, RFC-0036, RFC-0037, RFC-0038, RFC-0039, RFC-0040.

## Open Issues / Contradictions

- **No unifying source for a single "runtime state space" object.** RFC-STS08 defines physical runtime state as an $SE(3)$ element; RFC-NVP32 defines semantic runtime state as a point on an abstract manifold $\mathcal{M}$; RFC-SensOS13 defines a Kernel-resident `NIR_SemanticState` object identified only by memory region; RFC-0040 treats an LLM hidden-state vector $h_t$ as a further, distinct notion of state.

  **TODO:** no surviving source material found for a formal mapping or unification between the physical $SE(3)$/CHV state representation and the abstract semantic manifold state $\mathcal{M}$, or between either of these and the empirically-observed LLM hidden-state vector $h_t$ (is $h_t \in \mathcal{M}$, $h_t \in \mathcal{X}$ under the Observation Mapping $\mathcal{O}$, or a separate space entirely?). This document presents all three as coexisting, layer-specific instantiations of "runtime state," each housed by the same Kernel memory model, rather than asserting an unverified formal unification. Do not fabricate the missing bridge.

- **Unresolved algebraic laws inherited from RFC-NVP32.** RFC-NVP32 §9.3–§9.4 itself marks three of the algebraic laws this document cites as unproven: the asymptotic Observation Invariance law ("[AUTHOR REVIEW REQUIRED]"), "Collapse Absorbs Recovery" $\mathfrak{C} \circ R = \mathrm{Id}_\mathcal{C}$ ("[HYPOTHETICAL]"), and Recovery non-idempotency ("[AUTHOR REVIEW REQUIRED]"), corresponding to that RFC's own Open Problems OI-NVP32-02, OI-NVP32-03, and OI-NVP32-04. This document carries these forward as open, not as normative facts (see Normative Requirements above) — treating them as settled would misrepresent the source.

- **Terminology fragmentation across layers, not a mathematical contradiction.** RFC-STS08's `Type<State>`, RFC-NVP32's `SemanticState` (reference-implementation dataclass), and RFC-SensOS13's `NIR_SemanticState` (Kernel object) are three different concrete representations of "a state," scoped to three different layers (Physics, Semantic Logic, Kernel). No source in this batch declares one to be a specialization or embedding of another; this document does not assert such a relationship and flags it as an integration gap for a future RFC (candidate: RFC-NVS-0205, listed as related above) to resolve.

- **RFC-STS08's own internal provenance caveats are inherited, not resolved, by this document.** RFC-STS08 v1.4 notes that RFC-HEKB02 and RFC-HEKB06 (cited for symbol ownership and the joint sensory frame $S_\text{Sync}$ respectively) do not exist in any published or draft form, and that the CONTROL/TYPE-SYSTEM responsibility-boundary observation in that series' own index remains open. Neither gap affects the physical-state, CHV, or Hybrid-Automaton definitions consolidated above, which do not depend on RFC-HEKB02 or RFC-HEKB06 for their own internal correctness (per RFC-STS08's own statement). A public HEKB constitutional document (RFC-NVS-0209, HEKB Memory Model) is now published alongside this batch and may partially close the RFC-HEKB02 gap for future revisions of this document; not incorporated here.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
