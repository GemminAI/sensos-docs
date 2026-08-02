# SensOS Documentation Information Architecture

**Status:** Adopted 2026-08-02  
**Goal:** Enterprise product website with open standards — not an engineering wiki.

## Tier model

```text
docs/
├── public/           # sensos.org — product + open standards
├── enterprise/       # customer / CISO packs (controlled)
├── partner/          # NDA protocol & ABI annexes
├── internal/         # eng design, ADRs, maturity notes
└── trade-secret/     # execution strategy, calibration, solvers
```

| Tier | Audience | Channel | Git policy |
| --- | --- | --- | --- |
| **Public** | CIO/CISO/CTO, developers, investors | sensos.org + public GitHub | Published |
| **Enterprise** | Paying customers under agreement | Customer portal / sales eng | Private repo or ACL |
| **Partner** | Integrators under NDA | Partner portal | Private; gitignored here |
| **Internal** | GemminAI engineering | Internal docs | Private; gitignored here |
| **Trade Secret** | Need-to-know only | Access-controlled vault | Never public GitHub |

## Site navigation (public)

1. Product (Home)
2. Standards (Public RFCs)
3. Developers
4. Resources
5. Enterprise
6. GitHub

Architecture graphs, compliance dashboards, and internal design notes are **not** primary public navigation.

## Homepage job

Answer in five seconds: **What does SensOS do?**  
Sell observation-centered runtime safety. Do not introduce kernel diagrams on first paint.
