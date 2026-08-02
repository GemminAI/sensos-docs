---
title: HEXT Object ABI
status: Proposed
category: Object model and binary interface
version: "1.1.0"
updated: 2026-08-02
repository: TBD — public SensOS repository
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0207
  - RFC-NVS-0209
---

## Abstract

This specification defines the public **HextObject** Application Binary Interface (ABI): the portable object envelope, observable interoperability guarantees, and conformance expectations that allow independently built SensOS components to exchange observation-derived artifacts without sharing a runtime or implementation.

Execution strategy, algebraic evaluation methods, hardware mapping, and optimization policy are **out of scope** for this public RFC. Those materials are maintained as access-controlled engineering specifications.

## Purpose

Provide a stable, hardware-neutral object contract so producers and consumers can:

1. Agree on what a portable object *is* (fields, identity, and validation).
2. Interoperate across languages and deployments without shared source.
3. Verify conformance without requiring disclosure of proprietary execution engines.

## Scope

**In scope (public):**

- Purpose and interoperability goals of the HextObject ABI
- Observable object envelope fields and reserved type values
- Lifecycle and well-formedness guarantees visible at the boundary
- Serialization-independent behavioral requirements for interchange
- Public conformance levels expressed as observable capability tiers
- Compatibility and versioning expectations

**Out of scope (not public):**

- Proprietary evaluation and execution methods
- Hardware backend strategies and optimization policy
- Internal processing pipelines and module names
- Calibration, thresholds, and proprietary solvers

## Definitions

| Term | Public definition |
| --- | --- |
| **HextObject** | A portable envelope carrying identity, type, timestamp, source, payload, and non-semantic metadata for interchange. |
| **Observation object** | A HextObject whose `type` is the reserved value `"observation"`. |
| **Conformance tier** | A declared capability class (Edge, Standard, Enterprise) describing which public ABI behaviors an implementation claims. |
| **Observational equivalence** | The requirement that approximate evaluation MUST NOT change decision-visible outcomes beyond the declared conformance bound for that tier. |

## Public ABI

A HextObject MUST expose the following logical fields:

| Field | Requirement |
| --- | --- |
| `id` | Stable unique identifier within the exchange context |
| `type` | Discriminator; `"observation"` is reserved by this specification |
| `timestamp` | Creation or observation time |
| `source` | Provenance identifier for the producing component |
| `payload` | Semantic content of the object |
| `metadata` | Non-semantic annotations; MUST NOT alter payload meaning |

Implementations MAY offer JSON and binary interchange forms. Concrete binary frame layouts, magic numbers, and encoding tables are published only in partner or internal engineering specifications.

## Guarantees

1. **Identity uniqueness.** Within one exchange context, object ids MUST be unique.
2. **Payload integrity.** Metadata MUST NOT be treated as a substitute for payload semantics.
3. **Type openness.** Unrecognized non-reserved `type` values SHOULD be ignored safely, not treated as fatal protocol failure, unless a higher-level contract requires otherwise.
4. **Non-mutation at boundaries.** Interoperable processors that accept HextObjects MUST NOT mutate inputs in place when emitting outputs.
5. **Equivalence bound.** An implementation that approximates evaluation MUST preserve observational equivalence within its declared conformance tier.
6. **No silent meaning change.** Optimization MUST NOT change the public meaning of a computation without an explicit, auditable conformance declaration.

## Conformance

| Tier | Observable expectation |
| --- | --- |
| **Edge** | Supports the public envelope and basic observation interchange |
| **Standard** | Supports full public envelope semantics and declared equivalence bounds for production nodes |
| **Enterprise** | Supports full public envelope semantics plus enterprise auditability and reference-grade equivalence claims |

Conformance claims are about **observable behavior and interchange**, not about disclosing internal execution methods.

## Interoperability

Independent implementations interoperate when they:

- emit and accept the public HextObject fields,
- honor reserved `"observation"` semantics,
- preserve identity/provenance fields across hops,
- declare a conformance tier,
- refuse malformed objects that violate public well-formedness rules.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.

## Related RFCs

- **RFC-NVS-0207** — Observation ABI
- **RFC-NVS-0209** — HEKB Memory Model (public architectural contract)

## Access-controlled companions

Partner and internal engineering specifications define encoding details and execution mechanisms under separate access control. Those companions are not part of this public RFC.
