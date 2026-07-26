---
title: SensOS Ecosystem Master Governance Specification
status: Normative Governance Specification
category: Ecosystem Governance Standard
version: "1.4.0"
updated: 2026-07-26
repository: GemminAI/sensos-docs
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0199
  - RFC-NVS-0202
---

* Version: 1.4.0  
* Date: 2026-07-26  
* Status: Normative Governance Specification (SSOT)  
* Category: Ecosystem Governance Standard  
* Target Domain: sensos.org / GemminAI GitHub Repositories  
* Governing Body: SensOS RFC Editorial Board / Governance Maintainers  
* Governing References: docs/Governance/RFC_GOVERNANCE_PLAN.md, docs/RFC_MAP.md

## 0. Fundamental Governance Principles (Ecosystem Constitution)

All specifications, code contributions, and operational workflows across the SensOS ecosystem SHALL adhere to five immutable constitutional principles:

1. Specification Before Implementation: No production capability, system interface, or Application Binary Interface (ABI) modification SHALL be merged into main branches without an Active or Standard RFC specification governing its design.  
2. Canonical Documentation Over Duplicated Documentation: sensos.org serves as the Single Source of Truth (SSOT). Documentation SHALL NOT be duplicated across repository README files when a canonical specification URL exists.  
3. Deterministic Governance Over Ad Hoc Decisions: Architectural state transitions, compliance validations, and release criteria MUST be governed by machine-verifiable CI gates rather than informal manual consensus.  
4. Automated Verification Over Manual Assertion: Implementation claims (e.g., CI Verified) MUST be continuously derived from machine-readable test artifacts (pytest, ctest, mypy) rather than manual assertions.  
5. Backward Compatibility Unless Explicitly Superseded: Public API contracts (/v1), protocol wire formats, and C-ABIs MUST preserve semantic backward compatibility unless formally deprecated through a successor RFC.

## 1. Executive Summary & Ecosystem Scope

This normative specification establishes binding operational rules, change control protocols, exception policies, and automated compliance machine-interfaces across all SensOS ecosystem repositories (GemminAI/nvs-runtime, GemminAI/hekb, GemminAI/nvs-kernel).

### 1.1 Target Application Scope Matrix (Applies To)

All governance policies, Layer 0 identity rules, and compliance requirements defined in this specification SHALL apply to the following minimum component versions:

| Component / Subsystem | Target Repository | Minimum Compliant Version | Canonical URL / Endpoint |
| --- | --- | --- | --- |
| Developer Portal SSOT | sensos.org | ≥ 1.0.0 | https://sensos.org |
| SensOS Observation Runtime | GemminAI/nvs-runtime | ≥ 1.0.0 | https://sensos.org/Products/SensOS |
| HEKB Knowledge Substrate | GemminAI/hekb | ≥ 1.0.0 | https://sensos.org/Products/HEKB |
| NVS-Kernel Engine | GemminAI/nvs-kernel | ≥ 5.0.0 | https://sensos.org/rfc/RFC-NVS-0100 |

### 1.2 Structured RFC Namespace Taxonomy

To ensure structured scalability across hundreds of specifications, RFC identifiers SHALL be categorized using standard domain prefixes:

| Category Prefix | Domain Classification | Description & Scope |
| --- | --- | --- |
| RFC-NVS-GOV-xxxx | Ecosystem Governance | Constitutional policies, release processes, site IA, and compliance workflows. |
| RFC-NVS-ABI-xxxx | Application Binary Interface | C-ABI layouts, memory ownership rules, and Layer-Port struct definitions. |
| RFC-NVS-PROTO-xxxx | Protocols & Networking | Dynamic Layer Negotiation (DLNP), Distributed Mesh (SDRP), and wire formats. |
| RFC-NVS-ARCH-xxxx | System Architecture | High-level system topology, separation paradigms, and state models. |
| RFC-NVS-INFO-xxxx | Informational / Whitepapers | Theoretical foundations (Meaning Physics), comparative positioning, and guides. |

## 2. Change Control Workflow (RFC Change Protocol)

To preserve architectural integrity and prevent unauthorized modifications to canonical specifications, all RFC creation, modification, and status transitions MUST strictly follow the 5-Stage Change Control Workflow:

+-------------------+      +-------------------+      +-------------------+  
|  1. Proposal      | --> |  2. Editorial     | --> |  3. Technical     |  
|  (PR / Draft RFC) |      |     Review        |      |     Review        |  
+-------------------+      +-------------------+      +-------------------+  
                                                                |  
+-------------------+      +-------------------+                v  
|  5. Portal        | <--- |  4. CI            | <-----------------+  
|     Publication   |      |     Validation    |  
+-------------------+      +-------------------+

### 2.1 Workflow Stages & Approval Gates

1. Stage 1: Proposal (Draft Submission):  
   * Contributor submits a Pull Request (PR) containing a formatted RFC document to docs/ or sensos.org/rfc/.  
   * Assigned initial state: Draft. RFC ID allocated by the RFC Editorial Board / Governance Maintainers.  
2. Stage 2: Editorial Review:  
   * Editorial Board verifies Layer 0 metadata, RFC 2119 keyword usage (MUST, SHOULD), formatting compliance, and supersession links.  
   * Gate Approval: Minimum 1 Editorial Board review approval.  
3. Stage 3: Technical Review & Architecture Gate:  
   * Architecture Working Group evaluates technical soundness, C-ABI / REST API stability, and cross-specification consistency (RFC_CONSISTENCY_AUDIT_REPORT.md).  
   * State transitions from Draft to Active.  
4. Stage 4: CI Validation & Implementation Audit:  
   * Automated CI pipeline (rfc-auditor) verifies that normative claims marked CI Verified pass 100% of corresponding unit/integration test suites with zero warnings/mypy strict errors.  
   * State transitions from Active to Standard.  
5. Stage 5: Portal Publication:  
   * Static site generation pipeline builds and deploys canonical rendered HTML to https://sensos.org/rfc/RFC-NVS-XXXX.

## 3. Temporary Exception Policy (Drift Governance)

Under exceptional operational circumstances, temporary documentation drift between code repositories and sensos.org MAY be permitted subject to strict time and approval bounds.

### 3.1 Exception Conditions & Limits

* Maximum Permissible Window: Temporary exceptions SHALL NOT exceed 14 calendar days from approval.  
* Mandatory Issue Reference: Every exception MUST be bound to an open tracking GitHub Issue (e.g., Issue \#142: Temporary DLNP Header Drift).  
* Approval Authority: Formal approval MUST be granted by at least two members of the SensOS RFC Editorial Board / Governance Maintainers.  
* Remediation Requirement: If a temporary exception is not remediated within 14 days, CI pipelines SHALL automatically fail dependent build workflows (CI FAIL).

## 4. Machine-Readable Compliance & Portal Metadata Protocol

To enable automated compliance auditing by IDE plugins, CI runners, and MCP agents, sensos.org MUST publish versioned, machine-readable JSON interfaces.

### 4.1 Compliance Index Schema (/compliance/index.json)

{  
  "$schema": "https://sensos.org/schemas/compliance-v1.json",  
  "schema_version": "1.0.0",  
  "api_version": "1.0",  
  "generated_at": "2026-07-26T16:00:00Z",  
  "environment": "production",  
  "health_metrics": {  
    "total_rfcs": 8,  
    "broken_links": 0,  
    "unresolved_supersessions": 0,  
    "normative_clauses_count": 142,  
    "audit_passed": true  
  },  
  "specifications": {  
    "RFC-NVS-0100": {  
      "title": "NVS-Kernel Public API Contract",  
      "category": "RFC-NVS-ABI",  
      "status": "Standard",  
      "implementation_status": "Implemented",  
      "target_repository": "GemminAI/nvs-kernel",  
      "test_suite_pass_rate": "185/185",  
      "ci_status": "PASSED",  
      "canonical_url": "https://sensos.org/rfc/RFC-NVS-0100"  
    },  
    "RFC-NVS-0199": {  
      "title": "NVS Capability & Authorization Model (CBAC)",  
      "category": "RFC-NVS-GOV",  
      "status": "Standard",  
      "implementation_status": "Implemented",  
      "target_repository": "GemminAI/nvs-runtime",  
      "test_suite_pass_rate": "100%",  
      "ci_status": "PASSED",  
      "canonical_url": "https://sensos.org/rfc/RFC-NVS-0199"  
    }  
  }  
}

### 4.2 Portal Metadata Read Endpoints (Agent Introspection)

To allow AI agents, MCP servers, and Developer Tools (Cursor, Claude Code) to programmatically inspect the ecosystem, sensos.org exposes public read-only JSON endpoints:

* GET https://sensos.org/api/v1/compliance — Returns the latest complete ecosystem compliance index.  
* GET https://sensos.org/api/v1/rfc/{rfc_id} — Returns structured JSON metadata, status, and raw markdown for a given RFC.  
* GET https://sensos.org/api/v1/products — Returns Layer 0 product identity maps and repository links.

### 4.3 Automated Generation Rule

* Manual Editing Prohibited: Manual modification of compliance/index.json is strictly prohibited (MUST NOT).  
* CI Artifact Generation: The JSON file SHALL be compiled exclusively during post-test CI steps (scripts/rfc_auditor.py) and pushed directly to the sensos.org static asset distribution pipeline.

## 5. Governance Health Metrics & Audit Engine

The health and consistency of the specification ecosystem SHALL be continuously monitored using automated metrics generated by the scripts/rfc_auditor.py CI tool:

| Metric Indicator | Description | Target Health Threshold |
| --- | --- | --- |
| Broken Link Ratio | Ratio of broken cross-specification markdown links. | 0% (Zero Tolerated) |
| Unresolved Supersessions | Specifications marked Superseded lacking valid successor links. | 0 (Zero Tolerated) |
| SSOT Compliance Rate | Repositories fully compliant with Layer 0 Identity & Header block rules. | 100% |
| Artifact Freshness | Elapsed time since last automated /compliance/index.json compilation. | < 24 Hours |
| Open Exception Drift | Active temporary drift exceptions approaching or exceeding 14 days. | 0 Overdue |

## 6. Governance Document Taxonomy & Repository Hierarchy

To ensure consistent taxonomy across all repositories, governance specifications SHALL be organized under the standardized docs/Governance/ directory structure:

docs/  
└── Governance/  
    ├── GOVERNANCE_SPEC.md       \# Master Governance Specification (RFC-NVS-GOV-0001)  
    ├── RFC_GOVERNANCE_PLAN.md   \# Developer Portal & Site IA Plan  
    ├── RFC_EDITORIAL_POLICY.md  \# Style Guide, RFC 2119 Rules, and Metadata Standards  
    └── RFC_CHANGE_CONTROL.md    \# Detailed Workflow & Exception Log

## 7. Revision History

* 2026-07-26 (v1.0.0): Initial README Remediation Directive.  
* 2026-07-26 (v1.1.0): Integrated Layer 0 Identity Audit and dynamic governance delegation.  
* 2026-07-26 (v1.2.0): Formally promoted to Governance Specification with RFC Editorial Board authority and CI compliance matrix rules.  
* 2026-07-26 (v1.3.0 / RFC-NVS-GOV-0001): Established 5-stage RFC Change Control Workflow, 14-day Temporary Exception Policy, Applies To version scope matrix, machine-readable /compliance/index.json schema, and standardized docs/Governance/ taxonomy.  
* 2026-07-26 (v1.4.0): Incorporated Section 0 Constitutional Governance Principles, categorized RFC namespace taxonomy (GOV, ABI, PROTO, ARCH, INFO), schema/API versioning for compliance JSON, Portal Metadata API endpoints for agent introspection, and automated Governance Health Metrics.
