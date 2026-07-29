---
title: Observation ABI
status: Proposed
category: Observation protocol and application binary interface
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0205
  - RFC-NVS-0208
  - RFC-NVS-0200
---

## Abstract

This specification defines the **Observation ABI**: the versioned, serialization-independent, runtime-independent contract that governs what an *Observation* is, structurally and semantically, within the NVS Observation & Measurement Plane. It is the interface an Observation Driver (see RFC-NVS-0205, Observation Driver Framework) produces and the Kernel consumes. The contract fixes identity, provenance, versioning, capability negotiation, extensibility, and validation rules for Observation data independently of which wire format, in-memory representation, or Instrument produced it. It formalizes, as runtime-enforceable law, the identity and hashing discipline first laid out conceptually for document metrology in the Semantic Observation Architecture, and generalizes it so that any conforming producer or consumer — not only the reference Instrument — can interoperate. (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §1, §4; RFC-NVS/RFC-NVS70_v1_1_0.md §1, §5.)

## Purpose

The Observation ABI exists to give every producer and consumer of Observation data in the NVS/SensOS architecture one authoritative, checkable answer to "what is an Observation" — independent of any one Instrument's implementation, serialization choice, or versioning scheme. Prior to this contract, an Observation's shape was defined implicitly by whatever the reference Instrument happened to emit; every new consumer either vendored a private copy of those assumptions or forced the reference format to grow ad hoc extensions. This document exists to prevent that coupling failure by construction. (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §1.1–§1.3.)

A **Runtime Contract**, as used here, is a contract that MUST be checkable and enforceable at the moment two components exchange data — not merely by convention or by both sides importing the same library. This is enforced through a canonical schema with an explicit `abi_version`, transport-independent structural validation, and runtime capability declaration. (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §1.3.)

## Scope

**In scope:**
- The Canonical Observation Object: required, recommended, and optional fields, and the twelve guarantees every conforming Observation MUST/SHOULD/MAY satisfy (identity, timestamp, trajectory linkage, metrics, metadata, extension, version, capability, error handling, lifecycle, determinism, non-repudiation).
- The Metric Contract: registry-reference design for individual measurements, required Metric Registry attributes, the Metric envelope schema, and the ABI-native scalar type system.
- ABI versioning: SemVer rules, the version compatibility matrix, capability discovery, runtime negotiation, and deprecation/migration.
- Serialization independence: the Projection model, the Projection matrix (JSON, CBOR, MessagePack, Protocol Buffers, HEXT, FlatBuffers, Apache Arrow), and Projection mapping rules.
- The Extension mechanism: namespace classes (Official, Vendor, Experimental, Reserved, Private) and their stability guarantees.
- The four-level Validation model (structural, schema, semantic, capability) and the structured Error object.
- Security considerations: signature/non-repudiation, tamper detection, replay prevention, provenance sufficiency, and the end-to-end trust chain.

**Out of scope:**
- Concrete Metric name enumeration — deferred to the future Observation Metrics Registry (chartered, not yet drafted).
- The physical persistence schema (table layout) used by the Semantic Memory plane — that is a Layer 6 concern; this ABI only defines what must be reconstructible from persisted data, not how it is stored.
- The internal behavior of Kernel Runtime, Verification Engine, STLE, and DAK — none of these currently has a dedicated RFC; this document binds only their obligation to consume/produce ABI-conformant data.
- The MCP and Layer-Port ABI (RFC-NVS-0200) — a separate, already-live protocol layer; this document does not restate or redefine it, and references it only as a related ABI layer in this ecosystem.
- The Observation Driver Framework (RFC-NVS-0205) itself — this document specifies what a Driver's output must look like, not how a Driver is built or registered.
(Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §1.2, §12, §14 OP-74-01.)

## Dependencies

- **RFC-NVS-0205 (Observation Driver Framework)** — sibling document; the producer side of this contract. Referenced by name only per the authoring brief; not read for this draft.
- **RFC-NVS-0200 (MCP and Layer-Port ABI)** — already-live, immutable protocol layer in this repository. Related as a neighboring ABI layer in the NVS stack; its content is not restated or assumed here.
- **RFC-NVS20 (HEXT: Crystallized Knowledge Object and Evidence Container Specification), v2.0.0** — the Serialization Layer this ABI is explicitly distinguished from (see Definitions, below). Characterized only as described within the two sources read for this draft; not independently read.
- **RFC-NVS-CAL v2.1 (Metrology Infrastructure)** — upstream dependency of both source documents; characterized only as named in their front matter, not independently read.
(Archive: RFC-NVS/RFC-NVS74_v1.0.0.md front matter "Depends On"; RFC-NVS/RFC-NVS70_v1_1_0.md front matter "Depends On".)

## Definitions

| Term | Definition | Source |
|---|---|---|
| **Observation ABI** | The canonical, versioned, serialization-independent semantic contract every producer/consumer of Observation data MUST honor. | RFC-NVS74 §1.1 |
| **Canonical Observation Object** | The abstract, serialization-independent data model this ABI defines; any concrete byte representation of it is a Projection. | RFC-NVS74 §5.1, §8.1 |
| **Projection** | A concrete serialization of the Canonical Observation Object (JSON, CBOR, Protocol Buffers, HEXT, etc.); no Projection is privileged. | RFC-NVS74 §8.1 |
| **Instrument** | A deterministic, opinion-free measurement software module that extracts objective statistical features or semantic coordinates from a document (e.g., the Morphological Observation Engine). | RFC-NVS70 §2 |
| **Window** | A model-independent, immutable physical slice of a document (line, paragraph, etc.). | RFC-NVS70 §2 |
| **Beat** | A point where the gradient of feature statistics reaches a local maximum, marking a physical boundary of contextual "modulation." | RFC-NVS70 §2 |
| **Measurement** | The raw, meaning-free numeric vector an Instrument extracts from a document. | RFC-NVS70 §2 |
| **Segmented Feature Matrix (SFM)** | The immutable data structure joining Window boundaries to their Measurements; RFC-NVS72's reference JSON shape (`nvs-sfm-v1`). | RFC-NVS70 §2, §7; RFC-NVS74 §5.3 |
| **Observation Record** | The realized entity of an SFM: the immutable record that HEXT's `semantic.observation_ref` points to. | RFC-NVS70 §2 |
| **Metric** | A single Registry-referenced measurement value carried inside an Observation; never a bare unlabeled number. | RFC-NVS74 §4, §6 |
| **Metric Registry** | The external, versioned registry (chartered as the future Observation Metrics Registry) that defines Metric name, type, unit, range, and other attributes independent of any one Instrument. | RFC-NVS74 §6.1 |
| **Capability Declaration** | The part of an Observation that lets a consumer determine, without fully parsing the Metric payload, which Registry namespaces and ABI features the Observation requires. | RFC-NVS74 §4, §7.3 |
| **Lifecycle** | The state of an Observation: `draft`, `final`, `superseded`, or `revoked`. | RFC-NVS74 §4, §5.2 |
| **Runtime Contract** | A contract checkable and enforceable at the moment of data exchange, not merely by convention. | RFC-NVS74 §1.3 |

## Mathematical assumptions

- **Determinism (DP-5).** Two conforming producers given identical input, Instrument configuration, and calibration MUST produce byte-identical canonical representations prior to serialization projection. Canonicalization follows RFC 8785 (JSON Canonicalization Scheme), matching the practice already established for SFM hashing. (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §2 DP-5, §4 "Determinism.")
- **Observation identity hash.** `observation_hash = SHA256(document_hash + instrument_chain + calibration + matrix)`, where at ABI level `matrix` is the canonicalized `metrics[]` array. This formula is inherited unchanged from the Semantic Observation Architecture and elevated to ABI-level normative law. (Archive: RFC-NVS/RFC-NVS70_v1_1_0.md §5.2; RFC-NVS/RFC-NVS74_v1.0.0.md §4, §11.2.)
- **Version compatibility algebra.** Given a strict `MAJOR.MINOR.PATCH` version, two parties are compatible if they share the same MAJOR version; a consumer MUST select the highest MAJOR.MINOR version supported by both parties during negotiation, and MUST fail closed if no common MAJOR version exists. (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §7.1, §7.2, §7.4.)
- **Metric value validity.** A Metric's `value` is valid only if it falls within its Registry-declared `[min, max]` Range (or enumerated domain) and matches its declared Type and Unit — a per-Metric domain-membership check performed at Validation Level 2. (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §6.2, §10.3.)

## Normative requirements

The following consolidates RFC-NVS74 §4–§11 into a requirements list. Full detail (including the canonical JSON schema) is in the cited source sections; this document does not repeat the complete field-level schema below and instead states the binding obligations.

1. Every Observation MUST possess a globally unique, immutable `observation_id` in the `gmm://observation/{uuid}` scheme; a change in Instrument version, calibration, or window method SHALL mint a new `observation_id`, never mutate an existing one. (§4 "Identity")
2. Every Observation MUST carry a `timestamp` (ISO 8601 UTC) denoting generation time, independent of any transport- or storage-added timestamp. (§4 "Timestamp")
3. An Observation MAY declare a `trajectory_id`; its absence MUST be interpreted as "trajectory-agnostic," never as an error. (§4 "Trajectory")
4. Every Observation MUST carry one or more Metric entries (§6), each a Registry reference plus a value. (§4 "Metrics")
5. Every Observation MUST carry Provenance and Calibration metadata sufficient to recompute `observation_hash`. (§4 "Metadata"; see Mathematical assumptions, above)
6. An Observation MAY carry vendor, experimental, or reserved Extensions without invalidating base-ABI conformance. (§4 "Extension", §9)
7. Every Observation MUST declare the `abi_version` it was produced against. (§4 "Version", §7)
8. Every Observation MUST be capability-introspectable: a consumer MUST be able to determine required Registry namespaces and ABI features without fully parsing the Metric payload. (§4 "Capability", §7.3–§7.4)
9. A producer that cannot complete an Observation MUST emit a structured Error object (§10.5) rather than a partial or malformed Observation; required fields MUST NOT be silently omitted to signal partiality. (§4 "Error")
10. Every Observation MUST declare a `lifecycle` state (`draft`/`final`/`superseded`/`revoked`); only `final` Observations SHALL be eligible for long-term persistence or Build System consumption. (§4 "Lifecycle")
11. Given identical inputs and Instrument configuration, canonical Observation content MUST be byte-identical prior to serialization projection. (§4 "Determinism"; DP-5)
12. A `final` Observation SHOULD carry a cryptographic `signature` binding `observation_hash` to a signing identity, and MUST carry one before entering long-term storage or Build System consumption. (§4 "Non-repudiation"; §5.2; §11.1)
13. `registry_ref`, `value`, and `unit` are REQUIRED in every Metric envelope; `boundary` is REQUIRED when a Metric is segment-scoped and MAY be omitted for document-scoped Metrics. (§6.3)
14. A MINOR version increment MUST NOT break a consumer written against an earlier MINOR version of the same MAJOR version; a consumer MUST be able to ignore unknown MINOR-introduced fields safely. A PATCH increment MUST be fully compatible in both directions. (§7.1, DP-7)
15. Where two live components negotiate ABI version, they MUST advertise supported `abi_version` ranges and `abi_features`, MUST select the highest mutually supported MAJOR.MINOR, MUST fail closed absent a common MAJOR version, and MUST record the negotiation result for later audit. (§7.4)
16. A Projection MUST preserve every REQUIRED field's name and semantic type verbatim (no format-specific field renaming at the ABI boundary) and MUST be round-trippable to a semantically identical Canonical Observation Object. (§8.1, §8.3)
17. A consumer MUST ignore any Extension whose namespace it does not recognize and MUST NOT treat an unrecognized Vendor/Experimental/Private extension as a validation failure; an unrecognized entry under the Official (`nvs.*`) namespace SHOULD be treated as a staleness signal on the consumer's own ABI version. (§9.2)
18. Conformance MUST be checked through four cumulative Validation levels — structural (Level 0), schema (Level 1), semantic (Level 2), and capability (Level 3) — and a Level 3 failure MUST be treated as a negotiation failure, not silently degraded processing. (§10.1–§10.4)
19. Tamper detection is inherited unchanged from the Semantic Observation Architecture's hash formula; any recomputation mismatch MUST be treated as a Level 2 Validation failure and MUST block persistence and Build System consumption. (§11.2)
20. Because `observation_id` MUST be globally unique, a Registry-level uniqueness check MUST reject two distinct Observation payloads registered under the same `observation_id`. (§11.3)
21. `provenance`, in combination with `calibration.instrument_chain`, MUST be sufficient to answer "which Instrument, at which version, with which settings, produced this value," without external system access. (§11.4)
22. A `final` or `revoked` Observation's content MUST NOT be mutated in place; correction requires minting a new `observation_id` and, where applicable, marking the prior Observation `superseded`. (§11.5, DP-6)

## References

- Archive: `RFC-NVS/RFC-NVS74_v1.0.0.md` — HEXT Observation ABI Specification, v1.0.0 (primary source; read in full).
- Archive: `RFC-NVS/RFC-NVS70_v1_1_0.md` — Semantic Observation Architecture, v1.1.0 (primary source; read in full).
- RFC-NVS20 v2.0.0, RFC-NVS41, RFC-NVS50 v0.3, RFC-NVS60 v0.2, RFC-NVS71 v1.1.1, RFC-NVS72 v1.1.0, RFC-NVS73 v1.2.0, RFC-NVS80 v0.1, RFC-NVS89 v0.2 — referenced within RFC-NVS74's own dependency/reference list; characterized here only as RFC-NVS74 characterizes them, not independently read for this draft.
- RFC 8785 (JSON Canonicalization Scheme) and RFC 8949 (CBOR) — cited normatively within RFC-NVS74 §2 DP-5 and §8.2.

## Implementation implications

- Kernel Runtime, Verification Engine, STLE, and DAK are treated as ABI consumers by this contract's pipeline position, but none currently has a dedicated RFC. Any statement about their specific internal behavior is provisional; only their obligation to consume/produce ABI-conformant data is binding today. (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §14 OP-74-01.)
- The physical persistence layout (a five-table HostingerDB schema: `documents`, `observations`, `observation_segments`, `states`, `universes`) described in the Semantic Observation Architecture is background/reference-architecture context for how Layer 6 persistence has historically been implemented — it is explicitly **not** part of this ABI's normative contract, which governs the Canonical Observation Object's shape, not its storage layout. (Archive: RFC-NVS/RFC-NVS70_v1_1_0.md §6.)
- RFC-NVS72's `nvs-sfm-v1` JSON document is the designated reference JSON Projection, Profile: Morphological. Existing `nvs-sfm-v1` producers MAY continue emitting that exact shape; a conforming ABI v1.0.0 consumer MUST be able to lift it into the Canonical Observation Object without loss of information via the compatibility mapping in RFC-NVS74 §5.3.
- Producers and consumers implementing this ABI MUST implement version negotiation (§7.4) and the four-level Validation model (§10) before exchanging production Observation data; a Level 3 (capability) failure is a negotiation failure, not a degrade-and-continue condition.
- A `final`-lifecycle Observation entering long-term storage or Build System consumption MUST carry a non-repudiation `signature`; implementers should treat this as a hard gate on the persistence/build path, not an optional hardening step.

## Related RFCs

- **RFC-NVS-0205** — Observation Driver Framework. Producer-side sibling; this document defines what a Driver's output must conform to.
- **RFC-NVS-0208** — HEXT Object ABI. A lower-level, hardware-neutral object model and runtime ABI; distinguish carefully from RFC-NVS20's "HEXT" container referenced by this document (see Open Issues, below).
- **RFC-NVS-0200** — MCP and Layer-Port ABI. Already-live, immutable. Referenced here only as a related protocol layer in this ecosystem; not restated.
- Archive lineage: RFC-NVS70 (Architecture) → RFC-NVS71 (Engine) → RFC-NVS72 (Format) → RFC-NVS73 (Rendering) → RFC-NVS74 (this contract's source ABI), with RFC-NVS75–79 (Metrics Registry, HEXT Stream ABI, Transport Protocol, Validation Framework, Conformance Test Suite) chartered as dependent future work, none yet drafted in this repository.

## Open Issues / Contradictions

- **Layer 6/7 table-naming collision (inherited, unresolved).** The Semantic Observation Architecture's `observations`/`states` tables (Layer 7) share names with Layer 6's (RFC-NVS61/62) same-named tables in a different namespace. This ABI's own source (RFC-NVS74) explicitly does not resolve this; it only provides a shared contract both namespaces could converge on if the collision is later resolved by unifying storage. Flagging rather than picking a resolution, per this project's contradiction-handling rule. (Archive: RFC-NVS/RFC-NVS70_v1_1_0.md §8 OP-70-01; RFC-NVS/RFC-NVS74_v1.0.0.md §14 OP-74-02.)
- **Forward-referenced consumers without RFCs.** Kernel Runtime, Verification Engine, STLE, and DAK are named as pipeline stages this ABI's consumers occupy, but none has a dedicated RFC in the archive as of the source's writing. Statements about their behavior in this document are necessarily provisional. (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §14 OP-74-01.)
- **Protocol Buffers field-number registry location undetermined.** §8.2 of the source requires a companion `.proto` field-number registry for the Protocol Buffers Projection but does not specify where it is hosted; deferred to the not-yet-drafted RFC-NVS77 (Observation Transport Protocol). (Archive: RFC-NVS/RFC-NVS74_v1.0.0.md §14 OP-74-03.)
- **Numbering-scheme note (not a contradiction, flagged for reviewer awareness).** The archive sources use the two-segment identifiers `RFC-NVS74`/`RFC-NVS70`; this canonicalized document uses the four-digit `RFC-NVS-0207` scheme already established by the live `RFC-NVS-0200`. No renumbering rationale is asserted here beyond what the authoring brief specified — number assignment for this document was given, not derived by this draft.
- **"HEXT" term collision with the sibling HEXT Object ABI document (RFC-NVS-0208).** RFC-NVS74 uses "HEXT" to mean RFC-NVS20's Crystallized Knowledge Object / Evidence Container. The sources used to draft RFC-NVS-0208 (RFC-HEXT000/001/005) describe an unrelated "High-Efficiency eXchange & Transition" protocol and Semantic Evaluation Layer with no reference to RFC-NVS20, Crystallized Knowledge Objects, ledgers, or final seals. Nothing in the sources read for *this* document references the RFC-HEXT000/001/005 family, and nothing in that family references RFC-NVS20. This draft does not assert a relationship between the two "HEXT" usages; see RFC-NVS-0208's Open Issues for the fuller flag.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
