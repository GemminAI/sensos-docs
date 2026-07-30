# Public / Private Boundary Report — Batch 1

**Prepared:** 2026-07-29  
**Status:** Approved with boundary amendments  
**Scope:** Batch 1 canonical specifications: RFC-NVS-0204 through RFC-NVS-0209 and NVS-MATH-0001 through NVS-MATH-0005.

## Decision

Batch 1 is suitable as a public-specification baseline once the amendments below are applied. Public documents MUST specify interoperable types, schemas, lifecycle rules, invariants, and conformance requirements. They MUST NOT disclose tuned formulas, calibration data, thresholds, classifier taxonomies, optimized solvers, or hardware-specific execution strategies unless and until those details are intentionally released.

The following classifications are mandatory:

| Classification | Meaning |
| --- | --- |
| **Public interface** | A public contract is normative: its types, schemas, lifecycle, invariants, and conformance requirements are publishable. The mechanism used to satisfy it remains private. |
| **Public with private annex** | A public contract and private implementation material currently coexist in one source. They MUST be split before release; the private annex MUST NOT be published in the public documentation site. |
| **Private implementation** | The material specifies tuned algorithms, formulas, thresholds, calibration, classifiers, solver internals, or optimized execution strategy. It belongs only in an access-controlled implementation specification. |

This report records the approved boundary decision and the release actions required to apply it. The approved Batch 1 RFCs are not rewritten by this report.

| RFC ID | Title | Public/private classification | Reason | Required action |
| --- | --- | --- | --- | --- |
| RFC-NVS-0204 | SensOS Runtime Constitution | Public | Defines ecosystem roles, layer ownership, and responsibility boundaries; it contains no operational mathematics. | Change repository metadata from `GemminAI/nvs-kernel` to the public SensOS repository when that repository is designated. Retain the no-algorithm boundary. |
| RFC-NVS-0205 | NVS-Kernel Architecture | Public | Defines subsystem ownership, Observation Driver Framework contracts, and memory-region responsibilities, without requiring implementation algorithms. | Change repository metadata to the public SensOS repository. Keep formulas, calibration, and implementation algorithms out of scope. |
| RFC-NVS-0206 | Runtime Safety Module (DAK) — Public Interface Specification | Public interface | External integrators need the ABI, lifecycle, conformance levels, and qualitative invariants; gain/risk mechanisms and intervention classification are implementation IP. | Keep `HiddenStateAdapter` and `DAKHook` contracts public. Move or retain gain functions, thresholds, F17/attractor classification, calibration, and controller policy in private DAK material. Point public metadata to the public SensOS repository. |
| RFC-NVS-0207 | Observation ABI | Public standard candidate | Defines portable observation identity, provenance, versioning, validation, extension namespaces, and serialization-independent interoperability. | Change repository metadata to the public SensOS repository. Resolve the term collision with the evidence-container use of `HEXT` before advancing beyond Proposed. |
| RFC-NVS-0208 | HEXT Object ABI | Public with private annex | The `HextObject` envelope, concrete syntax, serialization rules, validation, and object-level conformance are interoperable contract material. Execution Algebra, semiring projection, coend synthesis, precision classes, and hardware optimization disclose implementation strategy. | Split into a public HextObject/Object ABI specification and a private Execution Algebra annex/specification. Namespace this HEXT family as `HEXT-O` (or an approved equivalent) to distinguish it from the evidence-container family. Publish the public part from `GemminAI/hext`; retain the private annex in `GemminAI/nvs-kernel` or another access-controlled repository. |
| RFC-NVS-0209 | HEKB Memory Model | Public | The hierarchy, provenance guarantees, and qualitative consolidation model are public architectural contracts. | Change repository metadata to the public repository selected for HEKB/SensOS. Keep retention TTLs, compression ratios, promotion thresholds, and eviction/consolidation algorithms private. |
| NVS-MATH-0001 | Curvature Mathematics | Public mathematical interface | Standard mathematical definitions and the type/role/invariants of the curvature signal are required to interpret public contracts; tuned operationalization is not. | Change repository metadata to the public SensOS repository. Preserve redaction of composition/scaling formulas, constants, thresholds, windows, and DAK classifier internals. |
| NVS-MATH-0002 | Geodesic Mathematics | Public mathematical interface | Standard geodesic, connection, transport, and holonomy definitions are public; their NVS-Kernel parameterization and repair mechanism are not. | Change repository metadata to the public SensOS repository. Keep connection parameterization, diagnostic thresholds, and repair objective private. |
| NVS-MATH-0003 | Semantic Metric | Public mathematical interface | Public consumers need the metric-bundle type, domains, and interface-level composition semantics; calibrated composition and projection are proprietary. | Change repository metadata to the public SensOS repository. Keep exact composition, decay, and execution-projection formulas private. |
| NVS-MATH-0004 | Observation Geometry | Public mathematical interface | Defines portable observation concepts, types, replay guarantees, and standard formal structure. | Change repository metadata to the public SensOS repository. Keep feature extraction, scoring functions, calibration, and detection thresholds private. |
| NVS-MATH-0005 | Runtime State Space | Public mathematical interface | State types, legal operators, memory placement, and public invariants are required for interoperable interpretation. | Change repository metadata to the public SensOS repository. Keep state encoding, hidden-state extraction, normalization, and validation calibration private. |

## HEXT Namespace Separation

Two unrelated concepts currently use `HEXT`:

- **Evidence container:** the RFC-NVS20 crystallized knowledge/evidence-container lineage.
- **Observation/execution system:** the RFC-HEXT000/001/005 observation-space, object-model, and execution-algebra lineage.

The approved namespace separation is:

| Namespace | Meaning | Permitted use |
| --- | --- | --- |
| `HEXT-E` | Evidence-container lineage formerly referenced as RFC-NVS20 HEXT / crystallized knowledge object. | Evidence identity, provenance, sealing, and archive references. |
| `HEXT-O` | Observation/object/execution lineage originating in RFC-HEXT000/001/005. | HextObject model, object envelope, object serialization, and the separately controlled execution lineage. |

`HEXT-E` and `HEXT-O` are distinct systems. No document may infer a semantic or runtime bridge merely from the shared historical name. New and amended references MUST use the namespace explicitly; legacy archive citations may retain their original titles only when accompanied by the applicable namespace.

## Repository Metadata Policy

`GemminAI/nvs-kernel` designates private implementation material and MUST NOT be the declared repository for a public RFC. Until public repositories are confirmed, public-boundary documents SHOULD use a neutral repository field such as `TBD — public SensOS repository` rather than assert a repository that has not been created.

The intended ownership split is:

| Public material | Intended public repository | Private material |
| --- | --- | --- |
| SensOS constitution, kernel contracts, Observation ABI, public DAK contract, public mathematical interfaces, HEKB public model | `GemminAI/sensos` | `GemminAI/nvs-kernel` |
| HEXT-O object envelope and object ABI | `GemminAI/hext` | Execution Algebra, optimized backends, private annexes in `GemminAI/nvs-kernel` or an access-controlled HEXT implementation repository |

## NVS-MATH Series Policy

The NVS-MATH series is not categorically private. A public mathematical specification MAY define standard mathematics, typed interfaces, domains, invariants, and API/conformance contracts. A private companion MUST contain GemminAI-specific formulas, tuned coefficients, calibration procedures, optimized solvers, and parameter values. Public mathematics therefore functions as an ABI-level contract, not as a disclosure of the production implementation.

## Release Gates

Before public release or progression beyond `Proposed`:

1. Decide and apply the HEXT namespace separation.
2. Split RFC-NVS-0208 and remove the private execution material from the public document.
3. Correct public-RFC repository metadata without claiming a repository that does not exist.
4. Verify that public documents contain no tuned values, classifier boundaries, operational formulas, or private-source links that disclose restricted material.

## Controlled Amendment Register

The following amendments are required before a future Batch 1 release update. They are intentionally recorded rather than applied to the approved Batch 1 RFCs in this review pass.

| Target | Controlled amendment | Boundary classification |
| --- | --- | --- |
| RFC-NVS-0207 and any evidence-archive reference | Replace ambiguous unqualified HEXT references with `HEXT-E` where the evidence-container lineage is intended. | Public interface |
| RFC-NVS-0208 | Publish only the `HEXT-O` HextObject model, envelope, serialization, validation, and conformance contract. Extract Execution Algebra, semiring projection, coend synthesis, hardware optimization, precision tuning, and execution strategy into an access-controlled companion. | Public with private annex / Private implementation |
| RFC-NVS-0204 through RFC-NVS-0209 and NVS-MATH-0001 through NVS-MATH-0005 | Replace `repository: GemminAI/nvs-kernel` with the applicable public repository (`GemminAI/sensos` or `GemminAI/hext`) or `TBD — public repository` if no public repository has been created. | Public interface |
