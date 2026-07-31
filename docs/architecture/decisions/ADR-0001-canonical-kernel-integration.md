# ADR-0001 — Canonical Kernel Integration

**Status:** Accepted
**Date:** 2026-07-31

## Background

Prior to this milestone, SensOS's `KernelGateway` targeted a legacy contract
— `POST /kernel/ingest` and `POST /kernel/v2/observations` — neither of which
exist on the canonical NVS-Kernel. Every runtime-event forward through that
path silently degraded to `PENDING`, breaking Observation Runtime →
Kernel Executive reachability for RFC-SensOS23's goal pipeline.

The canonical NVS-Kernel (`GemminAI/nvs-kernel`) exposes:

- `POST /observe`
- `POST /project`
- `POST /geometry`
- `POST /belief`
- `POST /trajectory`
- `POST /predict`
- `POST /risk`
- `POST /control`
- `POST /memory`
- `POST /hekb/query`

`KernelGateway` has been corrected to route exclusively through `POST
/observe` using the Observation-ABI (`ObserveRequest` / `ObserveResponse`),
with the legacy methods removed rather than shimmed. This ADR records the
architectural boundary that fix establishes as permanent.

## Decision

The canonical implementation of the Kernel Executive is
**`GemminAI/nvs-kernel`**.

SensOS SHALL NOT implement or duplicate:

- Governance Engine
- Workspace Manager
- Goal Manager
- Goal Arbitration
- Intent Decomposition

Those components belong exclusively to the canonical NVS-Kernel.

SensOS is responsible for:

- Observation Runtime
- Runtime orchestration
- KernelGateway
- Product integration
- Gateway
- Dashboard
- External services

**KernelGateway is the exclusive integration boundary between SensOS and the
Kernel Executive.**

## Architectural Principles

1. Canonical implementation lives in `GemminAI/nvs-kernel`.
2. SensOS adapts to the canonical Kernel API. The Kernel API is never adapted
   to SensOS.
3. Kernel Executive remains an internal service. It is not exposed directly
   through the public Gateway unless approved by a future ADR.
4. Observation Runtime communicates with the Kernel Executive only through
   `KernelGateway`.
5. No duplicate Governance, Workspace, or Goal implementations may exist
   inside SensOS.
6. API compatibility hacks (shims, dead-path fallbacks) are prohibited.
7. Interface changes require ADR/RFC approval.

## Validated By

- [RFC-SensOS21](/rfc/RFC-SensOS21) — Semantic Governance Architecture & Policy/Law Hierarchy
- [RFC-SensOS22](/rfc/RFC-SensOS22) — Workspace / domain boundary separation
- [RFC-SensOS23](/rfc/RFC-SensOS23) — Goal Manager
- EXP-8000 (Canonical Integration Validation) — 256 tests passing against
  `GemminAI/nvs-kernel`'s Governance/Workspace/Goal Manager implementation
- Ubuntu Live Integration Verification — SensOS ↔ NVS-Kernel reachability
  confirmed over HTTP/ABI on a colocated GCP/Ubuntu host
- Live End-to-End Runtime Validation — a real (non-mocked) `nvs-kernel`
  process exercised through `KernelGateway.observe()`, including a
  cycle-advancement check proving statefulness

## Consequences

This ADR establishes a permanent architectural boundary. Future environments
— including Ubuntu, RunPod, Apple MLX, MCP, and Cloud Runtime deployments —
must integrate with the canonical NVS-Kernel using the same `KernelGateway`
contract described here. This ADR becomes the reference architecture for
future integrations.

Any documentation still referencing `/kernel/ingest` or
`/kernel/v2/observations` as live endpoints is stale and must be corrected to
the canonical API above.
