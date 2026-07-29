---
title: HEXT Object ABI
status: Proposed
category: Object model and binary interface
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0207
  - RFC-NVS-0209
---

## Abstract

This specification defines the hardware-neutral object model and runtime Application Binary Interface (ABI) beneath the HEXT/SEL stack: the algebraic **HEXT Observation Space** (a finite, formally defined graph structure in which observation is a first-class primitive), the uniform **HextObject** wire envelope that generalizes observation records to arbitrary downstream artifacts, and the **Execution Algebra** — a semiring projection, sparse-matrix representation, and parallel coend-synthesis calculus — that maps categorical semantics onto physical hardware backends without changing what they mean. Together these fix the binary-level and structural-level agreement that lets independently built, independently deployed HEXT/SEL components interoperate without shared source code, a shared runtime, or a shared language. (Archive: RFC-HEXT/RFC-HEXT000__Architecture_Charter_v2.0_EN.md §1; RFC-HEXT/RFC-HEXT001__Core_Syntax_and_Object_Model_EN.md §1–§2; RFC-HEXT/RFC-HEXT005__Runtime_ABI_EN.md §0.)

## Purpose

The HEXT/SEL architecture rests on a single first principle: observation is the primitive computational entity, and a flowing stream of observations reactively updates the semantic space rather than a static knowledge database. This document exists to specify, at the object-model and execution-ABI layers, the two guarantees that let that principle survive contact with real, heterogeneous hardware: (1) that "what an observation *is*, syntactically" is defined once, independent of any semantic interpretation layered on top of it (Design Principle P1); and (2) that "how semantic computation actually executes" is defined once, independent of any specific compute device's instruction set, floating-point precision, or memory topology (Design Principle P2), and that runtime optimization or quantization never silently changes what a computation means (Design Principle P4). (Archive: RFC-HEXT/RFC-HEXT000__Architecture_Charter_v2.0_EN.md §1–§2; RFC-HEXT/RFC-HEXT001__Core_Syntax_and_Object_Model_EN.md §1.)

## Scope

**In scope:**
- The Algebraic Object Model: the formal 9-tuple definition of a HEXT Observation Space, and the syntactic constraints (id/timestamp/source, payload closure, non-recursion) every observation node must satisfy.
- Concrete syntaxes: the HEXT-JSON schema and the HEXT-Binary stream frame format.
- Well-formedness rules a parser/runtime MUST validate before handing data to semantic interpretation.
- The **HextObject Envelope**: the 6-field wire-level record (`id`, `type`, `timestamp`, `source`, `payload`, `metadata`) that every unit traveling over HEXTstream is wrapped in, and its relationship to the Observation Space.
- The **Execution Algebra**: the semiring projection from the base closed category to an execution-level semiring, sparsity representation rules, and the parallel SpMM (sparse matrix-matrix product) formulation of coend synthesis.
- **Conformance Classes** L (Lite/Edge), S (Standard/Autonomous Node), and E (Enterprise/Datacenter), and their per-class algebraic and precision constraints.
- The **Observational Equivalence** / Error Margin Invariant that bounds how far an approximate (quantized/optimized) computation may diverge from its exact reference.
- The **Processor ABI**: where the Processor Layer sits in the execution stack relative to the Execution Algebra and the hardware backend, and the minimal per-stage contract a conformant Processor Layer implementation must expose.
- The five architectural layers and five design principles (P1–P5) of the governing Architecture Charter, to the extent they bound what this document may normatively own.

**Out of scope:**
- Denotational Semantics / SEL Core (Layer 2 — the enriched category over the base closed category) — not read for this draft; referenced only by name.
- The Semantic Type System, Semantic Signature Registry & Extensibility Protocol, and Semantic Type Registry (Layer 3) — not read for this draft; referenced only by name.
- Operational Semantics — the HEXTstream temporal preorder and reactive Kan-extension mechanics (Layer 4) — not read for this draft, except insofar as RFC-HEXT001 §7 and RFC-HEXT005 §6 reference it to introduce the Processor Pipeline's stage names.
- The internal computation performed by each Processor Pipeline stage (Trajectory, Flow, Hom, Diagram, Rewrite, Controller) — explicitly deferred by the sources themselves to a later RFC (see Open Issues, below).
- Cross-domain package composition and per-signature type catalogues (RFC-HEXT006/007) — referenced only by name in the Architecture Charter's own disambiguation note.
(Archive: RFC-HEXT/RFC-HEXT000__Architecture_Charter_v2.0_EN.md §3, note under §3; RFC-HEXT/RFC-HEXT001__Core_Syntax_and_Object_Model_EN.md §7.2; RFC-HEXT/RFC-HEXT005__Runtime_ABI_EN.md §6.)

## Dependencies

- **RFC-HEXT000 (Architecture Charter v2.0)** — establishes the five design principles (P1–P5) and the five-layer stack; both other sources conform strictly to it. Read in full for this draft.
- **RFC-HEXT001 (Core Syntax and Object Model)** — a product of the HEXT Specification Family, conforms to RFC-HEXT000. Read in full for this draft.
- **RFC-HEXT005 (Runtime ABI)** — conforms to RFC-HEXT000 and states that it "implements the operational requirements of RFC-HEXT004" (Operational Semantics) over physical computing architectures. Read in full for this draft; RFC-HEXT004 itself was not read — its content here is limited to what RFC-HEXT001 §7 and RFC-HEXT005 §6 characterize about it (the Processor Pipeline stage sequence and the Processor Layer's position in the execution stack).
- **RFC-NVS-0207 (Observation ABI)** — sibling document in this canonicalization batch. Related as a neighboring specification in the broader NVS/SensOS ecosystem; not assumed to be the same system as the HEXT Observation Space defined here (see Open Issues, below).
(Archive: front matter of all three read sources.)

## Definitions

| Term | Definition | Source |
|---|---|---|
| **HEXT Observation Space (H)** | A finite algebraic 9-tuple `⟨V, E, Ω, Π, K, A, P, λ_V, λ_E⟩` representing observations, their payload subgraphs, and structural relationships, independent of semantic interpretation. | RFC-HEXT001 §1–§2.1 |
| **Observation node (Ω)** | The special, first-class subset of nodes representing "the fact of having been observed" in the universe. | RFC-HEXT001 §2.1 |
| **Payload assignment mapping (Π)** | For each observation node ω, the function assigning the subgraph of H that observation actually captured. | RFC-HEXT001 §2.1 |
| **HextObject Envelope** | The uniform 6-field wire-level record (`id, type, timestamp, source, payload, metadata`) every unit traveling over HEXTstream is wrapped in; a strict generalization of the observation record. | RFC-HEXT001 §7.1–§7.2 |
| **Processor Layer** | The layer interposed (in Runtime v1.1) between the Execution Algebra and the Hardware Backend, hosting the Trajectory → Flow → Hom → Diagram → Rewrite → Controller pipeline. | RFC-HEXT005 §6.1 |
| **Execution Algebra** | The hardware-neutral intermediate abstraction — an enriched semiring, sparse-matrix representation rules, and parallel SpMM calculus — onto which categorical semantics is deterministically compiled before backend mapping. | RFC-HEXT005 §0 |
| **Base closed category (𝒱)** | The symmetric monoidal closed category instantiated as one of exactly two concrete entities: 𝒱_Cost (truncated tropical/metric) or 𝒱_Prob (multiplicative). | RFC-HEXT000 §4 |
| **Semiring (K)** | The algebraic target `⟨R, ⊕, ⊗_K, 0, 1⟩` of the projection Ψ from the base closed category. | RFC-HEXT005 §1 |
| **Conformance Class (L/S/E)** | One of three tiers (Lite/Edge, Standard/Autonomous Node, Enterprise/Datacenter) a runtime implementation must uphold, scaled to physical resource constraints. | RFC-HEXT005 §4 |
| **Observational Equivalence** | The conformance criterion, defined in the (unread) SEL Core specification and enforced here via the Error Margin Invariant, that every implementation must satisfy within its class's permitted error bound. | RFC-HEXT005 §4, §5 |

## Mathematical assumptions

- **Base closed category instantiation.** The base symmetric monoidal closed category 𝒱 MUST be instantiated as one of exactly two concrete entities:
  - 𝒱_Cost (truncated tropical/metric): objects = `[0, ∞]`, monoidal product `⊗` = addition, internal hom `[−,−]` = `max(0, Y − X)`, unit `I` = `0`.
  - 𝒱_Prob (multiplicative closed): objects = `[0, 1]`, monoidal product `⊗` = multiplication, internal hom `[−,−]` = `min(1, Y/X)`, unit `I` = `1`.
  (Archive: RFC-HEXT/RFC-HEXT000__Architecture_Charter_v2.0_EN.md §4.)
- **Semiring projection (Ψ).** Semantic evaluation values on the base closed category are projected via `Ψ: V → K = ⟨R, ⊕, ⊗_K, 0, 1⟩` onto one of two standard semiring instances: a Probability Semiring (`⊕ = max`, `⊗_K = ×`, `0 = 0.0`, `1 = 1.0`) for 𝒱_Prob, or a Tropical (Min-Plus) Semiring (`⊕ = min`, `⊗_K = +`, `0 = ∞`, `1 = 0.0`) for 𝒱_Cost. (Archive: RFC-HEXT/RFC-HEXT005__Runtime_ABI_EN.md §1, §1.1.)
- **Sparse-Bound Invariant.** Letting *n* be the number of sorts in the governing semantic type signature and *m(t)* the current number of active (non-zero) relations, parallel semiring SpMM execution must guarantee time complexity `O(m(t)/p)` (p = parallel cores) and space complexity `O(m(t))`, laid out in a sparse format (CSR/COO). This assumes density is bounded well below `n²` — i.e., that no node maintains a relation with every other node — which is the assumption "search-free" synthesis (Design Principle P3) depends on. (Archive: RFC-HEXT/RFC-HEXT000__Architecture_Charter_v2.0_EN.md §5, §5.1.)
- **Coend synthesis as SpMM.** Coend composition is defined at the execution-algebra layer as `C_{Z,X} = ⊕_{y∈D}(G_{Z,y} ⊗_K F_{y,X})`, a sparse matrix-matrix product over the semiring K, mapped onto hardware-specific fused-multiply-accumulate or attention-core pipelines. (Archive: RFC-HEXT/RFC-HEXT005__Runtime_ABI_EN.md §3.)
- **Observational Equivalence / Error Margin Invariant.** `max |C_exact(A,B) − C_approx(A,B)| < ε`, where `ε ≤ min{Decision Thresholds in the governing type judgments}`. This bound is normatively shared across the Architecture Charter and the Runtime ABI, and collapses to `ε = 0` (strict bit-exactness) only at Conformance Class E (FP64 reference tier). (Archive: RFC-HEXT/RFC-HEXT000__Architecture_Charter_v2.0_EN.md §7, §7.1; RFC-HEXT/RFC-HEXT005__Runtime_ABI_EN.md §5, §5.1.)

## Normative requirements

1. Every edge `e = (u, v) ∈ E` MUST reference nodes `u, v ∈ V` that actually exist within the same Observation Space; an edge to a nonexistent id MUST be discarded as a Malformed Frame (Dangling Reference Prohibition). (RFC-HEXT001 §6.1)
2. Within a single syntactic context, no two nodes (from `V` or `Ω`) MAY share the same `id` (Unique Identifier Rule). (RFC-HEXT001 §6.2)
3. Except for defined system-management edges, an observation node `ω ∈ Ω` MUST NOT be the target of an edge; an observation MUST always be a source pointing at the world's events (Observation Directional Constraint). (RFC-HEXT001 §6.3)
4. Every observation node `ω ∈ Ω` MUST carry non-empty `id`, `timestamp`, and `source` properties. (RFC-HEXT001 §3.1)
5. The payload subgraph `H_pay = ⟨V_pay, E_pay⟩` pointed to by `Π(ω)` MUST be closed (`E_pay ⊆ E ∩ (V_pay × V_pay)`) and, except for defined meta-tracking relations, MUST NOT contain the observation node itself (`ω ∉ V_pay`). (RFC-HEXT001 §3.2)
6. A HEXT-JSON document MUST conform to the published JSON Schema, with `nodes`, `edges`, and `observations` as required top-level graph blocks. (RFC-HEXT001 §4.1)
7. Every HEXT-Binary stream frame MUST begin with the fixed-length header: 16-bit Magic Bytes (`0x48 0x45`), 16-bit Version, 32-bit Payload Length, 128-bit Observation UUIDv7, and 64-bit Unix Timestamp (ms), followed by MessagePack-encoded Payload Octets. (RFC-HEXT001 §5.1)
8. A HextObject MUST be the 6-field record `⟨id, type, timestamp, source, payload, metadata⟩`; `type = "observation"` is reserved by this specification, and the set of valid `type` values is otherwise open and extended by consuming specifications. (RFC-HEXT001 §7.1)
9. `metadata` on a HextObject MUST NOT be interpreted as altering the semantic content of `payload`; any semantic reading of `metadata` is out of scope for this object model (consistent with Design Principle P1). (RFC-HEXT001 §7.1 field 6)
10. Every observation node `ω ∈ Ω` MUST correspond to exactly one HextObject with `type = "observation"`, with `id`, `timestamp`, `source`, and `payload` mapping directly onto §3.1's properties and `Π(ω)`. (RFC-HEXT001 §7.2)
11. A physical backend MUST instantiate the semiring operations of the standard projection instances (Probability Semiring or Tropical Semiring) as algebraic kernels, per the base closed category the governing signature requires. (RFC-HEXT005 §1.1)
12. Coexistence and relations between different types MUST be physically mapped solely as non-zero elements of a collision-free, offset-based sparse layout; a backend MAY choose CSR, COO, or a hash map as its addressing scheme. (RFC-HEXT005 §2.1)
13. Coend synthesis MUST be executed as search-free, single-pass parallel computation (the SpMM formulation), never as graph search or rule-engine pattern matching. (RFC-HEXT005 §3; RFC-HEXT000 §2 P3)
14. Every implementation, regardless of Conformance Class, MUST satisfy the Observational Equivalence criterion within its class's permitted error bound. (RFC-HEXT005 §4)
15. Class-L (Lite/Edge) implementations MAY limit the base semiring to the tropical semiring only, MAY quantize evaluation values to INT8/INT16 fixed-point, and MAY limit the Kan-extension sliding window to `W = 1`. (RFC-HEXT005 §4.1)
16. Class-S (Standard/Autonomous Node) implementations MUST fully support both the probability and tropical semirings in FP16 or BF16, and MUST fully emulate coend contraction within the specified time window `W`. (RFC-HEXT005 §4.2)
17. Class-E (Enterprise/Datacenter) implementations MUST support full FP64 reference computation and MUST fully emulate dynamic context-scope rewriting for higher-order meta types and the free enriched category induced from multi-domain signature composition. (RFC-HEXT005 §4.3)
18. If an execution backend statically or dynamically detects a risk that its computation error will exceed `ε`, it MUST immediately either raise its dynamic precision or disable the responsible optimization flag, to protect the Error Margin Invariant. (RFC-HEXT005 §5.1; RFC-HEXT000 §7.1)
19. A conformant Processor Layer implementation MUST, for each stage: accept one or more HextObjects whose `type` matches the stage's declared input type(s); emit exactly one HextObject whose `type` matches the stage's declared output type; NOT mutate its input HextObject(s) in place; and SHOULD report which Execution Algebra operations it invoked, and under which Conformance Class, as a `metadata` entry on the output HextObject — never folded into `payload`. (RFC-HEXT005 §6.2)
20. A Processor Layer inherits the Conformance Class of the individual Execution Algebra operations it invokes; conformance classes remain properties of individual operations, not of the Processor Layer as a whole. (RFC-HEXT005 §6.3)

## References

- Archive: `RFC-HEXT/RFC-HEXT000__Architecture_Charter_v2.0_EN.md` — HEXT/SEL Architecture Charter, v2.0 (primary source; read in full).
- Archive: `RFC-HEXT/RFC-HEXT001__Core_Syntax_and_Object_Model_EN.md` — HEXT Core Syntax and Object Model Specification (primary source; read in full).
- Archive: `RFC-HEXT/RFC-HEXT005__Runtime_ABI_EN.md` — HEXT Runtime Application Binary Interface (primary source; read in full).
- RFC-HEXT002 (Denotational Semantics / SEL Core), RFC-HEXT003 (Semantic Type System), RFC-HEXT004 (Operational Semantics), RFC-HEXT006 (Semantic Signature Registry & Extensibility Protocol), RFC-HEXT007 (Semantic Type Registry) — referenced by name within the three sources above; not independently read for this draft, and characterized here only as those sources characterize them.

## Implementation implications

- The `type` namespace on a HextObject is open beyond the reserved `"observation"` value; consuming specifications (e.g., a future Processor Pipeline specification) are expected to register their own `"processor.*"` type strings. Implementers building new HextObject producers/consumers should treat unrecognized `type` values the way any open, extensible discriminator is treated — as "not understood," not as an error — though the sources read for this draft do not spell out that negotiation behavior explicitly for HextObject the way RFC-NVS-0207 does for the Observation ABI's `capability` block; this is a gap, not an inconsistency, and is not asserted as a requirement here.
- Non-observation HextObjects (`type` beginning with `"processor."`) are explicitly not part of the HEXT Observation Space itself and are not subject to the Observation Directional Constraint, since they are not observation nodes. Implementers must not apply Observation-Space well-formedness rules (requirement 3, above) to Processor-Pipeline artifacts.
- Conformance Class selection (L/S/E) is a deployment-time decision driven by target hardware constraints (power, memory, ALU precision); this document does not mandate a default class.
- The Processor Layer's internal per-stage computation (Trajectory, Flow, Hom, Diagram, Rewrite, Controller) is named but not specified here — implementers currently have only the layering contract (requirements 19–20) to build against, pending the RFC that formalizes those stages (see Open Issues, below).

## Related RFCs

- **RFC-NVS-0207** — Observation ABI. Sibling document in this canonicalization batch. Its "HEXT" (via RFC-NVS20) is a different specification from the HEXT Observation Space defined here — see Open Issues.
- **RFC-NVS-0209** — listed as related per this document's front matter; not read for this draft, referenced only as a forward pointer.
- Archive lineage within the HEXT family: RFC-HEXT000 (Architecture Charter, this document's governing charter) → RFC-HEXT001 (Core Syntax and Object Model) → RFC-HEXT002 (SEL Core, not read) → RFC-HEXT003/006/007 (Semantic Type System family, not read) → RFC-HEXT004 (Operational Semantics/HEXTstream, not read) → RFC-HEXT005 (Runtime ABI, this document's other primary source).

## Open Issues / Contradictions

- **"HEXT" naming collision with the sibling Observation ABI document.** RFC-NVS-0207 (this batch's other document) cites RFC-NVS20's "HEXT: Crystallized Knowledge Object and Evidence Container" — an immutable, hash-chained evidence container with `provenance`, `ledger`, and `final_seal` concepts. Nothing in RFC-HEXT000, RFC-HEXT001, or RFC-HEXT005 (the three sources read for *this* document) references RFC-NVS20, Crystallized Knowledge Objects, ledgers, or final seals; conversely, nothing in RFC-NVS74/RFC-NVS70 (the sources behind RFC-NVS-0207) references the HEXT/SEL architecture, Observation Space algebra, or Execution Algebra described here. These read as two independently developed specifications that happen to share the acronym "HEXT," not one system described from two angles. This draft does not assert a relationship between them in either direction. Flagging for a reviewer decision — e.g., renaming one, or establishing and documenting an explicit bridge — before either document leaves Proposed status.
- **Ambiguous forward reference to "RFC-HEXT006+."** RFC-HEXT001 §7.2 and RFC-HEXT005 §6 (the Runtime v1.1 Processor ABI additions) both defer full formalization of Processor Pipeline stage semantics to "RFC-HEXT006+." However, RFC-HEXT000 §3's own disambiguation note states RFC-HEXT006 is chartered as the Semantic Signature Registry & Extensibility Protocol (cross-domain package composition), not a Processor Pipeline specification. Whether "RFC-HEXT006+" in RFC-HEXT001/005 means "RFC-HEXT006 itself, scope permitting" or "some future RFC beyond RFC-HEXT006" is not disambiguated in the three sources read. Flagging rather than guessing which is meant.
- **Runtime v1.1 vs. Runtime v1.0 layering is additive, not contradictory.** RFC-HEXT001 §7 and RFC-HEXT005 §6 are both explicitly marked as additive revisions ("does not alter §1–§6 above" / "does not bypass the Execution Algebra — it orchestrates calls into it"). No inconsistency was found between the two documents' descriptions of where the Processor Layer sits or how it relates to the Execution Algebra; noted here only to record that this was checked, not to flag a problem.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
