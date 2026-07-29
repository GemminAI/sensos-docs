---
title: HEKB Memory Model
status: Proposed
category: Knowledge and memory model
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0205
  - RFC-NVS-0208
---

## Abstract

This specification defines the **HEKB (HEXT Enriched Knowledge Base) Memory Model** — the SensOS/NVS-Kernel ecosystem's structural account of how knowledge is organized, evidenced, and consolidated once it leaves active state estimation. It consolidates three source documents: a constitutional layer establishing nine invariant principles and four domain categories (Knowledge, Reality/Dynamics, Intent, Normative); a memory-architecture layer describing an ordered, five-stage hierarchy of increasing abstraction and decreasing volatility; and a mathematics layer collecting the standard category-theoretic vocabulary (Category, Functor, Adjunction, Topos, and related constructs) that the applied HEKB sub-specifications build on. This document states structural guarantees and interfaces only. It does not define tuned numeric parameters, concrete consolidation algorithms, or runtime execution semantics — those remain private implementation content or the sovereign content of other RFCs, as noted throughout.

## Purpose

To give implementers and integrators outside the private NVS-Kernel documentation a public, structurally complete account of:

1. What invariant properties every HEKB-conformant knowledge object and system must satisfy (constitutional principles).
2. How HEKB organizes memory into ordered layers, and what distinguishes those layers structurally (memory architecture).
3. What shared mathematical vocabulary the HEKB series' applied specifications (Reality, Intent, Normative, Physical Knowledge Mapping domains) use, stated once as standard category theory rather than repeated in each applied document.

This document is the entry point for readers who need to understand *what HEKB structurally guarantees* without needing access to tuned operational parameters or execution-level detail.

## Scope

**In scope:**
- The nine constitutional principles governing Knowledge, Memory, Ontology, and Semantic Consolidation.
- The four domain categories HEKB is the constitutional home for: Knowledge ($\mathcal{K}$), Reality/Dynamics ($\mathcal{R}$), Intent ($\mathcal{I}$), Normative ($\mathcal{N}$) — named and bounded here, not mathematically defined here.
- The five-layer memory hierarchy (Observation, Working Memory, Episodic Memory, Semantic Memory, Procedural Knowledge) and each layer's qualitative role, characteristics, and retention-policy *shape* (not its tuned parameters).
- The general category-theoretic constructs (Category, Object, Morphism, Diagram, Cone/Cocone, Functor, Natural Transformation, Universal Property, Limit, Colimit, Pullback, Pushout, Adjunction, Monoidal Category, Enriched Category, Yoneda Lemma, Grothendieck Fibration, Cartesian Closed Category, Subobject Classifier, Topos) as standard mathematics, stated to establish shared vocabulary.

**Out of scope:**
- The Semantic Type Lattice and Type Promotion Functor mathematics ($\Pi_{01}, \Pi_{12}, \Pi_{23}, \Pi_{34}$) — owned elsewhere and cited, not restated.
- Continuous state estimation and the Continuous Hybrid Vector (CHV) — explicitly not a HEKB concern.
- Runtime control execution and the compiled policy/control ABI.
- Physical schema, storage backend selection detail, and multi-database consistency protocols.
- Tuned numeric retention parameters, compression ratios, and consolidation/promotion trigger thresholds — redacted as proprietary, see Normative requirements and Implementation implications below.
- The applied, domain-specific instantiations of the mathematical constructs (e.g., a specific adjunction between two named categories) — owned by their respective applied RFCs, not this document.

## Dependencies

- **RFC-0000** (Ecosystem Constitution) — governs series/number registries and amendment procedure; the source material describes this constitution's charter without itself being fully drafted in the archive.
- **RFC-STS00** (Semantic Type Constitution) — source of the Semantic Type Lattice, the Observation Functor boundary, and the Canonical Notation Registry that assigns primary ownership of the $\mathcal{K}$, $\mathcal{R}$, $\mathcal{I}$, $\mathcal{N}$ symbols; HEKB depends on but does not redefine these.
- **RFC-STS06** (Type Promotion & Consolidation) — owns the layer-promotion functor mathematics and algebraic promotion triggers; cited by the memory-architecture layer of this document, not restated.
- **RFC-STS10** (general mathematical foundations for the STS series) — forward-referenced repeatedly by the mathematics layer of this document as a reserved, not-yet-published identifier; see Open Issues.
- **RFC-HEKB06** and **RFC-HEKB09** — reserved identifiers within the same series, not yet authored; see Open Issues.

## Definitions

- **Knowledge Category ($\mathcal{K}$)** — the domain category HEKB is the constitutional home for; holds objects once they leave active estimation.
- **Reality/Dynamics Category ($\mathcal{R}$)**, **Intent Category ($\mathcal{I}$)**, **Normative Category ($\mathcal{N}$)** — the three sibling domain categories named by the constitutional layer and owned by their respective applied sub-specifications; not mathematically defined in this document.
- **Provenance** — a traceable record of the observations, episodes, or prior knowledge objects that justified an object's promotion into a memory layer; a structural requirement for validity, not optional metadata.
- **Consolidation** — the explicit, auditable process by which lower-layer evidence is synthesized into higher-layer generalizations; additive to the knowledge graph's history, never destructive of it.
- **Semantic Compression** — the meaning-preserving reduction that occurs during consolidation (many episodes into one rule, many observations into one concept).
- **Monotonic Promotion** — the property that once an object is promoted to a layer, that promotion is not silently reversed; any demotion must itself be an evidenced, auditable act.
- **Memory Layer** — one of five ordered stages of abstraction (Observation, Working Memory, Episodic Memory, Semantic Memory, Procedural Knowledge) that a knowledge object may occupy.
- **Consolidation boundary** — the transition between two adjacent memory layers; an object crossing it is re-evidenced and re-typed, not merely relocated.
- **Category, Object, Morphism** — the foundational algebraic structure of category theory: a category consists of objects and, for each pair, a set of structure-preserving morphisms between them, closed under an associative, identity-respecting composition.
- **Functor** — a structure-preserving mapping between two categories, carrying objects to objects and morphisms to morphisms while preserving identities and composition.
- **Natural Transformation** — a uniform family of morphisms relating two functors, defined the same way at every object simultaneously.
- **Adjunction** — a canonical, optimal pair of functors translating between two categories in both directions, characterized by a natural isomorphism between hom-sets (or, equivalently, a unit/counit pair satisfying the triangle identities).
- **Pullback / Pushout** — the limit of a cospan / the colimit of a span, respectively; the categorical constructions for enforcing consistency between two maps into a shared target, or for gluing two structures along a shared sub-part.
- **Grothendieck Fibration** — a functor whose fibers vary coherently and canonically as the base object varies, via unique cartesian lifts.
- **Topos / Subobject Classifier** — a category with finite limits, cartesian closure, and an object $\Omega$ that represents "being a sub-object of $X$" as an internal morphism $X \to \Omega$, giving the category an internal logic.

## Mathematical assumptions

The HEKB series' applied specifications (Reality, Intent, Normative, and Physical Knowledge Mapping domains) instantiate a shared, standard body of category theory. This document states that shared body once, as textbook mathematics, so that no applied document needs to re-derive it. Consistent with standard treatments (Mac Lane, *Categories for the Working Mathematician*; Mac Lane & Moerdijk, *Sheaves in Geometry and Logic*), the following constructs are assumed and used elsewhere in the ecosystem, each with a **Definition**, a governing **Theorem**, and a **General Property** it guarantees:

- **Category, Object, Morphism.** A category consists of objects, hom-sets of morphisms between them, identities, and an associative composition satisfying the identity law. Morphisms, not the objects they connect, carry a category's relational content — an object's identity is determined externally, by the network of morphisms linking it to every other object.
- **Diagram, Cone, Cocone.** A diagram of a given shape is a functor from an index category; it commutes when parallel paths compose to the same morphism. A cone (cocone) packages a compatible family of maps into (out of) every stage of a diagram as a single object.
- **Functor, Natural Transformation, Universal Property.** A functor is a structure-preserving map between categories; a natural transformation is a uniform family of morphisms between two functors; a universal property characterizes an object by a unique-factorization statement, and is the unifying pattern behind every construction below.
- **Limit, Colimit, Pullback, Pushout.** A limit (colimit) is the universal cone (cocone) over a diagram. Pullback and pushout are their respective special cases over a cospan and a span, used to enforce or construct consistency between two maps into (or out of) a shared object.
- **Adjunction.** A pair of functors related by a natural isomorphism of hom-sets (equivalently, a unit/counit pair satisfying triangle identities), forming the canonical optimal translation between two categories.
- **Monoidal Category, Enriched Category.** A monoidal category equips a category with a coherent tensor product and unit object; an enriched category generalizes ordinary categories by allowing hom-objects to carry structured (rather than merely set-valued) data — a metric, a probability, a cost.
- **Yoneda Lemma.** For a locally small category, an object is completely and uniquely recoverable, up to isomorphism, from the network of morphisms into it — formally, $h_X \cong h_Y \implies X \cong Y$.
- **Grothendieck Fibration.** A functor whose morphisms in the base each admit a canonical, universal ("cartesian") lift into the total category, organizing a coherent family of fiber categories varying with a base parameter.
- **Cartesian Closed Category, Subobject Classifier, Topos.** A cartesian closed category internalizes function spaces as first-class objects; a subobject classifier represents sub-object membership as an internal morphism into a distinguished object $\Omega$; a topos is a category with finite limits, cartesian closure, and a subobject classifier, and therefore carries its own internal (generally intuitionistic) logic.

These are general, textbook constructs. Their **applied instantiation** for any specific HEKB domain — which functor is named $O$ or $C$, which categories form a specific adjunction, which topos governs a specific compliance lattice — is the sovereign content of each domain's own applied specification (Reality, Intent, Normative, Physical Knowledge Mapping domains) and is not restated or redefined by this document.

## Normative requirements

The following requirements consolidate the constitutional principles and the memory-architecture policy layer.

**Structural admission and provenance**

1. A system implementing HEKB MUST NOT admit any object into a memory layer unless that object already carries a type from the governing Semantic Type Lattice.
2. A system implementing HEKB MUST NOT provide any channel for knowledge insertion that bypasses the Observation boundary — all admitted knowledge MUST derive from observation.
3. Every object promoted into a memory layer MUST carry a traceable, recoverable record of the observations, episodes, or prior knowledge objects that justified its promotion. An object without a recoverable provenance chain MUST NOT be treated as a valid HEKB knowledge object.

**Consolidation and layering**

4. Knowledge objects MUST NOT be mutated in place across a consolidation boundary; consolidation MUST be an explicit, auditable synthesis of lower-layer evidence into a higher-layer generalization, additive to history rather than destructive of it.
5. Memory MUST be organized as an ordered sequence of layers of increasing abstraction and decreasing volatility. Implementations MUST NOT skip a layer by fiat, and MUST NOT substitute one layer's internal representation for another's.
6. An object's identity across layers, consolidation events, and time MUST be preserved by its structural relationships, not by a mutable internal label.
7. Every consolidated knowledge object MUST remain traceable back to the evidence that produced it; an object that cannot, in principle, be unwound to its supporting provenance chain MUST NOT be treated as valid regardless of its predictive utility.
8. Consolidation SHOULD NOT discard evidence in a way that changes what a future reader would conclude; semantic compression MUST preserve the meaning of what it summarizes.
9. Once an object is promoted to a memory layer, that promotion MUST NOT be silently reversed. Where a later, better-evidenced object supersedes an earlier one, or where demotion occurs, that act MUST itself be evidenced and auditable — a silent rollback MUST NOT occur.

**Layer characteristics and retention**

10. Each of the five memory layers (Observation, Working Memory, Episodic Memory, Semantic Memory, Procedural Knowledge) MUST have a bounded or permanent retention duration appropriate to its position in the volatility ordering, decreasing in volatility from the earliest to the latest layer.
11. Retention and eviction policy at each layer MUST be distinct from, and MUST NOT be conflated with, the mathematics governing promotion between layers (owned elsewhere and cited, not restated here).
12. Archival of source evidence when a higher-layer object is crystallized from it (e.g., episodes archived once a semantic rule is derived) MUST be non-destructive: archived evidence MUST remain retrievable as the crystallized object's provenance chain, consistent with Requirement 3 and Requirement 9.
13. Once an object is retained in the outermost (permanent) layers, its retention MUST be permanent, subject only to auditable supersession mechanics.

> **Private implementation note:** The specific numeric TTL/retention ranges assigned to each memory layer, the specific compression ratios characterizing semantic distillation, and the specific numeric thresholds that trigger promotion between layers are tuned operational parameters proprietary to NVS-Kernel and are maintained in the private NVS-Kernel documentation. This public specification defines only their interface and invariants: each layer MUST have a bounded-or-permanent retention duration consistent with a strictly decreasing volatility ordering across layers (Requirement 10), and any promotion trigger MUST be evidence-based and auditable (Requirement 3, Requirement 9).

> **Private implementation note:** The concrete eviction algorithm used at each layer (e.g., the specific cache-replacement or flush mechanics) is a tuned implementation detail proprietary to NVS-Kernel and is maintained in the private NVS-Kernel documentation. This public specification defines only the structural guarantee such an algorithm MUST satisfy: eviction at the most volatile layer MUST NOT destroy information needed by a not-yet-completed promotion, and archival at later layers MUST be non-destructive (Requirement 12).

**Mathematical vocabulary**

14. Any applied HEKB specification that names a mathematical construct from the Mathematical assumptions section (e.g., a specific functor, adjunction, or topos) MUST cite this document's general definition rather than restate it, and MUST state the construct's Current Owner (the RFC holding its applied instantiation) explicitly.

## Implementation implications

- Implementations MUST provide a type-checked ingress boundary that gates admission into any memory layer and rejects untyped or unobserved objects (Requirements 1–2).
- Implementations MUST maintain provenance links that remain queryable/recoverable for the lifetime of any object they support, including after consolidation (Requirements 3, 7).
- Implementations MUST treat consolidation as an append-only operation against the knowledge graph's history — no implementation may overwrite or discard prior evidence as a side effect of producing a higher-layer generalization (Requirement 4, 8).
- Implementations SHOULD select distinct storage representations per layer suited to that layer's access pattern (e.g., low-latency in-memory representations for the most volatile layers, contextual/relational representations for the more permanent layers); the specific backend technology and schema are out of scope for this document.
- Implementations of layers jointly stewarded with active state estimation (the two most volatile layers) MUST NOT perform continuous-estimation computation (Kalman filtering, particle filtering, factor-graph solving, or quadratic-program solving) as part of HEKB's own retention/eviction logic — that computation belongs to a separate runtime component and HEKB governs only what is retained, not how an estimate is computed.
- Systems that expose a compiled policy or control artifact derived from HEKB's most abstract layer MUST treat execution of that artifact as outside HEKB's own responsibility; HEKB governs only the artifact's retention and versioning.
- Any component citing a mathematical construct defined in this document's Mathematical assumptions section MUST NOT redefine it locally; it should cite this document and state only its own applied instance.

## Related RFCs

- **RFC-NVS-0205** — sibling Batch-1 canonicalization document.
- **RFC-NVS-0208** — sibling Batch-1 canonicalization document.

## Open Issues / Contradictions

1. **Unresolved cross-document diagram ambiguity (flagged in source, not resolved here).** The constitutional source material notes that a companion document's architecture diagram places the Intent-domain applied specification inside an "Execution & Control" responsibility band, which conflicts with this document's own boundary statement (HEKB does not own runtime control, continuous state estimation, or the CHV) and with that same companion document's own notation registry, which assigns the Intent domain to the Intent Category — a knowledge object, not an estimator. The source material explicitly declines to resolve this ambiguity, treating it as content the companion document, not this series, must reconcile. This document preserves that flag rather than picking a side.

2. **Unresolved cross-series reservation tension (flagged in source, not resolved here).** A companion constitutional document reserves the general theory of Pullback, Pushout, Adjunction, and a fourth construct (Left Kan Extension, out of this document's scope) exclusively for a not-yet-published mathematical-foundations document in a sibling series. The mathematics source consolidated into this document nonetheless also publishes general theory for Pullback and Adjunction, needed by two of the HEKB series' own applied specifications (a multi-representation consistency construction and a Reality/Knowledge bridge construction, respectively) that had already forward-referenced both the sibling series' reserved document and this one jointly. The source material records this explicitly as a flagged tension pending cross-series reconciliation, not as something either series' own constitution can adjudicate alone. This document preserves that flag.

3. **Known gap — forward references to unauthored/unpublished documents.** The HEKB series' own reservation table lists a document reserved for long-horizon knowledge-graph evolution across consolidation cycles as "reserved, not yet authored," and a document reserved for observation-integration boundary content as similarly unauthored. Separately, the sibling series' general mathematical-foundations document — forward-referenced repeatedly throughout the mathematics source material as the eventual home for constructs reserved exclusively to it — is likewise described throughout as "not yet published." A vault-wide check for either of these identifiers' actual content found nothing: they exist only as reserved identifiers and forward references, not as drafted or published material anywhere in the archive. This is recorded here as a real gap in the source material; this document does not attempt to fill either gap.
   - **Note on this gap's framing:** the reserved long-horizon-evolution document is described in the source material as governing knowledge-graph evolution across consolidation cycles, not as an owner of the Normative domain category — that ownership is instead assigned, in the same source table, to a different, already-published applied specification. Readers expecting the reserved document to be a "Normative Category" owner should note this discrepancy against the actual archive content.

## References

- `RFC-HEKB/RFC-HEKB00_v1.1.md` — Constitution: nine principles (§2), domain-category architecture and five-stage hierarchy (§3), responsibility boundary including the CHV/EXP-6000 boundary (§4), the flagged RFC-STS00 diagram ambiguity (§4.4), constitutional compliance (§5), reservation table for subordinate specifications (§3.4).
- `RFC-HEKB/RFC-HEKB01_v1.0.md` — Memory Architecture: five-layer definitions, computer analogs, and types present (§2); retention and eviction policy (§3); physical target routing overview (§4); constitutional compliance (§5).
- `RFC-HEKB/RFC-HEKB10_v1.1.md` — Mathematical Foundations: prerequisite category/object/morphism/diagram/cone-cocone theory (§3.5); Functor, Natural Transformation, Universal Property (§4); Limits, Colimits, Pullback, Pushout (§5); Adjunction (§6); Monoidal and Enriched Categories (§7); Yoneda Lemma (§8); Grothendieck Fibration (§9); Cartesian Closure and Topos Theory (§10); flagged responsibility-boundary tension (§11.2).

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
