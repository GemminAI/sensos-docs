# README_FIRST.md

**The Constitution of this Repository**

This document is mandatory reading for every human contributor and every AI coding agent
(Cursor, Claude Code, ChatGPT Codex, Gemini CLI, GitHub Copilot, and successors)
**before** reading RFCs, generating code, editing documentation, or proposing architecture.

If you skip this file, you will make incorrect decisions.

---

## 1. Read This First

This repository has evolved through multiple phases:

```text
Research Era
    ↓
Enterprise Product
    ↓
Open Standards Platform
```

Git history preserves that evolution. Historical documents are valuable.
They are **not** automatically canonical.

Never assume that the newest-looking file, the longest RFC, or a familiar
internal design is authoritative.

Never treat research-era specifications, archived experiments, or superseded
RFCs as implementation guidance.

Always follow **§4 Canonical Sources** below.

Release markers:

| Tag | Meaning |
| --- | --- |
| `v1.0-research` | Final Research Documentation Era (historical) |
| `v2.0-enterprise` | Enterprise Product + Open Standards (current public face) |

`main` represents the official public product and open-standards platform.
History behind it remains readable. History does not override present canon.

---

## 2. Project Mission

SensOS is an **observation-first enterprise AI runtime safety platform** and an
**open interoperability standard**.

It continuously observes AI runtime behavior, detects semantic trajectory risk,
and enables safe control **without modifying model weights**. SensOS is
**model-independent** and designed for **interoperability** across vendors and
runtimes. Public standards define interfaces and guarantees; Gemmina Intelligence
may ship a proprietary implementation that competes on quality behind those interfaces.

SensOS is not merely a software product.
SensOS is an open interoperability platform with proprietary implementation.

---

## 3. Current Documentation Philosophy

Documentation is stratified by the question it is allowed to answer:

```text
Public RFC / Public docs
    ↓
WHAT

Partner Specification
    ↓
HOW TO INTEGRATE

Internal Engineering
    ↓
HOW IT WORKS

Trade Secret
    ↓
WHY WE WIN
```

| Layer | Answers | May contain |
| --- | --- | --- |
| **Public** | WHAT | Interfaces, behavior, guarantees, conformance, compatibility |
| **Partner** | HOW TO INTEGRATE | Wire encodings, credential annexes, protocol bindings under NDA |
| **Internal** | HOW IT WORKS | Design, modules, maturity, experiments, ADRs |
| **Trade Secret** | WHY WE WIN | Differentiated methods, calibration, optimized evaluation |
| **Enterprise** | HOW TO ADOPT SAFELY | Diligence and operations under commercial agreement |

**AI agents MUST NOT move information between these layers.**

- Do not promote Internal or Trade Secret detail into Public RFCs or the website.
- Do not demote Public interface requirements into “implementation detail” and ignore them.
- Do not paste Partner annex material into public pages or public pull requests.
- Do not reconstruct deleted historical internals into current public docs or code comments.

Crossing layers without authorization is a governance failure, not a helpful cleanup.

Canonical philosophy texts:

- `docs/open-standards/documentation-philosophy.md`
- `docs/open-standards/charter.md`

---

## 4. Canonical Sources

AI agents MUST read in this order before implementing or restructuring:

```text
1. README_FIRST.md                          ← this constitution
2. docs/open-standards/charter.md          ← Open Standards Charter
   (also RFC-NVS-GOV-0002)
3. docs/open-standards/classification.md   ← RFC Classification Policy
   (also RFC-NVS-GOV-0003)
4. docs/open-standards/documentation-philosophy.md
5. docs/open-standards/governance.md       ← lifecycle & compatibility policy
   (also RFC-NVS-GOV-0005)
6. docs/open-standards/conformance.md
   docs/open-standards/certification.md
   (also RFC-NVS-GOV-0004)
7. Open Standards RFC index                ← /Open-Standards/RFCs
8. Active Public RFCs only                 ← status Active / Standards Track intent
9. docs/developer/                         ← public developer guidance
10. Everything else                        ← only as needed, never as silent canon
```

### Binding rules for canonicity

1. **Historical RFCs are not automatically canonical.**
2. **Superseded documents must never drive architecture.**
3. **`status: Active` Public Standards override older research text** on the same subject.
4. **Git tags and commits preserve research**; they do not authorize re-implementation of retired designs.
5. If two documents conflict, prefer: Constitution → Charter → Classification → Governance → Active Public RFC → everything else.
6. If uncertain whether a document is canonical, **stop**. Do not invent architecture.

Website entry points (rendered canon):

| Page | Role |
| --- | --- |
| `/Open-Standards` | Ecosystem overview |
| `/Open-Standards/Charter` | Why standards are public |
| `/Open-Standards/RFCs` | Public RFC index |
| `/Open-Standards/Conformance` | Compatibility claims |
| `/Open-Standards/Certification` | Official validation |
| `/Open-Standards/Governance` | Process law |

---

## 5. Documentation Classification

Every SensOS specification belongs to exactly one primary classification:

| Classification | Who may read | Belongs here |
| --- | --- | --- |
| **Public Standard** | Anyone | Interoperability contracts published on sensos.org |
| **Partner Specification** | NDA / partner agreement | Integration encodings and protocol annexes |
| **Enterprise Specification** | Customer / diligence agreement | Adoption, security shared-responsibility, ops packs |
| **Internal Engineering** | Gemmina staff / authorized contractors | ADRs, design notes, experiment reports, maturity |
| **Trade Secret** | Need-to-know only | Proprietary evaluation, calibration, optimized execution |

Publication requirements:

- Public Standard material MUST obey WHAT-not-HOW.
- Partner / Enterprise / Internal / Trade Secret bodies MUST NOT be published to the public site or public Git paths intended for open consumption.
- In this repository, `docs/partner/**`, `docs/enterprise/**`, `docs/internal/**`, and `docs/trade-secret/**` retain **README stubs only** in public Git; restricted bodies are access-controlled elsewhere.

See `docs/open-standards/classification.md` and `RFC-NVS-GOV-0003`.

---

## 6. Architecture Rule

### Public RFCs define

- Interfaces
- Behavior
- Guarantees
- Conformance
- Compatibility

### Public RFCs do NOT define

- Algorithms
- Optimizations
- Execution strategies or evaluation algebras
- Kernel internals
- Calibration
- Runtime implementation
- Internal APIs
- Roadmaps, unfinished modules, or experiment identifiers

If a change requires altering public observable behavior, update the Public RFC **first** (or in the same change set under Governance Process). Code must not silently redefine the standard.

---

## 7. Implementation Rules

When generating or modifying code, tests, examples, or public documentation:

1. **Use canonical Active Public RFCs** for interfaces and behavior.
2. **Never restore deleted historical behavior** from Git history unless a current Active RFC explicitly requires it.
3. **Never copy archived implementations** as if they were current architecture.
4. **Never expose internal implementation details** in public docs, public comments intended for publication, examples, or error messages that reveal Trade Secrets.
5. **Never change public interfaces** without updating the corresponding Public RFC and considering conformance impact.
6. **Prefer fail-closed behavior** where public security/authorization RFCs require it.
7. **Do not invent undocumented public APIs.** Extensions require specification.
8. **Respect classification.** Partner annexes stay partner; secrets stay secret.

---

## 8. Historical Documents

Git history preserves:

- Research-era RFCs and mathematics notes
- Experiments and validation narratives
- Earlier architectures and internal design reports
- Pre-redaction public text (reachable via tags such as `v1.0-research`)

These materials are **historical references**.

They are suitable for:

- understanding evolution,
- archaeology during release notes,
- IP and compliance review of what was once published.

They are **not** suitable for:

- driving new architecture,
- restoring removed public disclosure,
- treating superseded designs as Active Standards.

Preserving history is mandatory.
Re-enacting history in production interfaces is forbidden unless re-adopted through Governance.

---

## 9. Repository Map

| Path | Role |
| --- | --- |
| `README_FIRST.md` | Repository constitution (this file) |
| `README.md` | Human-oriented portal overview; subordinate to this file |
| `docs/open-standards/` | Charter, classification, conformance, certification, philosophy, governance |
| `docs/public/` | Public-safe policy notes and migration records |
| `docs/rfc/` | **Public** RFC corpus published by the portal |
| `docs/developer/` | Public developer guidance |
| `docs/architecture/`, `docs/products/`, `docs/governance/` | Public summaries (non-secret) |
| `docs/mathematics/` | Public mathematical **interface** contracts when present; never tuned secrets |
| `docs/partner/` | Partner tier (public Git: README stub only) |
| `docs/enterprise/` | Enterprise tier (public Git: README stub only) |
| `docs/internal/` | Internal tier (public Git: README stub only) |
| `docs/trade-secret/` | Trade Secret tier (public Git: README stub only) |
| `src/` | Astro site application (pages, layouts, components, libs) |
| `public/` | Static site assets (CNAME, robots, public JSON artifacts) |
| `scripts/` | Portal maintenance utilities |
| `LICENSE` | Documentation licensing terms |

There may be no top-level `examples/` or `tests/` trees. Do not invent them as canonical homes for secret material.

Runtime product source code, when separate, lives in other GemminAI repositories and may carry different licenses. This portal is the documentation and standards SSOT—not a dump of proprietary runtimes.

---

## 10. Working Rules for AI Agents

Before writing code or editing specifications:

1. Read this constitution.
2. Identify the **current Active RFC(s)** for the surface you touch.
3. Check **Classification** and **Audience**.
4. Check **Superseded** / **Deprecated** / **Historic** status.
5. Check **Architecture Rule** (§6) and **Implementation Rules** (§7).
6. Check whether the change belongs in Public, Partner, Internal, or Trade Secret.

If uncertain:

**Stop.**

Do not invent architecture.
Do not “helpfully” restore research-era detail into public docs.
Do not guess wire formats, token grammars, or calibration.
Do not widen public disclosure.

Ask for a canonical citation or a human steward decision.

---

## 11. Open Standards Philosophy

SensOS publishes **standards**, not implementations.

We encourage compatible software.
We provide conformance paths and optional certification.
We do **not** publish proprietary runtime technology as a condition of interoperability.

Open interfaces create a market.
Proprietary excellence creates differentiation.
Agents must strengthen that boundary, never erode it.

Primary references:

- Open Standards Charter — `docs/open-standards/charter.md`
- Conformance Program — `docs/open-standards/conformance.md`
- Certification — `docs/open-standards/certification.md`

---

## 12. Golden Rules

1. Read `README_FIRST.md` before any RFC.
2. Observation before implementation.
3. Canonical documents override historical ones.
4. Active Public Standards override research-era text.
5. Superseded RFCs never drive architecture.
6. Public specifications define WHAT.
7. Partner specifications define HOW TO INTEGRATE.
8. Internal documents define HOW IT WORKS.
9. Trade Secrets define competitive advantage.
10. Never expose Trade Secrets in public surfaces.
11. Never treat archived RFCs as Active.
12. Never invent undocumented public APIs.
13. Never restore deleted historical behavior without a current RFC mandate.
14. Never copy archived implementations as present canon.
15. Never move information across classification layers.
16. Never change public interfaces without updating RFCs.
17. Always consider conformance and backward compatibility.
18. Prefer fail-closed authorization and safety behavior when specified.
19. If uncertain, stop; do not invent architecture.
20. Preserve Git history; do not rewrite it to hide research—govern the present instead.
21. Compatible software is welcome; proprietary methods remain private.
22. When in conflict, the Constitution and Charter win.

---

## Authority

This file is maintained by the SensOS standards steward (Gemmina Intelligence LLC).

Amendments to this constitution require the same care as Public Standard governance:
clear intent, classification integrity, and no silent weakening of the public/private boundary.

**End of Constitution.**
