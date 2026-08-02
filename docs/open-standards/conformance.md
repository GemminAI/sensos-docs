---
title: Conformance Program
description: How implementations demonstrate SensOS compatibility through public requirements and shared tests.
order: 4
---


**Version:** 1.0.0  
**Status:** Adopted (Program Design)  
**Goal:** Allow anyone to build software compatible with SensOS.

## 1. Purpose

The Conformance Program turns Public Standards into **testable claims**. An independent implementation may assert compatibility when it satisfies the applicable RFC requirements and passes the required automated suites.

Certification (official validation by Gemmina Intelligence) is optional and defined separately.

## 2. Compatibility claim levels

| Claim | Meaning | Validator |
| --- | --- | --- |
| **SensOS Compatible** | Passes required public RFC conformance tests for a declared profile | Self-asserted or third-party lab using the public suite |
| **SensOS Certified** | Officially validated by Gemmina Intelligence against the Certified profile | Gemmina Intelligence |
| **SensOS Enterprise Certified** | Validated for production readiness and enterprise security expectations | Gemmina Intelligence Enterprise program |

Compatible is open. Certified is official. Enterprise Certified is production-grade official.

## 3. Requirements

A conforming implementation MUST:

1. Declare the **RFC set** and **profile** it targets (for example: Observation ABI + Object ABI + CBAC public model).
2. Implement all **MUST** requirements in those Public Standards for the declared profile.
3. Pass the corresponding **Conformance Test Suite** release.
4. Publish a machine-readable **conformance statement** (product name, versions, RFCs, suite version, result digest).
5. Avoid claiming behavior that depends on unpublished Partner or Trade Secret material unless that claim is scoped to a Partner annex under agreement.

## 4. Profiles

| Profile | Intent | Typical RFC coverage |
| --- | --- | --- |
| **Core Interop** | Minimum viable interchange | Public Object/Observation contracts |
| **Runtime Safety** | Observation + control guarantees | Public safety/runtime RFCs |
| **Distributed** | Multi-node guarantees (public layer) | Public distributed protocol goals |
| **Enterprise Ops** | Auditability and tenancy principles | Public governance/ops RFCs |

Profiles evolve through the Governance Process. New profiles MUST NOT silently expand old Compatible claims.

## 5. Test Suites

| Artifact | Description |
| --- | --- |
| **Conformance Test Suite (CTS)** | Versioned automated tests bound to Public Standards |
| **Protocol Fixtures** | Golden inputs/outputs for observable behavior |
| **Negative Cases** | Fail-closed authorization and malformed-object handling |
| **Profile Manifest** | Lists which tests are required for each profile |

CTS releases are versioned independently of product releases (for example `cts-2026.08`).

## 6. Reference Implementation

Gemmina Intelligence may provide one or more **reference implementations**.

- Reference implementations help clarify intent.
- They are **not** the definition of the standard.
- Where reference behavior and a Public Standard conflict, the **Public Standard wins** after governance correction.
- Proprietary extensions in a reference implementation are not conformance requirements unless elevated into a Public Standard.

Current observation / meaning reference surfaces:

| Artifact | Role | Namespace |
| --- | --- | --- |
| [Meaning Mapper](https://github.com/GemminAI/meaning-mapper) | Reference service (`POST /map`, `POST /api/v1/annotate`) | RFC-MM |
| [semantic-annotator-core](https://github.com/GemminAI/semantic-annotator-core) | Reference library RI | (library) |
| [nvs-runtime](https://github.com/GemminAI/nvs-runtime) | Reference runtime | CORE / NVS |
| Evidence & readiness | Cross-cutting implementation proof | **RFC-ITM** |

Compatible claims that cite Standards Track RFCs SHOULD retain RFC-ITM002 evidence where the Conformance Program requires it.

## 7. Conformance Test Runner

The Conformance Test Runner is the supported entry point for executing CTS locally or in CI:

```text
sensos-cts run --profile core-interop --implementation <endpoint-or-plugin> --report out/report.json
```

Runner responsibilities:

- select profile manifest,
- execute required tests,
- emit a signed or hash-digest report,
- exit non-zero on required failure.

Exact packaging and distribution channels are published with each CTS release.

## 8. Compliance Badge

Implementations that pass may display a badge matching their claim:

| Badge | Requirement |
| --- | --- |
| **SensOS Compatible** | Passing CTS report for a current supported suite/profile |
| **SensOS Certified** | Active Certified status from Gemmina Intelligence |
| **SensOS Enterprise Certified** | Active Enterprise Certified status |

Badges MUST link to a verification page or report digest. Expired or failed status MUST NOT continue to display a badge.

## 9. Compatibility Matrix

The program maintains a public Compatibility Matrix listing:

- implementation name and vendor,
- claimed profile(s),
- RFC versions,
- CTS version,
- claim level (Compatible / Certified / Enterprise Certified),
- last verified date.

Listing is voluntary for Compatible claims and mandatory for Certified claims.

## 10. Version Policy

1. Public RFC SemVer-compatible revisions SHOULD preserve Compatible behavior within a major version.
2. CTS major bumps may accompany breaking Public Standard changes.
3. An implementation certified on CTS `N` is not automatically certified on CTS `N+1`.
4. Deprecated RFCs remain testable as Historic profiles for a published overlap window.

## 11. Relationship to certification

Conformance tests are necessary for all official claims.  
Certification adds steward validation, identity binding, and (for Enterprise) security/production review.

See [Certification](/Open-Standards/Certification).
