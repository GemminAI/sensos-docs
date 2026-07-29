---
title: Domain Boundary Separation & Kernel Manager Architecture
status: Active / Implemented
category: Kernel executive architecture
version: "1.1.0"
updated: 2026-07-30
repository: GemminAI/nvs-kernel
supersedes: []
related: ["RFC-SensOS21", "RFC-SensOS23"]
---

## Implementation Status

**Reference Implementation:** [`GemminAI/nvs-kernel`](https://github.com/GemminAI/nvs-kernel)

**Validation:** EXP-8000 Integration Validation — PASS

**Quality Gates**

- Ruff — PASS
- MyPy Strict — PASS
- Pytest — 256 passed
- Regression — None

Implemented: `Workspace`, `WorkspaceManager`, `CacheManager`, `CachingSubsystem`, `SelfCache`, `ExternalCache`, `SensorCache` (`nvs_kernel/workspace/`, `nvs_kernel/managers/`).

---

## Abstract

This specification defines strict domain separation within the SensOS Kernel, and the Kernel Executive subsystem structure built on the three-tier architecture (Governance / Execution / Runtime) of RFC-SensOS21. It resolves the earlier conflation of concerns under a single "Workspace Cache" abstraction — working-session state, in-memory cache, execution context, and multi-tenant boundary — by introducing the same kind of domain separation a general-purpose OS has.

## Core Principles

1. **Names are APIs** — a concept's name is its API, class name, and type/module boundary. Ambiguous naming is prohibited.
2. **Environment vs. Mechanism** — Workspace is the execution environment (a container of state and resources); Cache is an implementation mechanism (a performance-optimization primary store). Workspace owns Cache: `Workspace ▷ Cache`.
3. **Layered Isolation** — Kernel manager responsibilities are strictly assigned along the Governance / Execution / Runtime three tiers.

## Entity Hierarchy

```
Tenant (org/security/billing boundary)
  └── Project (knowledge/artifact/access boundary)
        └── Workspace (execution environment/resource boundary)
              └── Agent (autonomous reasoning/execution actor)
                    └── Context (current task state, instructions)
Cache (fast-access primary store) — owned by Workspace, not a peer entity
HEKB (persistent knowledge) / Repository (source-of-record data)
```

> Tenant/Project entities and their ACL are not implemented in `nvs-kernel`.

## Kernel Executive Architecture

```
Governance Layer (RFC-SensOS21)
  └── Governance Validation Engine
        │
Execution Layer (Kernel Executive)
  ├── Workspace Manager    ├── Goal Manager (RFC-SensOS23)    ├── Process Manager
  └── Scheduler
        │
Runtime Layer
  ├── Cache Manager    ├── Memory Manager    ├── Knowledge Manager
  └── Observation Manager    ├── Resource Manager
```

**Implemented in this pass:** Workspace Manager, Cache Manager only. Memory Manager, Process Manager, Observation Manager, Scheduler, and Resource Manager are named by this specification but are not yet implemented — out of scope for this refactoring.

### Workspace internal structure

```
Workspace
├── Context             — current task state, conversation state, instruction state
├── ProcessState         — execution state, agent lifecycle, pending work
├── RuntimeObjects        — temporary runtime objects, environment, execution metadata
└── CachingSubsystem      — performance optimization only, no business logic
     ├── SelfCache        — AI-generated temporary information (planning, reasoning)
     ├── ExternalCache    — temporary copies of external resources (HEKB, Repository, API, MCP)
     └── SensorCache      — streaming observations (camera, lidar, RSS, telemetry, webhooks)
```

Each cache stores references and temporary copies only — never canonical RFC contents, HEKB knowledge, or Repository data directly.

## Data Access Flow

```
Agent → WorkspaceManager → CacheManager (fast-path)
                               │ miss
                               ▼
                          KnowledgeManager (slow-path, interface only)
                               │
                               ▼
                          CacheManager (populate) → Agent
```

No direct Repository access from Workspace. No direct HEKB access from Agent. `KnowledgeManager` is implemented as an interface (`Protocol`) only — no HEKB/Repository access logic ships in this repository.

## Suspend / Resume / PageOut / PageIn

`WorkspaceStatus` follows `ACTIVE → SUSPENDED → PAGED_OUT` as a strict state machine. `PageOut`/`PageIn` are state transitions only — no data is moved to secondary storage. Full swapping is reserved for **RFC-SensOS24: Workspace Context Switching & Suspension Protocol**.

## Future Standardization Roadmap

- **RFC-SensOS21** — Semantic Governance Architecture (established)
- **RFC-SensOS22** — Domain Boundary Separation & Kernel Manager Architecture (this specification)
- **RFC-SensOS23** — Goal Manager & Intent Decomposition Protocol (established)
- **RFC-SensOS24** — Workspace Context Switching & Suspension Protocol (next)

---

## Validated by

**EXP-8000** — Workspace Boundary Isolation (EXP-8004): independent Workspaces complete concurrently with no cross-contamination of Context, Cache, or Process State.
