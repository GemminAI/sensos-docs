---
title: Domain Boundary Separation
status: Active
category: Kernel architecture
version: "1.2.0"
updated: 2026-08-02
repository: TBD — public SensOS repository
supersedes: []
superseded_by: []
related:
  - RFC-SensOS21
  - RFC-SensOS23
  - RFC-NVS-0204
---

## Abstract

This public RFC describes the enterprise domain-boundary model used by SensOS to separate tenants, projects, workspaces, and agent execution contexts.

Detailed kernel manager architecture, internal module inventories, implementation status notes, and roadmap identifiers are maintained in access-controlled internal design documents.

## Purpose

Give enterprise operators a clear ownership model:

- **Tenant** — commercial and isolation boundary
- **Project** — knowledge and policy boundary
- **Workspace** — execution boundary
- **Agent / Context** — runtime work boundary

## Public guarantees

1. Work belonging to one tenant MUST NOT be readable or controllable by another tenant without explicit administrative authorization.
2. Execution context state is scoped to a workspace.
3. Durable knowledge and ephemeral runtime state are distinct concerns.
4. Public APIs MUST fail closed across domain boundaries.

## Out of scope (public)

Internal manager decomposition, scheduler design, paging/swap protocols, unimplemented-feature lists, and future RFC roadmaps.

## Related RFCs

- RFC-SensOS21 — Semantic Governance Architecture (public summary / enterprise detail)
- RFC-SensOS23 — Goal management principles (public summary)
- RFC-NVS-0204 — SensOS Runtime Constitution
