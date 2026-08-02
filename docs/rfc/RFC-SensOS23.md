---
title: Goal Management Principles
status: Active
category: Kernel architecture
version: "1.2.0"
updated: 2026-08-02
repository: TBD — public SensOS repository
supersedes: []
superseded_by: []
related:
  - RFC-SensOS21
  - RFC-SensOS22
  - RFC-NVS-0204
---

## Abstract

This public RFC describes the enterprise-visible principles of goal management in SensOS: competing goals are arbitrated, decomposed into executable work, and cancelled safely when superseded.

Internal state machines, scoring formulas, private method names, and experimental validation identifiers are maintained in access-controlled internal design documents.

## Purpose

Ensure AI runtime work remains:

1. **Purposeful** — execution is bound to declared goals.
2. **Arbitrable** — conflicts are resolved by policy, not by race.
3. **Cancellable** — superseded work can be stopped without leaving unsafe partial effects untracked.
4. **Auditable** — goal decisions leave durable evidence.

## Public guarantees

1. A runtime MUST associate privileged execution with an authorized goal context.
2. Goal arbitration MUST be deterministic with respect to declared policy inputs.
3. Cancellation MUST fail closed when unauthorized.
4. Decomposition into executable work MUST pass governance checks before privileged side effects.

## Out of scope (public)

Scoring equations, threshold constants, internal APIs, cascade algorithms, and experiment identifiers.

## Related RFCs

- RFC-SensOS21 — Semantic Governance Architecture
- RFC-SensOS22 — Domain Boundary Separation
- RFC-NVS-0204 — SensOS Runtime Constitution
