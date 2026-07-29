---
title: Semantic Governance Architecture & Policy/Law Hierarchy Specification
status: Active / Implemented
category: Kernel governance and constraint validation
version: "1.0.0"
updated: 2026-07-30
repository: GemminAI/nvs-kernel
supersedes: []
related: ["RFC-SensOS22", "RFC-SensOS23"]
---

## Implementation Status

**Reference Implementation:** [`GemminAI/nvs-kernel`](https://github.com/GemminAI/nvs-kernel)

**Validation:** EXP-8000 Integration Validation — PASS

**Quality Gates**

- Ruff — PASS
- MyPy Strict — PASS
- Pytest — 256 passed
- Regression — None

Implemented: `RuleLevel`, `Law`, `Policy`, `GovernanceEngine` (`nvs_kernel/governance/`).

---

## Abstract

This specification defines the logical structure of the Kernel Executive's top-level **Governance Layer**, and the strict separation model between absolute constraints (Law) and adaptable operating policy (Policy). It resolves the opacity and ambiguity of "prompting policy" in conventional LLM agent systems by organizing rules of differing bindingness into a seven-tier hierarchy: Vision, Mission, Law, Policy, Goal, Directive, Instruction.

## Three-Tier Layer Architecture

SensOS classifies every Kernel subsystem and entity into three responsibility layers:

1. **Governance Layer** — Vision, Mission, Law (External / Organizational / Kernel), Policy (Resource / Model Routing / Security / Cost), Goal (see RFC-SensOS23)
2. **Execution Layer** — Directive, Instruction, Workspace (RFC-SensOS22), Process (RFC-SensOS19), Scheduler
3. **Runtime Layer** — Memory (RFC-SensOS13), Cache (RFC-SensOS22), Observation (RFC-SensOS16), Knowledge/HEKB (RFC-SensOS17), Resource Manager

> This "Runtime Layer" is a Kernel-manager classification axis, distinct from the R0–R7 Observation→Control pipeline defined by RFC-SensOS12–19. The two must not be conflated.

## Seven-Tier Semantic Rule Hierarchy

| Level | Rule Kind | Bindingness | Responsibility |
| :---- | :---- | :---- | :---- |
| L1 | Vision | Permanent, top-level | The system's reason for existing and long-term values |
| L2 | Mission | Purpose / mid-to-long-term | Concrete mission a system or tenant must achieve |
| L3 | Law | **Inviolable** | A rule that must never be broken by any exception or optimization |
| L4 | Policy | **Adaptable** | Operating policy adjustable to budget, performance, environment |
| L5 | Goal | Task-dependent, dynamic | Target to be achieved in a session/project (RFC-SensOS23) |
| L6 | Directive | Execution-plan level | Abstract action plan an agent formulates to reach a Goal |
| L7 | Instruction | Atomic-command level | Smallest execution step: tool call, prompt output, memory write |

> This L1–L7 scale is unrelated to the `nvs-kernel` Control Tier (`Tier.L0_NONE`…`Tier.L7_HALT`). The two share only overlapping digits, not meaning.

### Law categories

- **External Law** — public regulation (GDPR, EU AI Act, copyright law, industry standards)
- **Organizational Law** — internal rules (security policy, contract terms, NDAs)
- **Kernel Law** — the SensOS constitution (Kernel Constitution, binding RFC clauses, physical/ethical safety guardrails)

### Policy categories

Resource, Scheduling, Cache, Model Routing, Security, Cost.

## Pre-Execution Validation Flow

Before an Instruction reaches physical execution (Runtime Layer), the governance validation engine runs a bottom-up constraint check:

```
Valid(I) = LawCheck(I) ∧ PolicyCheck(I) ∧ GoalCheck(I)
```

Order: Goal/Directive validation → Policy validation → Law validation (the final, absolute gate).

### Violation handling

- **Law Violation** — unconditional Abort, regardless of Goal or Policy pressure. Recorded as a Kernel Fault; context is discarded.
- **Policy Violation** — may be exceptionally overridden by a privileged process (emergency debugging, manual override, priority exception).

## Relationship to Other RFCs

- **RFC-SensOS22 (Domain Separation)** adopts this Governance/Execution/Runtime three-layer split and reorganizes Kernel manager responsibilities around it.
- **RFC-SensOS23 (Goal Manager)** tracks, decomposes, and evaluates this specification's L5 Goal level, expanding it into Directives.

---

## Validated by

**EXP-8000** — Law Enforcement Primacy (EXP-8001): a CRITICAL-priority Goal whose plan violates a registered Law is unconditionally rejected (`FAILED`), independent of priority.
