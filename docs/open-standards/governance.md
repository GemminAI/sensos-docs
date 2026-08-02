---
title: Standards Governance Process
description: Lifecycle, versioning, deprecation, appeals, and community participation for SensOS public standards.
order: 7
---


**Version:** 1.0.0  
**Status:** Adopted  
**Normative Level:** Best Current Practice

## 1. Purpose

This document defines how SensOS public standards are proposed, reviewed, released, superseded, and retired. The process is designed to be familiar to participants in mature standards ecosystems while remaining practical for a focused steward organization.

## 2. Lifecycle

```text
RFC Proposal
→ Discussion
→ Draft
→ Review
→ Standards Track
→ Conformance Tests
→ Official Release (Active)
→ Superseded
→ Historic
```

| Stage | Exit criteria |
| --- | --- |
| **Proposal** | Problem statement, scope, classification, and success criteria accepted for work |
| **Discussion** | Open commentary period; major objections recorded |
| **Draft** | Complete public-safe text; classification review passed |
| **Review** | Standards editor review + steward check; issues resolved or waived with rationale |
| **Standards Track** | Normative status granted; CTS gaps identified |
| **Conformance Tests** | Required tests merged or explicitly deferred with timeline |
| **Official Release** | Active publication on sensos.org; version tagged |
| **Superseded** | Replacement RFC Active; migration notes published |
| **Historic** | No longer recommended for new implementations |

Experimental documents may stop before Standards Track. Informational documents may never enter Conformance Tests.

## 3. Roles

| Role | Responsibility |
| --- | --- |
| **Author** | Writes and maintains a draft |
| **Community participant** | Comments, tests, proposes changes |
| **Standards editor** | Enforces clarity, classification, and process |
| **Steward** | Gemmina Intelligence accountability for release decisions |
| **Certification program** | Consumes Active standards; does not redefine them ad hoc |

## 4. Versioning policy

1. Public Standards use semantic versions: `MAJOR.MINOR.PATCH`.
2. **PATCH** — clarifications that do not change conformance obligations.
3. **MINOR** — additive, backward-compatible requirements or optional capabilities.
4. **MAJOR** — breaking observable changes for existing conforming implementations.
5. CTS versions reference the RFC versions they enforce.
6. Git tags may mark standards releases (for example `standards-2026.08`) without rewriting history.

## 5. Backward compatibility policy

1. Active Standards Track documents SHOULD preserve backward compatibility within a major version.
2. New MUST requirements that break existing Compatible implementations require a MAJOR bump or a new RFC.
3. Reserved fields and extension points SHOULD be used before renaming stable identifiers.
4. When compatibility is intentionally broken, authors MUST provide migration guidance and a deprecation overlap window.

## 6. Deprecation policy

1. A feature or RFC may be marked **Deprecated** while still implemented by existing systems.
2. Deprecated items remain documented until moved to Historic.
3. Default overlap window for enterprise-impacting removals: **at least 12 months** unless a critical security issue requires faster action.
4. Security-driven breaks MAY shorten the window with public rationale.

## 7. Community participation

Participation channels include:

- public repository issues and pull requests for Public Standards,
- discussion during Draft/Review stages,
- CTS contributions (tests, fixtures, bug reports),
- implementation reports that reveal specification ambiguity.

Contributors retain rights to their submissions under the repository contribution terms. Acceptance into a Public Standard does not imply employment by or endorsement from Gemmina Intelligence beyond the specification text.

## 8. Appeal process

1. File an appeal with the Standards editor citing the decision, the standard section, and the requested remedy.
2. Editor issues a written recommendation within a published SLA.
3. If unresolved, the steward issues a final determination.
4. Appeals may address process errors or ambiguous normative text. They may not demand disclosure of Trade Secrets or waiver of failed conformance tests without a standards change.

## 9. Relationship to product releases

Product releases may ship ahead of standards language only as Experimental behavior. Compatibility claims for production customers SHOULD track Active Public Standards and supported CTS versions.

## 10. Record keeping

The steward keeps:

- RFC status history,
- classification decisions,
- CTS release notes,
- certification listings,
- deprecation schedules.

Research-era Git history remains immutable. Governance improves forward publication; it does not rewrite the past.
