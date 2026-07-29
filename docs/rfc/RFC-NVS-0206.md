---
title: Runtime Safety Module (Dynamic Abort Kernel) — Public Interface Specification
status: Proposed
category: Runtime safety and intervention protocol (public interface)
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0205
  - RFC-NVS-0207
  - RFC-NVS-GOV-0001
---

## Abstract

This document is a **public interface specification** for the Runtime Safety Module, internally known as the Dynamic Abort Kernel (DAK): it defines the module's role, contractual surfaces, and qualitative safety invariants for external integrators and auditors. The detailed algorithms, tuned functional forms, calibration constants, and classification boundaries that implement these invariants are proprietary to NVS-Kernel and are maintained in private DAK documentation, not reproduced here.

## Purpose

The Runtime Safety Module is a component that attaches to a large language model (LLM) inference runtime and monitors the geometric evolution of the model's internal hidden-state trajectory at each decode step, intervening when the trajectory enters a pathological pattern (Research/RFC/Archive/RFC-NVS-DAK/RFC-NVS-DAK01_v2.1.md §1.1, §1.5). The purpose of this document is to give the public, model-agnostic contract for that module — what it consumes, what it produces, what invariants it guarantees, and what conformance means — so that model-backend integrators, application developers, and independent auditors can build against and reason about it without requiring access to NVS-Kernel's proprietary internal mathematics (Research/RFC/Archive/RFC-NVS-DAK/RFC-NVS-DAK00_v1.1.md §1.1, §3).

This document does not itself define an algorithm, a tuned formula, or a calibration value. Per the governing charter, algorithm and API-level detail belongs to the Reference Standard, not the charter tier (RFC-NVS-DAK00_v1.1.md §13.3); this public specification occupies an analogous role one level further out — it states the module's contract and behavioral guarantees to a public audience without restating the private Reference Standard's tuned internals.

## Scope

**In scope:**
- The module's architectural position relative to an inference runtime and a model backend (RFC-NVS-DAK00_v1.1.md §4.1, §4.3).
- The `HiddenStateAdapter` ABI method signatures used to integrate a new model backend (RFC-NVS-DAK01_v2.1.md §5.2.1).
- The `DAKHook` orchestration contract's public method surface and lifecycle (RFC-NVS-DAK01_v2.1.md §5.1).
- The categories of intervention action the module may take, described by name and qualitative mechanism only (RFC-NVS-DAK01_v2.1.md §3.5, §5.8).
- The qualitative type, domain, and invariants of the observation/confidence/intervention-gain signals that flow through the module (RFC-NVS-DAK01_v2.1.md §8.1–§8.6, redacted per the note in each subsection below).
- The four-level conformance hierarchy (Core / Extended / Enterprise / Certified) and its governing rules (RFC-NVS-DAK00_v1.1.md §10).
- The design principles that bind all implementations (RFC-NVS-DAK00_v1.1.md §11).
- The operational/security contract surface (authentication mechanisms, scopes, error-code categories) to the extent it is already an externally-facing API contract (RFC-NVS-DAK01_v2.1.md §9, §10).

**Out of scope (and see the Private implementation note pattern used throughout this document):**
- The exact functional form of the adaptive intervention-gain computation.
- The exact functional form of the curvature/risk signal.
- The exact attractor classification taxonomy, its category count, category names/identifiers, scoring functions, or decision boundaries.
- Any frozen numerical calibration constant (window lengths, warm-up lengths, scaling factors, thresholds, capacity limits, temperature values, or similar tuned parameters).
- The exact update equations used by any graduated intervention action.

All of the above remain proprietary to NVS-Kernel and are maintained in private DAK documentation.

## Dependencies

- **RFC-NVS-DAK00 v1.1** (Architecture Charter) — source of the design philosophy, product architecture, conformance framework, and design principles this document publicly restates at interface level (RFC-NVS-DAK00_v1.1.md).
- **RFC-NVS-DAK01 v2.1** (Reference Standard) — the private baseline kernel specification this public document is derived from; it is the authoritative source for the proprietary internals this document redacts (RFC-NVS-DAK01_v2.1.md).
- **RFC-NVS01** (NVS Platform Architecture) — defines the platform layering within which the Runtime Safety Module is deployed (cited by RFC-NVS-DAK00_v1.1.md §4.1 and RFC-NVS-DAK01_v2.1.md §2.1; not itself read for this document).
- **RFC-NVP18 / RFC-NVP20** — the mathematical foundation (trajectory geometry, attractor classification theory) that the private Reference Standard's algorithms are grounded in; DAK-series documents reference but do not reproduce this mathematics (RFC-NVS-DAK00_v1.1.md §9.2), and neither does this public document.
- **RFC-STS04 v1.4** (STS Algebraic Constraints & Safety Invariants Specification) — cited informatively, for standard control-theory vocabulary only (Lyapunov stability, Control Barrier Functions). RFC-STS04 formalizes a different system (physical/robotic trajectory safety within the SensOS Semantic Type System); it is not a functional dependency of the Runtime Safety Module and no claim of formal correspondence is made here — see the Mathematical assumptions section.
- **RFC 2119 / RFC 8174** — normative keyword definitions.

## Definitions

| Term | Definition |
|---|---|
| Hidden State Trajectory | The ordered sequence of hidden-state vectors produced by an LLM backend across decode steps, treated as points in a real vector space independent of any specific model architecture (RFC-NVS-DAK01_v2.1.md §1.5, §2.2). |
| Trajectory Window | A bounded, sliding buffer of the most recent hidden-state vectors, used as the unit of observation rather than a single step in isolation (RFC-NVS-DAK01_v2.1.md §3.3). Its exact default length is a tuned parameter and is not published here (see Private implementation note under Mathematical assumptions). |
| HiddenStateAdapter | The abstract contract that decouples the Runtime Safety Module from any specific LLM backend, exposing a uniform lifecycle for extracting hidden-state vectors (RFC-NVS-DAK01_v2.1.md §5.2, §3.1). |
| DAKHook | The orchestrating entry point that wires observation, classification, gain computation, intervention, and audit logging into a single per-decode-step call (RFC-NVS-DAK01_v2.1.md §5.1). |
| Observation Layer | The part of the pipeline that derives geometric features from a Trajectory Window and produces a classification result. Its internal feature set and scoring functions are proprietary (RFC-NVS-DAK01_v2.1.md §5.4, §7). |
| Attractor Category | One of a closed, private taxonomy of degenerate-generation patterns (plus a nominal, non-pathological category) that the Observation Layer may classify a Trajectory Window into. The taxonomy's category count, names, and classification boundaries are proprietary and are not published in this document (RFC-NVS-DAK01_v2.1.md §7.1; see redaction note below). |
| Intervention Gain | A scalar signal produced by the module that quantifies the urgency/confidence of an intervention. Its type and invariants are public (see Mathematical assumptions); its exact derivation is proprietary (RFC-NVS-DAK01_v2.1.md §8.1). |
| Domain Policy | An operator-supplied, named configuration that scopes intervention behavior to a deployment context (e.g. creative, medical, finance, government, defense) (RFC-NVS-DAK01_v2.1.md §5.7). |
| Intervention Action | One of a fixed, small vocabulary of actions the module may apply to a hidden-state vector or to the generation session: a pass-through action, one or more graduated corrective actions, and a hard halt action (RFC-NVS-DAK01_v2.1.md §3.5, §5.8). The exact update mechanics of the corrective actions are proprietary. |
| Conformance Level | One of four cumulative levels (Core, Extended, Enterprise, Certified) describing the completeness of a Runtime Safety Module implementation against this specification's parent Reference Standard (RFC-NVS-DAK00_v1.1.md §10). |

## Mathematical assumptions

This section states only the public type, domain, and qualitative behavior of the module's key internal signals. It formalizes no algorithm.

1. **Trajectory representability.** A hidden-state trajectory is assumed to be representable as an ordered sequence of vectors in a fixed-dimensional real vector space, and this representation is assumed to be sufficient — independent of which model architecture produced it — for the module to derive its observation signals (RFC-NVS-DAK01_v2.1.md §2.2, §3.1, §3.4).

2. **Instability signal.** The module is assumed to derive, from a Trajectory Window, a scalar signal reflecting the local geometric instability of the trajectory (informally, how sharply and unpredictably the trajectory is turning). This signal is assumed to be non-negative.
   > **Private implementation note:** The exact functional form, calibration, and derivation of this quantity are proprietary to NVS-Kernel and are maintained in the private NVS-Kernel documentation. This public specification defines only its interface: a non-negative scalar derived from recent trajectory geometry.

3. **Classification confidence.** The Observation Layer's classification of a Trajectory Window against the private Attractor Category taxonomy is assumed to yield a confidence value in the closed interval [0, 1], where higher values indicate greater classifier certainty.
   > **Private implementation note:** The exact classification procedure, category taxonomy, category boundaries, and scoring functions are proprietary to NVS-Kernel and are maintained in the private NVS-Kernel documentation. This public specification defines only the interface: a probability-like confidence scalar in [0, 1] and a category label drawn from a closed, private taxonomy.

4. **Intervention gain.** The module is assumed to combine (a) the instability signal, (b) the classification confidence, and (c) an operator-configured, per-category Domain Policy weight in [0, 1] into a single scalar Intervention Gain value in the bounded, half-open range [0, 1) — that is, the gain MUST NOT reach or exceed its upper bound.
   > **Private implementation note:** The exact functional form combining these three inputs, and the exact per-input transfer function (including any saturation or scaling behavior), are proprietary to NVS-Kernel and are maintained in the private NVS-Kernel documentation. This public specification defines only the interface and the boundedness invariant: a scalar in [0, 1).

5. **Monotonicity invariants (qualitative, not formulas).** The Intervention Gain MUST behave monotonically with respect to each of its inputs, holding the others fixed: a higher instability signal MUST NOT correspond to a lower gain; a higher classification confidence MUST NOT correspond to a lower gain; and a higher Domain Policy weight for the classified category MUST NOT correspond to a lower gain. These are directional, qualitative requirements only — no rate, curve shape, or coefficient is specified here.

6. **Tiered response monotonicity.** The module's selection among Intervention Actions is assumed to be driven by comparing the Intervention Gain against Domain Policy-supplied thresholds, producing a tiered response (a pass-through tier, one or more graduated-correction tiers, and a hard-halt tier). The severity of the selected action MUST be non-decreasing as the Intervention Gain increases.
   > **Private implementation note:** The exact threshold values, their number, and the exact decision procedure are proprietary to NVS-Kernel and are operator-configurable per Domain Policy in the private Reference Standard. This public specification defines only the qualitative tiering invariant.

7. **Standard control-theory vocabulary (informative only).** RFC-STS04 (Research/RFC/Archive/RFC-STS/RFC-STS04_v1.4.md §3.1.2–§3.1.3) formally defines Lyapunov stability (a positive-definite potential whose value is non-increasing along system trajectories) and Control Barrier Functions (a safety-envelope construction ensuring a controller can always keep a system within a safe set) as standard control-theory constructs, for a different system (physical/robotic trajectory safety within the SensOS Semantic Type System). Those definitions are not proprietary and are cited here only as standard vocabulary that a reader may find useful when reasoning informally about why a bounded, saturating intervention-gain response is a reasonable design pattern for a safety-critical control signal. This document makes **no claim** that the Runtime Safety Module's Intervention Gain is formally a Lyapunov function or a Control Barrier Function in the RFC-STS04 sense — no such correspondence appears in the DAK-series sources reviewed for this document, and asserting one would not be a formalization of an existing source, so none is made.

## Normative requirements

The following requirements restate, at public-interface level, the design principles and contracts that RFC-NVS-DAK00 and RFC-NVS-DAK01 already establish as governing every implementation of this module.

1. An implementation MUST perform its observation and intervention decision within the model's per-token decode loop; it MUST NOT be implemented as a pre-generation (prompt-only) filter or a post-generation (output-only) classifier (RFC-NVS-DAK00_v1.1.md §3.1).

2. An implementation MUST NOT assume a specific model architecture, tokenizer, or serving framework. All model integration MUST occur exclusively through the `HiddenStateAdapter` contract; a new model backend MUST be supportable by writing a new adapter, not by modifying the module itself (RFC-NVS-DAK00_v1.1.md §3.2, §11.1; RFC-NVS-DAK01_v2.1.md §3.1).

3. Given the same trajectory input and the same Domain Policy, an implementation MUST produce the same intervention decision on every run. Any use of randomization within a graduated intervention action MUST use a seed that is deterministically derived from the trajectory state, never from wall-clock time or OS entropy (RFC-NVS-DAK00_v1.1.md §3.3, §11.9; RFC-NVS-DAK01_v2.1.md §3.6).

4. An implementation MUST produce one structured, append-only audit log entry per decode step, including (at minimum) a step index, a timestamp, the classified category label, the classification confidence, the Intervention Gain value, the selected Intervention Action, the active Domain Policy name, and a content hash of the observed trajectory window sufficient to support independent verification that the log was not fabricated after the fact. No step may be silently omitted (RFC-NVS-DAK00_v1.1.md §3.4, §11.5; RFC-NVS-DAK01_v2.1.md §3.7, §5.9).

5. Every recorded generation session MUST be replayable: given the recorded trajectory and the Domain Policy that was active at each step, an implementation MUST be able to reproduce the original sequence of intervention decisions, and MUST support substituting an alternative Domain Policy to evaluate a counterfactual (RFC-NVS-DAK00_v1.1.md §3.4, §11.4; RFC-NVS-DAK01_v2.1.md §3.6).

6. All intervention behavior (thresholds, per-category weights, and soft-action selection) MUST be defined by a named, versioned Domain Policy, hot-swappable by an authorized operator without restarting the service. No intervention threshold or weight MUST be hardcoded in the module outside of a documented, non-configurable safety floor (RFC-NVS-DAK00_v1.1.md §3.5, §11.6; RFC-NVS-DAK01_v2.1.md §5.7).

7. The Intervention Gain MUST be a bounded scalar in [0, 1) for all valid inputs; an implementation MUST NOT allow it to reach or exceed its upper bound (RFC-NVS-DAK01_v2.1.md §3.2, §8.5).

8. An implementation MUST support, at minimum, a pass-through action, at least one graduated corrective action, and a hard-halt action that terminates the generation session and MUST cause the calling runtime to stop producing further tokens (RFC-NVS-DAK01_v2.1.md §3.5, §5.8).

9. On an internal observation/classification failure, an implementation MUST log the failure and default to the pass-through action for that step, allowing generation to continue; it MUST NOT silently discontinue the audit trail. On a failure to extract a hidden state from the model backend, an implementation MUST treat this as a hard-halt condition. On a failure to load a Domain Policy at startup, an implementation MUST refuse to start (RFC-NVS-DAK00_v1.1.md §11.2).

10. No request to an operational endpoint of an implementation MAY be trusted by default. Every request MUST present verifiable credentials, and every credential MUST be verified on every request; access MUST be scoped per endpoint (RFC-NVS-DAK00_v1.1.md §11.3; RFC-NVS-DAK01_v2.1.md §10.2–§10.4). An implementation MUST refuse to start if a security-critical secret is left at its documented placeholder/default value (RFC-NVS-DAK01_v2.1.md §10.2, §10.4).

11. An implementation MUST be deployable on any OCI-compliant container runtime without modification, MUST expose a health/readiness endpoint, MUST support configuration via environment variables, and MUST handle graceful shutdown (completing in-flight work and flushing the audit log) before terminating (RFC-NVS-DAK00_v1.1.md §11.7).

12. A single module instance MUST NOT be shared across concurrent generation sessions; each session MUST own an independent instance to avoid trajectory-state corruption and non-deterministic decisions (RFC-NVS-DAK01_v2.1.md §5.1.7; RFC-NVS-DAK00_v1.1.md §11.8).

13. A conformance claim MUST reference one of the four defined, cumulative levels — Core, Extended, Enterprise, or Certified — and MUST reference the specific Reference Standard version claimed against. A claim above Core MUST be substantiated against the private reference test suite. A Certified claim MUST NOT be self-assessed and REQUIRES independent validation (RFC-NVS-DAK00_v1.1.md §10.2–§10.3).

## References

**Normative:**
- Research/RFC/Archive/RFC-NVS-DAK/RFC-NVS-DAK00_v1.1.md — Architecture Charter (design philosophy, product architecture, conformance framework, design principles).
- Research/RFC/Archive/RFC-NVS-DAK/RFC-NVS-DAK01_v2.1.md — Reference Standard (private baseline; source of the interface signatures and invariants restated here).
- RFC 2119 — Key words for use in RFCs to Indicate Requirement Levels.
- RFC 8174 — Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words.

**Informative:**
- Research/RFC/Archive/RFC-NVS-DAK/RFC_SERIES_INDEX.md — series governance, document registry, and the private "Key Design Constants" table this document deliberately does not reproduce.
- Research/RFC/Archive/RFC-STS/RFC-STS04_v1.4.md — standard control-theory vocabulary (Lyapunov stability, Control Barrier Functions), cited informatively only; formalizes a different system.
- RFC-NVS01, RFC-NVP18, RFC-NVP20 — cited by the sources above as the platform architecture and mathematical foundation this module depends on; not independently read for this document.

## Implementation implications

- **Model backend integrators** need only implement the `HiddenStateAdapter` contract's method surface (initialize / before-generate / on-generation-step / after-generate / shutdown, per RFC-NVS-DAK01_v2.1.md §5.2.1) to add a new backend. No access to the private classification or gain algorithms is required or granted by this document.
- **Application/platform integrators** consuming a deployed Runtime Safety Module can rely on the audit-log invariants (Normative requirement 4) and replay guarantee (Normative requirement 5) for incident forensics without needing to know the internal classification math — the log's content hash is sufficient for independent verification of non-tampering.
- **Domain Policy authors** configure per-category thresholds and weights without needing the internal gain formula; this document's monotonicity invariants (Mathematical assumptions §5–§6) are sufficient to reason about how a policy change will shift behavior directionally, even though the private Reference Standard governs the exact magnitude of that shift.
- **Auditors / certifiers** evaluating a Certified conformance claim will need access to the private Reference Standard and its reference test suite; this public document is not sufficient by itself to certify an implementation, by design (Normative requirement 13).
- **Conformance claims** made against this public document alone are not meaningful; conformance is always claimed against a specific version of the private Reference Standard (RFC-NVS-DAK01), with this document serving only as the public-facing description of that standard's externally visible contract.

## Related RFCs

- **RFC-NVS-0205 — NVS-Kernel Architecture.** Sibling Batch-1 document defining the Kernel Executive, subsystem ownership, and the Observation Driver Framework that produces the signals this module consumes.
- **RFC-NVS-0207 — Observation ABI.** Sibling Batch-1 document defining the canonical shape of Observation objects; the instability/confidence signals referenced in this document's Mathematical assumptions are derived from Observation-ABI-conformant data.
- **RFC-NVS-GOV-0001 — SensOS Ecosystem Master Governance Specification.** Already-live governance document; not restated here.

## Open Issues / Contradictions

No direct factual contradictions were found among RFC-NVS-DAK00_v1.1.md, RFC-NVS-DAK01_v2.1.md, RFC_SERIES_INDEX.md, and RFC-STS04_v1.4.md within the scope reviewed for this document.

One tension worth flagging for reviewers: RFC_SERIES_INDEX.md §6 (Maturity Summary) labels RFC-NVS-DAK01 as a whole at "Reference Implementation" maturity, and RFC_SERIES_INDEX.md's own listed "Frozen items (MUST NOT change)" for DAK01 include the adaptive gain formula and the F17 taxonomy without a maturity qualifier at that summary level. However, RFC-NVS-DAK01_v2.1.md's own body labels the adaptive gain formula's Confidence and Policy Weight terms, all F17 scorer functions, and the taxonomy itself as **[Experimental]** — "formula defined; optimal parameterization under evaluation" (RFC-NVS-DAK01_v2.1.md §5.6, §5.4, §7.1, §8.1) — with only the curvature-based Risk term individually marked [Validated] (RFC-NVS-DAK01_v2.1.md §8.2). This document's qualitative invariants (Mathematical assumptions §2–§6) should therefore be read as describing the module's *intended* design behavior rather than an independently validated production guarantee; this public specification does not resolve that maturity tension, it only surfaces it so downstream readers do not over-attribute confidence to the module's internal algorithms based on the document-level "Reference Implementation" label alone.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
