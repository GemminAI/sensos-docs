---
title: RFC Classification Policy
description: Official classification, audience, and normative levels for every SensOS RFC.
order: 3
---


**Version:** 1.0.0  
**Status:** Adopted  
**Normative for:** All SensOS RFC publications and access-controlled companions

## 1. Purpose

Every SensOS RFC SHALL declare how it may be read, who may change it, and what force it carries. Classification prevents accidental publication of implementation IP and makes ecosystem obligations unambiguous.

## 2. Required metadata

Every RFC SHALL contain at least:

| Field | Required values |
| --- | --- |
| **Classification** | Public Standard · Partner Specification · Enterprise Specification · Internal Engineering · Trade Secret |
| **Status** | Proposal · Draft · Review · Active · Deprecated · Superseded · Withdrawn · Historic |
| **Audience** | Public · Partners · Enterprise · Internal |
| **Normative Level** | Informational · Experimental · Standards Track · Best Current Practice · Historic |

Public Standard RFCs published on sensos.org SHALL also continue to provide existing portal frontmatter (`title`, `status`, `category`, `version`, `updated`, `repository`, relation fields) until the portal schema is extended.

## 3. Classification definitions

| Classification | Intent | Typical content |
| --- | --- | --- |
| **Public Standard** | Interoperability contract | ABI, behavior, guarantees, conformance, compatibility |
| **Partner Specification** | Integration under NDA | Wire encodings, token grammars, protocol annexes |
| **Enterprise Specification** | Customer diligence / ops under agreement | Deployment guides, shared-responsibility models, audit packs |
| **Internal Engineering** | Gemmina engineering design | ADRs, module design, maturity notes, experiment reports |
| **Trade Secret** | Need-to-know proprietary advantage | Evaluation methods, calibration, solvers, optimized execution |

## 4. Audience definitions

| Audience | Who may read |
| --- | --- |
| **Public** | Anyone; published on sensos.org and the public standards repository |
| **Partners** | Parties under active partner / NDA agreement |
| **Enterprise** | Customers or prospects under commercial or diligence agreement |
| **Internal** | Gemmina Intelligence personnel and explicitly authorized contractors |

Audience MUST be consistent with Classification. A Trade Secret document MUST NOT have Audience = Public.

## 5. Normative Level definitions

| Level | Meaning |
| --- | --- |
| **Informational** | Explains context; not a compatibility obligation |
| **Experimental** | Provisional; may change without full deprecation cycle |
| **Standards Track** | Normative interoperability requirements for claims of compatibility |
| **Best Current Practice** | Process or operational requirements for the ecosystem |
| **Historic** | Retained for record; not for new implementations |

## 6. Access matrix

| Classification | Read | Propose changes | Approve changes | Publish to sensos.org |
| --- | --- | --- | --- | --- |
| Public Standard | Anyone | Community + steward | Standards editors + steward | Required when Active |
| Partner Specification | Partners | Partners + steward | Partner program + steward | Forbidden |
| Enterprise Specification | Enterprise audience | Customer success + steward | Enterprise program + steward | Forbidden (summaries may be public) |
| Internal Engineering | Internal | Engineering | Engineering leads | Forbidden |
| Trade Secret | Need-to-know | Authorized inventors/owners | IP / executive designee | Forbidden |

## 7. Publication requirements

### Public Standard

1. MUST obey the Documentation Philosophy (WHAT, not HOW).
2. MUST NOT include wire layouts, token grammars, calibration constants, internal module inventories, or execution strategies.
3. MUST define observable conformance criteria or explicitly defer them to a named conformance suite.
4. MUST pass classification review before leaving Draft.

### Partner Specification

1. MUST be distributed only under NDA or equivalent.
2. MUST reference the Public Standard it implements or extends.
3. MUST NOT be copied into public RFC bodies.

### Enterprise Specification

1. MAY deepen operational guidance beyond Public Standards.
2. MUST NOT disclose Trade Secret methods unless a separate exhibit explicitly authorizes that disclosure.

### Internal Engineering / Trade Secret

1. MUST remain outside public Git history for new material going forward (historical research-era commits remain immutable).
2. MUST NOT be linked from primary public navigation.

## 8. Approval authorities

| Change type | Authority |
| --- | --- |
| Editorial (non-normative) | Standards editor |
| Normative Public Standard | Standards editor + steward review |
| Partner / Enterprise specs | Program owner + steward |
| Reclassification to/from Public | Steward + IP review |
| Trade Secret designation or release | Executive designee / IP counsel |

## 9. Compatibility with portal status labels

Until metadata is fully unified, map portal `status` values as follows:

| Portal status | Governance Status | Typical Normative Level |
| --- | --- | --- |
| Proposed | Proposal / Draft | Experimental or Standards Track |
| Active / Implemented | Active | Standards Track |
| Deprecated | Deprecated | Historic or Standards Track (sunset) |
| Superseded | Superseded | Historic |

## 10. RFC namespaces

RFCs are further organized by **namespace**. Namespace assignment does not replace Classification; both MUST be declared.

| Namespace | Purpose | Notes |
| --- | --- | --- |
| RFC-CORE | Kernel / observation core | Unchanged |
| RFC-HEXT | Object / transport | Unchanged |
| RFC-HEKB | Knowledge base | Unchanged |
| RFC-MCP | MCP extensions | Unchanged |
| RFC-CAL | Cache / projection | Unchanged |
| RFC-SensOS | Platform managers | Unchanged |
| RFC-ARCH | Architectural taxonomy | Unchanged |
| RFC-PROCESS | Lifecycle protocol | Unchanged |
| **RFC-MM** | Meaning Mapper product specs | New |
| **RFC-ITM** | Implementation traceability & evidence | New; cross-cutting |
| RFC-SA | Legacy semantic annotation | **Superseded** by RFC-MM; Historic |

See [RFC Namespaces](/Open-Standards/Namespaces).

**RFC-ITM** applies to every product namespace. It does not define product ABIs.

## 11. Enforcement

Material that violates this policy SHALL be blocked from public release, redacted, or reclassified before publication. Conformance and certification programs SHALL cite only Public Standard and explicitly approved Partner annexes.
