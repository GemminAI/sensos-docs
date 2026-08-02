---
title: RFC Namespaces
description: SensOS Open Standards namespace map, including RFC-MM and RFC-ITM.
order: 8
---


**Version:** 1.0.0  
**Status:** Adopted  
**Date:** 2026-08-02

## 1. Purpose

SensOS Open Standards are organized into **RFC namespaces**. Existing namespaces
remain unchanged. Two new namespaces are introduced:

| Namespace | Role |
| --- | --- |
| **RFC-MM** | Meaning Mapper **product** specification |
| **RFC-ITM** | Implementation **traceability & evidence** (cross-cutting) |

Canonical draft corpus (engineering workspace): `RFCv3_draft/rfc/`.

## 2. Namespace architecture

```text
RFC-PROCESS / RFC-ARCH
        │
        ├── RFC-CORE
        ├── RFC-HEXT
        ├── RFC-HEKB
        ├── RFC-MCP
        ├── RFC-CAL
        ├── RFC-SensOS
        ├── RFC-MM      ← Meaning Mapper product (NEW)
        └── RFC-ITM     ← Traceability (NEW, cross-cutting)
```

Unchanged namespaces: CORE, HEXT, HEKB, MCP, CAL, SensOS, ARCH, PROCESS.  
Do **not** rename or renumber existing RFCs.

## 3. RFC-MM roadmap

| RFC | Title |
| --- | --- |
| RFC-MM001 | Meaning Mapper Architecture |
| RFC-MM002 | Meaning View ABI |
| RFC-MM003 | Meaning Payload Schema |
| RFC-MM004 | Meaning Runtime Bridge |
| RFC-MM005 | Meaning Mapper Service API |
| RFC-MM006 | Provider SPI *(future)* |
| RFC-MM007 | Conformance Test Suite *(future)* |
| RFC-MM008 | Certification *(future)* |
| RFC-MM009 | Streaming Protocol *(future)* |
| RFC-MM010 | MCP Integration *(future)* |

Reference service: [Meaning Mapper](https://github.com/GemminAI/meaning-mapper).

## 4. RFC-ITM roadmap

| RFC | Title |
| --- | --- |
| RFC-ITM001 | Implementation Traceability Framework |
| RFC-ITM002 | Evidence Format |
| RFC-ITM003 | Repository Mapping |
| RFC-ITM004 | Implementation Readiness Matrix |
| RFC-ITM005 | Certification Traceability |

RFC-ITM is **independent of products**. It applies equally to CORE, HEXT, HEKB,
MCP, CAL, SensOS, Meaning Mapper, and future products.

## 5. Legacy RFC-SA → RFC-MM

```text
RFC-SA001–005   (historical)
       │
       ▼ Superseded
RFC-MM001–005   (canonical)
```

| Legacy | Status | Successor |
| --- | --- | --- |
| RFC-SA001 | Superseded | RFC-MM001 |
| RFC-SA002 | Superseded | RFC-MM002 |
| RFC-SA003 | Superseded | RFC-MM003 |
| RFC-SA004 | Superseded | RFC-MM004 |
| RFC-SA005 | Superseded | RFC-MM005 |

Historical RFCs remain archived for traceability. They MUST NOT drive new architecture.

## 6. Cross-reference (public surfaces)

| Concern | Namespace | Implementation surface |
| --- | --- | --- |
| Meaning projection service | RFC-MM | `GemminAI/meaning-mapper` |
| Observation normalization library | (library RI) | `GemminAI/semantic-annotator-core` |
| Reference runtime | CORE / NVS public RFCs | `GemminAI/nvs-runtime` |
| Traceability / evidence | RFC-ITM | All implementing repos |
| Standards portal | GOV / Open Standards | `GemminAI/sensos-docs` |

## 7. Related documents

- [RFC Classification Policy](/Open-Standards/Classification)
- [Conformance Program](/Open-Standards/Conformance)
- [Certification](/Open-Standards/Certification)
- [Public RFCs](/Open-Standards/RFCs)
