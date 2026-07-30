# Batch 2 Source Review Report

**Prepared:** 2026-07-29  
**Status:** Source review complete. Canonical drafting is not authorized by this report.  
**Scope:** NVS-MATH-0006, Basin and Attractor Mathematics; NVS-MATH-0007, Stability and Constraint Pipeline.

## Review Method and Boundary Rule

Each source is assessed for authority, portability, dependencies, terminology, and disclosure risk. A source may support a public interface only where its definition or contract is independent of tuned implementation. This report does not reconstruct the lost RFC-NVP02–23 mathematical bodies, invent formulas, or authorize publication of proprietary algorithms, thresholds, calibration constants, or solver implementation details.

## NVS-MATH-0006 — Basin and Attractor Mathematics

### Source and authority assessment

| Source | Authority assessment | Usable contribution | Restriction |
| --- | --- | --- | --- |
| RFC-NVS13 v1.1, Collective Attractor Management Protocol | Draft Standards Track source. It is the strongest direct source for the operational vocabulary, lifecycle, event shape, provenance, and non-intervention boundary. | Attractor, basin, lifecycle, event provenance, registry concept, and the separation between observation and control. | Its six-type taxonomy, risk/depth/strength/radius values, escape decisions, learning procedures, and exchange payload semantics are not approved public mathematics. |
| RFC-NVS33 v0.1, Boundary Services | Draft service specification. It adds boundary, transition-corridor, and cross-basin-navigation vocabulary, but it is explicitly calibration- and experiment-dependent and depends on an older RFC-NVS13 version. | Qualitative distinction between basin membership, a basin boundary, a transition corridor, and a boundary-status report. | All measured values, alert thresholds, leverage score, path-selection procedure, torque estimate, latency targets, and calibration criteria are private implementation material. |
| RFCv3/RFC0030 v2.1, Semantic Groupoid Theory | Pre-Canonical predecessor-system mathematics, scoped to TAG/CFI and LoRA learning rather than NVS-Kernel. It is informative only. | The historical term “Meaning Attractor” as an equivalence-class/orbit metaphor. | The CFI threshold, weighted equivariance loss, CDR re-projection mechanism, and TAG/CFI-specific claims are not portable NVS normative content. |
| DAK interface material (RFC-NVS-0206) | Approved public interface, not a source of attractor mathematics. It establishes only the integration boundary for safety observations and interventions. | Qualitative statement that a safety module may consume an observation and take a contractually declared intervention action. | DAK gain/risk mechanics, F17 classification, thresholds, calibration, and controller policy remain private. |

### Public/private classification

| Content | Classification | Treatment |
| --- | --- | --- |
| Basin, attractor, boundary, corridor, lifecycle, provenance, and non-intervention interfaces | Public interface | May be canonically defined only as types, qualitative invariants, and interoperability vocabulary. |
| Event envelope and provenance reference | Public interface | May define stable identifiers, time/window provenance, source identity, and declared namespace; use `HEXT-E` for evidence/archive provenance. |
| Taxonomy labels, classifier outcomes, risk/depth/strength/radius values, escape selection, learning rules, corridor-ranking, path planning | Private implementation | Do not publish the algorithms, parameters, procedures, or default categories. |

### Dependency analysis

- Depends on NVS-MATH-0005 for the public notion of runtime state, and NVS-MATH-0004/RFC-NVS-0207 for observation and provenance terminology.
- Consumes the public DAK interface only as a boundary: it may provide an observation to a safety module, but does not specify intervention policy.
- RFC-NVS33's direct dependency on RFC-NVS13 v0.2 conflicts with the available RFC-NVS13 v1.1. Reconciliation must establish whether the boundary-service input vocabulary is stable across the versions before canonical drafting.
- RFC-NVS33's calibration infrastructure dependency does not authorize publication of calibrated observables or evaluation criteria.

### Terminology conflicts

| Term | Conflict | Required resolution before drafting |
| --- | --- | --- |
| HEXT | RFC-NVS13/NVS31-era materials use HEXT for evidence/archive material; the HEXT Object ABI lineage uses the same historical name. | Use `HEXT-E` for evidence provenance. Do not reference `HEXT-O` unless an actual object-ABI relationship is separately established. |
| Attractor | RFC-NVS13 describes an operational convergence/failure-management concept; RFC0030 uses a TAG/CFI equivalence-class metaphor. | Define the public term independently and identify RFC0030 as informative historical context only. |
| Basin / boundary | NVS13 uses basin operationally, while NVS33 introduces a calibrated boundary analysis service. | Separate the mathematical boundary concept from any calibrated detection service. |

### Redaction requirements

Redact or retain privately all classifications, detection and escape rules, scoring formulas, thresholds, experimental measurements, calibration records, transition-ranking methods, route-planning methods, torque estimates, and performance targets.

### Canonicalization recommendation

**Defer canonical drafting pending one source-resolution pass.** Drafting may be proposed only after (1) resolving the RFC-NVS13 v0.2/v1.1 dependency mismatch, (2) approving a source-independent public definition set for basin, attractor, boundary, and corridor, and (3) recording the `HEXT-E` provenance namespace. No formula or control mechanism should be carried forward from the reviewed drafts.

## NVS-MATH-0007 — Stability and Constraint Pipeline

### Source and authority assessment

| Source | Authority assessment | Usable contribution | Restriction |
| --- | --- | --- | --- |
| RFC-STS04 v1.4, STS Algebraic Constraints & Safety Invariants | Proposed, internally structured primary source for the three constraint domains and high-level verification obligations. It includes standard control-theory and deontic terminology, but also illustrative implementation material. | Public interface vocabulary for physical, epistemic, and normative constraints; obligation that a conformant system represent a constraint, report feasibility/violation, and preserve typed provenance. | The concrete NIR example, safety margins, class-K parameterization, entropy limit, compiler pipeline implementation, exception-processing implementation, and QP-CBF solver details are private or implementation-specific. |
| RFC-NVS31 v0.1, Integrity Services | Draft service specification. Strong for the separation of monitoring/auditing from intervention and for report-shaped outputs, but its score and severity procedure is calibrated. | Integrity-report provenance, evaluation-window declaration, confidence/qualification metadata, and non-intervention responsibility boundary. | Integrity score formula, default weights, drift thresholds, detection methods, alert policy, calibration records, and operational targets are private. Its evidence reference is `HEXT-E`, not `HEXT-O`. |
| RFC-NVP31 v0.1, Semantic Temporal Logic | Draft but coherent semantic-logic source. Its terminal-logic vocabulary is useful, but it normatively depends on lost NVP02–23 foundations and embeds reference implementation and experimental claims. | Informative terminology for trajectories, temporal properties, stability, collapse, recovery, and a temporal-property interface. | Do not reconstruct its missing foundations. Do not adopt the Python reference implementation, CSD/critical-parameter claims, danger-basin claims, DAK control-law details, or any thresholds/exponents as public canonical content. |

### Public/private classification

| Content | Classification | Treatment |
| --- | --- | --- |
| Typed constraint declaration, domain classification, qualitative safety/stability obligation, feasibility/violation result, temporal-property vocabulary | Public interface | Define as contracts and invariants only; standard mathematical definitions may be cited where self-contained and necessary. |
| Integrity-report envelope, declared evaluation window, evidence provenance, confidence/qualification metadata, audit-only responsibility | Public interface | Specify fields and semantics without prescribing scoring algorithms or thresholds. |
| Barrier construction, Lyapunov/CBF parameterization, numerical solver, compiler/verification implementation, integrity scoring, drift detection, alert thresholds, CSD fitting, Python reference code, DAK policy/control mechanics | Private implementation | Keep out of any public canonical document. |

### Dependency analysis

- NVS-MATH-0007 depends on NVS-MATH-0005 for state terminology and on NVS-MATH-0004/RFC-NVS-0207 for observation/provenance contracts.
- RFC-STS04 normatively relies on the STS constitution and core type/trait/relation specifications, and forward-references unpublished RFC-STS10. A Batch 2 document must not claim to replace those owners.
- RFC-NVS31 depends on the evidence archive lineage: this is `HEXT-E`. Its dependency on NVS12/NVS30/NVS-CAL makes its scoring and alert behavior non-portable.
- RFC-NVP31 relies on lost NVP02–23 foundations, including state space, topology, stability, and dynamics. Its self-contained temporal-logic vocabulary can be treated as informative only; it cannot supply missing canonical mathematics.
- DAK terminology conflicts: RFC-NVP31 calls DAK “Dynamic Alignment Kernel,” while the approved public contract calls it “Dynamic Abort Kernel.” Batch 2 must use the approved public name and avoid importing the predecessor control-law scope.

### Terminology conflicts

| Term | Conflict | Required resolution before drafting |
| --- | --- | --- |
| DAK | “Dynamic Alignment Kernel” in RFC-NVP31 conflicts with the approved “Dynamic Abort Kernel” public interface. | Use “Runtime Safety Module (Dynamic Abort Kernel)” in canonical documents; treat the older expansion as historical only. |
| Constraint pipeline | RFC-STS04 frames a compiler-time mechanism, whereas NVS31 is an audit/monitoring service and NVP31 is a temporal-logic specification. | Define separate contract stages: declaration, observation/audit, evaluation result, and consumer action. Do not claim a single shared implementation pipeline. |
| Stability | STS04 uses control-theory stability; NVP31 uses semantic-trajectory stability; NVS31 uses integrity-trend language. | State the domain for every use and do not imply equivalence without a sourced bridge. |
| HEXT | NVS31 refers to the evidence archive. | Use `HEXT-E` explicitly; no `HEXT-O` dependency is established. |

### Redaction requirements

Redact all concrete safety margins, gains, barriers, entropy limits, scoring weights, severity cutoffs, calibration methods, solver selection and configuration, performance targets, reference code, empirical critical values, fitted exponents, controller behavior, and DAK intervention policy.

### Canonicalization recommendation

**Do not begin canonical drafting.** A future draft is feasible only as a public interface specification after an authority-resolution pass that (1) separates STS04's standard definitions from its implementation example, (2) defines a minimal temporal-property vocabulary without importing lost NVP foundations, (3) resolves the DAK name/scope conflict, and (4) specifies `HEXT-E` provenance. The report does not authorize a formula-bearing mathematics specification.

## Exit Condition

This source review completes the requested Batch 2 preparation. No NVS-MATH-0006 or NVS-MATH-0007 canonical RFC has been created or modified. Await approval before drafting either specification.
