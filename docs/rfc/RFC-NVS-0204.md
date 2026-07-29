---
title: SensOS Runtime Constitution
status: Proposed
category: Ecosystem constitution and governing principles
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0205
  - RFC-NVS-GOV-0001
---

## Abstract

This document is the ecosystem-level constitution for the SensOS / NVS-Kernel stack: it fixes the non-negotiable layer boundary between Narrative Physics, the SensOS execution substrate, and the Narrative Vector System (NVS) built on top of it, and states what SensOS is — and is not — permitted to own. It is the document every SensOS and NVS specification defers to for scope questions rather than re-deriving its own boundary.

## Purpose

The purpose of this Constitution is to fix, once, the layer boundary and design scope that every SensOS- and NVS-band specification depends on rather than re-argues. Two source charters jointly establish this boundary:

- The **SensOS Architectural Charter** [SensOS01] defines SensOS as the execution substrate sitting between Narrative Physics (NVP) and NVS, and enumerates exactly what SensOS owns and does not own.
- The **NVS System Architecture Charter** [NVS01] defines NVS as the engineering implementation of NVP-compliant systems, distinct from NVP theory itself, and states NVS's own seven-layer internal architecture.

This document consolidates both charters into a single constitutional statement so that later, more concrete specifications (beginning with the companion NVS-Kernel Architecture document, RFC-NVS-0205) can build on a fixed boundary instead of restating one.

## Scope

**In scope:** the layer boundary between Narrative Physics, SensOS, and NVS; the set of responsibilities SensOS owns and does not own; the set of responsibilities NVS owns and does not own; the ecosystem-wide design principles and engineering assumptions that bind every downstream specification; the normative orthogonality between observability and intervention.

**Out of scope:** the internal architecture of the SensOS Kernel (Kernel Executive, subsystem ownership, Observation Driver Framework, memory regions) — normatively owned by RFC-NVS-0205; the mathematics of narrative systems (state space, dynamics, control, basin theory) — owned exclusively by Narrative Physics (NVP) specifications, which this document does not formalize; product- and business-level mapping of RFCs to deployable surfaces — owned by product-architecture documentation, not this Constitution; concrete numeric formulas, calibrated constants, or algorithms of any kind — no such content is formalized here, consistent with this being a governance/constitution-level document.

## Dependencies

Primary sources (read in full, formalized directly into this document):

- **[SensOS01]** — `RFC-SensOS/RFC-SensOS01_Architectural_Charter_v1.0.md`
- **[NVS01]** — `RFC-NVS/RFC-NVS01_v2_4.md`

Cross-reference only, for shared axiom/notation vocabulary — **not** treated as constitutional authority for this document:

- **[STS00]** — `RFC-STS/RFC-STS00_v1.4.md`

## Definitions

- **Narrative Physics (NVP).** The theoretical layer defining the mathematics and physics of narrative systems: state space, observability, dynamics, system identification, control theory, basin theory, alignment theory, integrity theory. NVP answers "what is a narrative system?" [NVS01 §2]. NVP is out of scope for both SensOS and NVS; neither may redefine it.
- **SensOS.** The Semantic Operating System layer between Narrative Physics and NVS. SensOS "defines the execution substrate that compiles, represents, schedules, isolates, secures, and runs semantic state transformations" [SensOS01 §1].
- **NVS (Narrative Vector System / Valley Systems).** The engineering architecture implementing NVP-compliant systems: "how is a narrative system implemented?" [NVS01 §2]. NVS is explicitly "not a theory of narratives" [NVS01 §1] — it is an implementation framework built on SensOS.
- **Compiler-OS band.** The ecosystem-wide responsibility band (per this ecosystem's ratified Layer Model) that SensOS occupies as a whole. Internally, SensOS subdivides this band into a stateless **Compiler** (SensOS's own numbered specifications governing AST-to-NIR lowering, dialect binding, and pass scheduling) and a stateful **Kernel** (the subject of RFC-NVS-0205), reflecting that "compiles a graph" and "keeps a machine alive and accountable while that graph executes" are different responsibilities.
- **Semantic Runtime band.** The ecosystem-wide responsibility band that NVS occupies, consuming Compiler-OS band services rather than embedding them.
- **Applications band.** The ecosystem-wide responsibility band above Semantic Runtime, covering human- and agent-facing products; SensOS explicitly does not own this band [SensOS01 §2].
- **Observation.** The unit of measurement that grounds a semantic state to evidence. Named here as a load-bearing concept because both SensOS and NVS charters treat measurement/observation as foundational infrastructure [SensOS01 §2; NVS01 §Abstract]; its concrete contract is owned by sibling specifications outside this Constitution's scope.

## Mathematical assumptions

This Constitution formalizes no closed-form mathematics; it states only the engineering assumptions NVS makes about the systems it implements [NVS01 §4], restated here in non-formulaic terms:

1. Observables compliant with Narrative Physics exist and can be measured.
2. Measurements taken by one implementation are portable to and interpretable by another.
3. Narrative evidence, once produced, can be preserved rather than only transiently observed.
4. Trust in a system's claims can be independently audited rather than merely asserted.
5. No implementation is architecturally privileged — no specific runtime, model architecture, or deployment platform is required by the ecosystem; implementations are assumed replaceable.
6. Higher-order reasoning services (forecasting, integrity checking, alignment assessment, boundary analysis) are compositionally separable from real-time execution — they consume execution-layer output without needing to replicate execution-layer logic.
7. Observability and control are orthogonal concerns: a component whose job is to observe and report is architecturally distinct from, and must not also be, a component authorized to intervene.

> **Private implementation note:** These are stated as qualitative engineering assumptions, not as testable formulas or thresholds. No calibration, closed-form definition, or numeric criterion for any of the above is specified in or by this document; where a downstream specification needs one, it belongs in that specification's own (and, where applicable, proprietary) mathematical foundation, not in this Constitution.

## Normative requirements

1. Narrative Physics (NVP) MUST remain the exclusive owner of narrative mathematical theory and the physical semantics of state space, topology, dynamics, control, and field theory. SensOS and NVS MUST NOT redefine, fork, or embed this theory [SensOS01 §2; NVS01 §Scope].
2. SensOS MUST own, and MUST be the sole owner of: compiler standards, runtime execution, the core ABI and its intermediate representation, dialect/viewport binding, the extension type registry, the scheduling and thread model, the memory model, the process model and IPC, and the security model [SensOS01 §2].
3. SensOS MUST NOT own product applications, browsers, agents, observability products, or deployment services. These responsibilities belong exclusively to the Semantic Runtime and Applications bands above it [SensOS01 §2].
4. NVS MUST implement NVP-compliant systems and MUST NOT define narrative state spaces, narrative observables, narrative dynamics, narrative basin theory, narrative alignment theory, or narrative integrity theory — these remain NVP's exclusive domain [NVS01 §Scope].
5. Any component whose stated responsibility is observability MUST NOT embed intervention logic. Intervention capability MUST be confined to the runtime/execution layer that this Constitution's companion Kernel Architecture document (RFC-NVS-0205) specifies [NVS01 §4 (E7)].
6. No specific runtime, model architecture, or deployment platform SHALL be required by any ecosystem specification; conforming implementations MUST remain replaceable without loss of conformance [NVS01 §4 (E5)].
7. The ecosystem SHALL remain transport-independent. No single transport protocol (REST, MCP, WebSocket, gRPC, or otherwise) SHALL be treated as canonical [NVS01 §8].
8. Systems SHOULD preserve significant narrative observations, and evidence subsystems SHOULD support replay, audit, verification, and provenance of preserved observations [NVS01 §9].
9. Trust SHALL NOT be derived solely from authority claims. Trust-bearing subsystems SHOULD derive trust from evidence, and SHOULD support identity, signature, calibration, and provenance mechanisms [NVS01 §10].
10. Ecosystem-wide identifiers SHOULD be registry-backed rather than ad hoc [NVS01 §11].
11. Legacy identifiers superseded by a canonical rename (e.g., pre-migration Narrative Physics identifiers superseded by their SensOS equivalents) MAY remain valid aliases, but new documents MUST reference the canonical identifier, never the legacy alias, as normative [SensOS01 §5].

## References

- `RFC-SensOS/RFC-SensOS01_Architectural_Charter_v1.0.md` — SensOS Architectural Charter v1.0 [SensOS01]
- `RFC-NVS/RFC-NVS01_v2_4.md` — NVS System Architecture Charter v2.4 [NVS01]
- `RFC-STS/RFC-STS00_v1.4.md` — Semantic Type System Constitution v1.4 [STS00] (cross-reference only; vocabulary source, not constitutional authority for this document)

## Implementation implications

- A specification proposing new narrative mathematics (state-space definitions, dynamics, control laws, basin/alignment/integrity theory) does not belong in any SensOS or NVS document; it belongs upstream, in Narrative Physics.
- A specification proposing a new SensOS-band responsibility must show it falls within the enumerated ownership list in Normative Requirement 2; anything resembling a product, agent, browser, or deployment surface belongs in the Semantic Runtime or Applications band instead.
- Any component that both observes and intervenes is non-conformant per Normative Requirement 5 and must be split into an observability component and a distinct, explicitly authorized intervention component.
- Implementers MUST NOT hard-code a single transport, runtime, or deployment target as a conformance requirement, per Normative Requirement 6–7.
- Where a downstream specification needs a concrete, calibrated, or closed-form definition of any concept introduced qualitatively here (e.g., what "portable" measurement means numerically), that definition is out of scope for this Constitution and must be sought in the relevant sibling specification.

## Related RFCs

- **RFC-NVS-0205 — NVS-Kernel Architecture.** The companion document that formalizes the concrete Kernel Executive, subsystem ownership, Observation Driver Framework, and memory model within the Compiler-OS/Kernel boundary this Constitution establishes.
- **RFC-NVS-GOV-0001 — Governance.** Owns the amendment procedure, versioning discipline, and deprecation mechanism (a superseded document is marked deprecated in place, never deleted) that governs revisions to this Constitution and its companion documents, consistent with the governance principle stated in [SensOS01 §6].

## Open Issues / Contradictions

**Unreconciled description of how NVS relates architecturally to SensOS.** [SensOS01] §3 states the canonical stack explicitly as `Narrative Physics -> SensOS -> NVS / Valley Systems`, implying that NVS's runtime and execution layer is built on top of, and consumes, SensOS's execution substrate. [NVS01] v2.4, however, describes its own seven-layer internal architecture (Layer 0 Foundation through Layer 6 Ecosystem & Federation) as resting directly on Narrative Physics (RFC-NVP01–18) in its own Layer 0 band, and at no point in its text names SensOS as a dependency, a substrate, or an intermediate layer — its own "Depends On" field lists only Narrative Physics documents. This leaves an unreconciled gap between the two source charters as archived: SensOS01 asserts NVS sits on top of SensOS; NVS01 v2.4's own architecture description does not acknowledge SensOS's existence at all. This Constitution records both positions rather than silently assuming NVS01's internal layering already accounts for a SensOS substrate. Resolving this gap — for example, by amending NVS01's Layer 0 definition to name SensOS explicitly as its execution substrate — is left to the ecosystem's governance process (RFC-NVS-GOV-0001) and is not resolved by this document.

Note that on the specific question of *theory ownership*, the two charters are mutually consistent and require no reconciliation: both agree Narrative Physics exclusively owns state space, observability, dynamics, system identification, control theory, basin theory, alignment theory, and integrity theory [SensOS01 §2; NVS01 §2].

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
