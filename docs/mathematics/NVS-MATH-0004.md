---
title: Observation Geometry
id: NVS-MATH-0004
status: Proposed
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
related:
  - RFC-NVS-0205
  - RFC-NVS-0207
  - NVS-MATH-0003
  - NVS-MATH-0005
---

## Abstract

This specification defines **Observation Geometry**: the formal structure NVS-Kernel uses to describe what it means to observe a piece of reality — physical, digital, semantic, internal (model-latent), or synthetic — and to turn that observation into a typed, structured, replayable record. It consolidates two archive sources addressing complementary halves of the same problem: a category-theoretic account of "sensor" as an **Observation Functor** across five reality domains (RFC-STS09), and a set-theoretic/statistical account of **Observer**, **Observable**, **Observation Event**, **Observation Window**, uncertainty, and **replay semantics** (RFC-NVP34). Both sources are largely structural/type-theoretic and are published here; domain-specific tuned feature-extraction algorithms and scoring constants remain proprietary and are redacted.

## Purpose

To give downstream specifications a single, implementation-neutral vocabulary for "what counts as an observation, and what guarantees does it carry" — so that any subsystem producing or consuming observations (physical sensors, log parsers, semantic taggers, model-internal auditors, or simulators) can be reasoned about uniformly, and so that observation records can be verified as reproducible (replayable) without depending on NVS-Kernel's private feature-extraction or scoring algorithms.

## Scope

**In scope:**
- The Observation Functor type signature $\mathcal{S}:\mathcal{X}\to\mathcal{O}$ and the five-domain partition of the Reality Category $\mathcal{X}$.
- The formal definitions of Observer, Observable, Observation Event, Observation Window, Observation History, Observation Invariance, Observation Resolution, and Measurement Uncertainty as given directly in the two named sources.
- Replay semantics: the definition of a faithful replay and the determinism theorem that guarantees it.
- The unified `Sensor<T>`/`Observation<T>` interface shape, as a type-level (not algorithmic) contract.

**Out of scope:**
- The exact feature-extraction algorithms behind specific observables (e.g., noun density, POS entropy, transition intensity, the MIEC segment-boundary statistic) — these are defined in RFC-NVS71/72/73, which are not sources for this document and are not read here.
- The exact numeric calibration constants and per-channel scoring function for the Semantic Score vector, and any drift/hallucination-detection thresholds used in Model-Internal Auditing.
- EXP-1004's specific empirical results, beyond citing them as illustrative provenance for the formalism.

## Dependencies

- **NVS-MATH-0003 (Semantic Metric)** — every Observation Object is structurally bound to a Metric Bundle as defined there (RFC-STS09 §2.1 cites RFC-STS05/RFC-HEKB00 directly).
- **RFC-NVS-0205, RFC-NVS-0207** — consuming specifications.
- **NVS-MATH-0005** — related, not authored here.
- Standard external mathematics: category theory (functors), elementary probability/statistics (standard error, variance), Fourier analysis, cryptographic hash collision-resistance.

## Definitions

### Reality and Observation Categories (RFC-STS09)

The **Reality Category** $\mathcal{X}$ is partitioned into five sub-categories (source: `RFC-STS/RFC-STS09_v1.4.md` §2.1, §3.1):

| Domain | Symbol | Content |
|---|---|---|
| Physical | $\mathcal{X}_{\text{phys}}$ | Continuous physical space-time: photons, acoustic waves, acceleration, voltage, torque |
| Digital | $\mathcal{X}_{\text{dig}}$ | Discrete digital events: network packets, commit logs, database triggers, API streams |
| Semantic | $\mathcal{X}_{\text{sem}}$ | Symbolic/linguistic space: text streams, speech, dialogue transcripts |
| Internal | $\mathcal{X}_{\text{int}}$ | Internal latent coordinate space of neural models: hidden states, attention weights, KV caches, logit margins, loss gradients |
| Synthetic | $\mathcal{X}_{\text{syn}}$ | Simulated/counterfactual projection space: digital twin states, simulated physics, Monte Carlo branches |

A **Sensor** is defined not by hardware but by an **Observation Functor**:

$$\mathcal{S}_i : \mathcal{X}_i \longrightarrow \mathcal{O}, \qquad \mathcal{S}_i(x) = O_x : \mathrm{Type}\langle\mathrm{Observation}\rangle \in \mathrm{Ob}(\mathcal{O})$$

mapping a reality object/event $x$ to a typed, validated Observation Object in the **Observation Category** $\mathcal{O}$ (source: §2.1). This is the series' **Epistemic Sensor Principle**: any mechanism transforming observable reality into a typed Observation Object governed by the type system is a Sensor, regardless of hardware/software implementation (source: §2.2). Every $O_x$ is structurally bound to a Metric Bundle $\mathbf{v}$ as defined in NVS-MATH-0003 (source: §2.1, cross-referencing RFC-STS05/RFC-HEKB00).

Raw sensor output is not accepted directly; it passes through a type-inference/validation pipeline (**STS Compiler pipeline**, source §2.1.1) before entering the Knowledge Category. This document states the existence and ordering of this pipeline as a structural interface; it does not define the compiler's internal validation algorithm.

**Model-Internal Auditing** treats a neural model's own internal computation as a Reality domain ($\mathcal{X}_{\text{int}}$): a Hidden State Sensor wraps a layer's hidden-state tensor $h_L \in \mathbb{R}^d$ as `Observation<Type<HiddenState>>`; a Curvature Sensor observes successive hidden states across generation steps and reports a sectional-curvature-like quantity

$$\kappa = \mathcal{G}(h_{L-1}, h_L, h_{L+1})$$

together with a Shannon entropy $H$ (source §3.2). **Neither source document gives a concrete definition of $\mathcal{G}$** — it is presented in the archive only as an abstract observer-physics function; this specification therefore states only its existence and type ($\mathbb{R}^d\times\mathbb{R}^d\times\mathbb{R}^d \to \mathbb{R}$), not a formula, because none is available to formalize. Internal observations are promoted through a fixed type chain $\mathrm{Type}\langle\mathrm{HiddenState}\rangle \to \mathrm{Type}\langle\mathrm{AttentionPattern}\rangle \to \mathrm{Type}\langle\mathrm{ReasoningStep}\rangle \to \mathrm{Type}\langle\mathrm{Hypothesis}\rangle$, and crossing a threshold on $\kappa$ or $H$ triggers a defined exception in the execution pipeline (source §3.2, item 4).

Every sensor in the ecosystem implements a **unified interface** (source §3.4, reproduced here as a type contract, not an implementation):

```
interface Sensor<T extends STS.CoreType> {
  readonly sensorId: string;
  readonly domain: 'Physical' | 'Digital' | 'Semantic' | 'Internal' | 'Synthetic';
  observe(): Observation<T>;
}
interface Observation<T extends STS.CoreType> {
  readonly id: string;
  readonly type: T;
  readonly timestamp: number;
  readonly value: any;
  readonly metrics: MetricBundle;
}
```

> **Private implementation note:** The exact functional form of the curvature/entropy observation function $\mathcal{G}$ (if and when concretely implemented), and the numeric threshold values $\kappa_{\text{threshold}}$ and $H_{\text{limit}}$ used to gate the Constitutional Exception in Model-Internal Auditing, are proprietary to NVS-Kernel. This public specification defines only their interface and role: a real-valued function of three successive internal states producing a curvature-like scalar and an entropy scalar, gated by thresholds whose existence — not values — is normative.

### Observer, Observable, and Observation Event (RFC-NVP34)

A **semantic observer** is a tuple $\Omega = (\mathcal{I}, \mathcal{W}, \delta, \Sigma)$: an instrument set $\mathcal{I}$, a window-size set $\mathcal{W}$, a sampling schedule $\delta:\mathcal{T}\to\mathcal{T}$, and an observable registry $\Sigma\subseteq\mathcal{X}$ (source: `RFC-NVP/RFC-NVP34_Semantic_Observation_Logic_v0.1.md` §3.1). Two observers are **independent** if their instrument sets share no internal state ($\mathcal{I}_i \cap \mathcal{I}_j = \emptyset$), which is the condition under which their observations may be treated as uncorrelated evidence (§3.1, Definition 3.2).

A **semantic observable** is a measurable function $\chi : \mathcal{M}\times\mathcal{T}\to\mathbb{R}^d$ (§3.2). The source's Standard Observables table includes both textbook-standard formulas and domain-specific engineered features; this document separates them:

- **Standard/publishable** (textbook mathematics applied to the semantic state, no tunable constant): Shannon entropy $\chi_H(s) = -\sum_k p_k \log p_k$; trajectory curvature $\chi_\kappa(t) = \|s''(t)\|/\|s'(t)\|^2$ (the classical curve-curvature formula); a generic distance-to-attractor $\chi_d = d_{\mathcal{M}}(s,s^*)$; class-retention ratio $\chi_m(t) = N_{\text{in-class}}/N$ (a simple counting ratio).
- **Out of scope / not sourced here:** noun density $\chi_{D_n}$, POS entropy $\chi_{H_p}$, and transition intensity $\chi_{I_t}$ are defined in RFC-NVS71, which is not a source for this document; no formula for them is available to formalize, and none is fabricated here.

An **observation event** is a tuple $\varepsilon = (\Omega, \chi, W_L, t_0, t_1, v, \Delta v, \text{hash})$, where $v=\chi(s,t)$ averaged over $[t_0,t_1]$, $\Delta v$ is the measurement uncertainty (below), and `hash` is a canonical (JCS, RFC 8785) hash of the record (§4, Definition 4.1). An event is **valid** iff $\Omega,\chi$ are registered, $t_0<t_1$, $\Delta v \ge 0$, and the hash matches (§4, Definition 4.2). Once valid and hashed, $v$ and $\Delta v$ are **immutable**: any post-hoc modification changes the hash and invalidates the record, by the collision-resistance of the hash function (§4, Theorem 4.1) — a standard cryptographic argument, publishable as-is.

### Observation Window, History, Invariance, Resolution

An **observation window** of size $L$ starting at $t_0$ is $W_L(t_0) = [t_0, t_0+L)\cap\mathcal{T}$ (§5.1); the **window-averaged value** is $\bar\chi(W_L,t_0) = \tfrac1L\sum_{t\in W_L(t_0)}\chi(s(t))$ with standard error $\mathrm{SE}(\bar\chi) = \mathrm{std}(\{\chi(s(t))\})/\sqrt L$ (§5.2) — both standard statistics, publishable. A **segment boundary** is declared where a covariance-based statistic ("MIEC," defined in RFC-NVS71, out of scope here) exceeds a threshold $\theta_{\text{seg}}$ (§5.3, Definition 5.4); this document states only that such a detector exists and partitions a trajectory into non-overlapping segments — the statistic and its threshold are not formalized here.

The **observation history** $\mathcal{H}_t(\Omega)$ is the time-ordered sequence of an observer's events up to $t$ (§6, Definition 6.1); it is **append-only**, **time-ordered**, SHOULD be **non-contradictory**, and is **reproducible** (determined by the trajectory, observer configuration, and random seed) (§6.1 table).

**Observation invariance**: an observable $\chi$ is invariant with respect to a class of representations if it agrees across any two representations of the same underlying semantic-equivalence class (§7, Definition 7.1) — a representation-independence property, standard in kind (analogous to gauge/coordinate invariance), publishable in general form; the specific empirical instance cited in the source (SEOP invariance under text-to-code translation) is provenance only, not part of the formal definition.

**Observation resolution** at window size $L$ is $\rho(\Omega,L) = \tfrac1L\sum_{\chi\in\Sigma_\Omega}\mathrm{Var}(\chi,W_L)^{-1}$ (§8, Definition 8.1); a **Nyquist-Semantic bound** by analogy with signal-processing sampling theory gives a minimum window size $L_{\min}\ge 1/(2\nu)$ needed to detect a transition at frequency $\nu$ (§8, Definition 8.2). Both are standard-form definitions with no tunable constant, publishable.

### Measurement Uncertainty

Total measurement uncertainty combines two terms in quadrature (§9, Definitions 9.1–9.3):

$$\Delta\chi = \sqrt{\Delta_{\text{intr}}^2\chi + \Delta_{\text{model}}^2\chi}, \qquad \Delta_{\text{intr}}\chi = \mathrm{SE}(\bar\chi), \qquad \Delta_{\text{model}}\chi = \|g_{ij}(s)-\delta_{ij}\|\cdot\|\nabla\chi\|$$

$\Delta_{\text{intr}}$ is the ordinary standard error of the window average (standard statistics). $\Delta_{\text{model}}$ measures the error from approximating the true semantic-state geometry with a flat Euclidean embedding, using the same Riemannian metric tensor $g_{ij}$ discussed as standard theory in NVS-MATH-0003; under a Euclidean approximation $g_{ij}=\delta_{ij}$, this term vanishes. Combining observations at multiple window sizes provably reduces total uncertainty below the best single-scale estimate, given conditional independence (§9, Theorem 9.1). None of this section has a NVS-Kernel-specific tunable constant; it is standard measurement theory and is publishable in full.

### Semantic Frequency and Semantic Score

**Semantic frequency** $\nu(t) = \tfrac1{2\pi}\|d\vec n(t)/dt\|$, where $\vec n(t)$ is the unit deviation vector from an attractor state $s^*$ (§10, Definition 10.1–10.2); its discrete Fourier transform $\hat\nu(f)$ identifies dominant oscillation modes (§10, Definition 10.3) — standard signal-processing mathematics, publishable. The precise derivation of the attractor $s^*$ itself is defined elsewhere (RFC-NVP31, not a source for this document) and is out of scope.

**Semantic score** $\sigma(t)\in[0,1]^6$ is a six-dimensional vector over named channels (Security, Economy, Technology, Resource, Ideology, Environment per RFC-NVS70, not a source for this document), with an aggregate score $\bar\sigma(t) = \|\sigma(t)\|_2/\sqrt6$ (§11, Definitions 11.1–11.2) — the aggregation formula (normalized Euclidean norm) is generic and publishable; **the per-channel scoring function that produces $\sigma(t)$'s six components is not defined in either source used for this document** and is treated as an NVS-Kernel-proprietary scoring algorithm consistent with the redaction policy (an "algorithm for how observation events are scored/weighted in practice").

> **Private implementation note:** The exact per-channel computation producing the six components of the Semantic Score vector $\sigma(t)$, and the MIEC segment-boundary statistic with its threshold $\theta_{\text{seg}}$, are proprietary to NVS-Kernel / RFC-NVS70–73 and are maintained in private documentation. This public specification defines only their interface: $\sigma:\mathcal{T}\to[0,1]^6$ with a generic normalized-norm aggregate; a segment-boundary detector of unspecified statistic and threshold that partitions a trajectory into non-overlapping segments.

A hypothesized monotonic relationship between the aggregate score $\bar\sigma(t)$ and the class-retention observable $m(t)$ (§11, Theorem 11.1) is explicitly marked in the source itself as **Tier 2 (Hypothetical)**, pending empirical validation — carried forward here as unproven, not as an established relationship.

### Replay Semantics

A **replay** re-executes the observation pipeline with identical input trajectory, observer configuration, and random seed (§15, Definition 15.1); it is **faithful** if it reproduces bitwise-identical hashes. If the pipeline is deterministic and inputs are identical, replay is provably faithful (§15, Theorem 15.1 — a straightforward induction over deterministic stage functions, standard argument). A **replay bundle** packages the observation history, observer configuration, random seed, and pipeline version, and MUST be sufficient to reproduce the history without the original trajectory source (§15, Definition 15.2). This entire section has no proprietary constants and is publishable in full.

## Mathematical assumptions

1. The semantic state space $\mathcal{M}$ and time index $\mathcal{T}$ are assumed to support well-defined, measurable real-valued functions $\chi$; the archive does not state formal measure-theoretic regularity conditions explicitly.
2. Cryptographic immutability (Theorem 4.1) assumes the collision-resistance of the JCS/SHA-based hash function used; this is a standard cryptographic assumption, not proven within either source.
3. Replay faithfulness (Theorem 15.1) assumes a fully deterministic pipeline with no uncontrolled randomness; the source's own Open Problems list (OI-NVP34-05) flags replay faithfulness under stochastic sampling as unresolved.
4. The model-uncertainty term $\Delta_{\text{model}}\chi$ assumes a well-defined local Riemannian metric $g_{ij}$ exists on $\mathcal{M}$; under the stated Euclidean approximation this reduces to the identity, an assumption of convenience rather than a proven property of the manifold.
5. The five-domain partition of the Reality Category $\mathcal{X}$ (physical/digital/semantic/internal/synthetic) is asserted as exhaustive and mutually distinguishing for NVS-Kernel purposes; the archive does not give a formal proof of exhaustiveness or disjointness.
6. Observer independence (no shared instrument state) is treated as sufficient for uncorrelated evidence; the archive does not formalize a weaker, statistical notion of conditional independence beyond this structural condition.

## Normative requirements

1. Every mechanism in NVS-Kernel that transforms observable reality into a structured record MUST be representable as an Observation Functor instance $\mathcal{S}_i:\mathcal{X}_i\to\mathcal{O}$ for exactly one of the five declared reality domains.
2. Raw sensor output MUST NOT be accepted directly into the Knowledge Category; it MUST pass through type inference/validation before becoming a typed Observation Object.
3. Every Observation Object MUST carry a Metric Bundle as defined in NVS-MATH-0003.
4. Every sensor implementation MUST expose the `Sensor<T>`/`Observation<T>` type contract (or an equivalent typed interface carrying the same fields: identity, type, timestamp, value, metric bundle).
5. An observation event MUST NOT be considered valid unless its observer and observable are registered, its window is non-degenerate ($t_0<t_1$), its uncertainty is non-negative, and its content hash matches the record.
6. Once an observation event's hash has been recorded, its value and uncertainty MUST be treated as immutable; any subsequent change MUST be represented as a new event, not a mutation of the existing one.
7. Total measurement uncertainty reported for a window-averaged observable MUST combine intrinsic (statistical) and model (geometric-approximation) uncertainty; a system that omits the model term MUST document that it assumes a Euclidean approximation.
8. A replay bundle MUST contain sufficient information (history, observer configuration, random seed, pipeline version) to reproduce the observation history without access to the original trajectory source.
9. Observation pipeline stages MUST execute in a fixed order with no back-feeding from later to earlier stages; if a later stage is skipped or fails, the pipeline MUST treat the enclosing window as a single unresolved unit rather than silently partial-committing.
10. A Model-Internal Auditing observation that crosses a curvature or entropy threshold MUST raise a defined exception in the execution pipeline rather than being silently absorbed; the exact threshold values MAY be private, but their existence and the exception contract MUST be part of the public interface.
11. Public documentation and telemetry MUST NOT disclose the exact per-channel Semantic Score scoring function, the MIEC segment-boundary statistic/threshold, or Model-Internal Auditing threshold values, consistent with the proprietary-redaction policy.

## References

- RFC-STS09 v1.4, "Semantic Sensor Framework & Model-Internal Observation Architecture" — `RFC-STS/RFC-STS09_v1.4.md` (Archive) — source of the Observation Functor $\mathcal{S}:\mathcal{X}\to\mathcal{O}$, the five Reality/Sensor domains, the Epistemic Sensor Principle, Model-Internal Auditing, and the unified `Sensor<T>` interface.
- RFC-NVP34 v0.1, "Semantic Observation Logic" — `RFC-NVP/RFC-NVP34_Semantic_Observation_Logic_v0.1.md` (Archive) — source of Observer, Observable, Observation Event, Observation Window, Observation History, Observation Invariance, Observation Resolution, Measurement Uncertainty, Semantic Frequency, Semantic Score, and Replay Semantics.

## Implementation implications

- Any subsystem that produces observations (physical telemetry, log ingestion, semantic tagging, model-internal probes, or simulators) should be describable purely in terms of which Reality domain it maps from and what Observation type it produces — implementers should not need this specification's redacted internals to integrate with it.
- Systems that need reproducibility guarantees (audit, verification, compliance) should rely on the Replay Bundle contract (history + observer config + seed + pipeline version) as the portable unit of reproducibility, not on any specific feature-extraction algorithm.
- Any public-facing telemetry or dashboard exposing Semantic Score or Model-Internal Auditing signals MUST surface only the typed interface (vector shape, threshold-crossed boolean, aggregate norm) and MUST NOT surface the private scoring/threshold constants.
- Because NVS-MATH-0003 leaves the Metric Bundle's own composition/decay formulas private, any Observation Object's `metrics` field should likewise be treated by consumers as an opaque, versioned structure rather than something to be recomputed from public documentation.

## Related RFCs

- RFC-NVS-0205
- RFC-NVS-0207
- NVS-MATH-0003 (Semantic Metric — Observation Objects are bound to its Metric Bundle)
- NVS-MATH-0005

## Open Issues / Contradictions

1. **No formal bridge between the two source formalisms.** RFC-STS09 defines observation category-theoretically as a functor $\mathcal{S}:\mathcal{X}\to\mathcal{O}$; RFC-NVP34 defines it set-theoretically/statistically as a tuple $\Omega=(\mathcal{I},\mathcal{W},\delta,\Sigma)$ acting on a measurable function $\chi$. No archive source states that RFC-NVP34's Observer/Observable formalism is a concrete instance of RFC-STS09's Observation Functor (e.g., specialized to $\mathcal{X}_{\text{sem}}$ or $\mathcal{X}_{\text{int}}$), or vice versa. **TODO:** no surviving source material found unifying these two formalizations of "observation"; this document presents them side by side, not merged, and does not fabricate a bridging mapping.
2. **RFC-STS09's own inherited citation gap.** RFC-STS09's header cites RFC-HEKB06 as part of its Parent System; per the source's own note, RFC-HEKB06 does not exist in any form in the archive. Noted here for completeness, not introduced by this document.
3. **Unproven Score–SEOP relationship.** RFC-NVP34 Theorem 11.1 (aggregate Semantic Score tracking the class-retention observable $m(t)$) is explicitly labeled Tier 2/Hypothetical in the source, pending a joint empirical study. Treat as an open conjecture, not a normative relationship.
4. **MIEC statistic undefined in sourced material.** The segment-boundary detector (§5.3) references a "MIEC covariance statistic" from RFC-NVS71, which is not one of this document's sources. **TODO:** no surviving source material found (within the two sources used here) formally defining MIEC; do not fabricate a definition. Treat the detector as an opaque, private component with a public existence-only contract (Normative Requirement 9 covers its ordering role; its internals remain undefined here).
5. **Semantic Score channel definitions undefined in sourced material.** The six Semantic Score channels are named (via RFC-NVS70) but their per-channel computation is not given in either source used for this document. **TODO:** no surviving source material found for the exact scoring algorithm; not fabricated here, and flagged as likely proprietary in any case per the redaction policy.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
