---
title: Goal Manager & Intent Decomposition Protocol Specification
status: Active / Implemented
category: Kernel goal arbitration and intent decomposition
version: "1.1.0"
updated: 2026-07-30
repository: GemminAI/nvs-kernel
supersedes: []
related: ["RFC-SensOS21", "RFC-SensOS22"]
---

## Implementation Status

**Reference Implementation:** [`GemminAI/nvs-kernel`](https://github.com/GemminAI/nvs-kernel)

**Validation:** EXP-8000 Integration Validation — PASS

**Quality Gates**

- Ruff — PASS
- MyPy Strict — PASS
- Pytest — 256 passed
- Regression — None

Implemented: `GoalManager`, `GoalNode`, `GoalStatus` (9 states), `GoalArbitrationEngine`, `IntentDecomposer` Protocol, `GoalEvaluator` Protocol (`nvs_kernel/goal/`).

**Additional implementation** (added following EXP-8000 results): Priority-based Batch Arbitration (`GoalManager.arbitrate_batch`), Recursive Cascading Cancellation (`GoalManager._cascade_cancel`).

---

## Abstract

This specification defines the standard structure of the **Goal Manager**, which governs purposeful behavior in the SensOS Kernel Execution Layer; the **Goal Arbitration Engine**; and the Intent Decomposition Protocol. It receives the semantic rule hierarchy (Vision, Mission, Law, Policy, Goal) defined by RFC-SensOS21, arbitrates conflicts/dependencies/priority among multiple Goals (Goal Arbitration), and progressively decomposes the result into concrete **L6 Directives** and **L7 Instructions**. It also centrally manages dynamic execution tracking (Goal Tracking) and achievement evaluation (Goal Evaluation).

## End-to-End Semantic Pipeline

```
Vision → Mission → Law → Policy → Goal → Directive → Instruction → Runtime
```

## Core Principles

1. **Stepwise Decomposition** — a Goal is never a direct code-execution instruction. It is decomposed hierarchically into Directives, and finally reduced to atomic Instructions.
2. **Scheduler vs. Arbitration** — the Scheduler decides *when* to run something (execution ordering); the Goal Arbitration Engine decides *which* intent to adopt, prioritize, merge, or reject (intent conflict/compatibility).
3. **Continuous Goal Re-evaluation** — the Goal Tree is continuously evaluated against environmental change (Observation stream updates, external errors), triggering Dynamic Replanning where needed.
4. **Governance Alignment** — every generated Directive and Instruction must pass RFC-SensOS21's governance validation engine (Law Check / Policy Check) before and after execution.

## Goal Lifecycle (9 states)

```
Created → Arbitrating → Decomposing → Evaluating Governance → Executing → Goal Evaluation → Completed
                │                │                   │              │            │
                ▼                ▼                   ▼              ▼            ▼
            Cancelled          Failed              Failed         Failed    (unmet → Decomposing, re-plan)
```

1. **Created** — an L5 Goal generated externally (user/system/policy).
2. **Arbitrating** — under Priority/Dependency/Conflict evaluation by the Goal Arbitration Engine.
3. **Decomposing** — building the L6 Directive set and L7 Instruction DAG from the arbitrated Goal.
4. **Evaluating Governance** — RFC-SensOS21's pre-execution validation (Law/Policy).
5. **Executing** — Instructions dispatched to an Agent process, work proceeding on a Workspace.
6. **Goal Evaluation** — evaluating intermediate/final results; unmet target transitions back to Decomposing (re-plan).
7. **Completed / Failed / Cancelled** — terminal states.

## Goal Arbitration Engine — five duties

1. **Priority Resolution** — judge precedence between Goals per tenant/user authority and Policy.
2. **Dependency Resolution** — block a Goal until its prerequisite Goals reach `Completed`.
3. **Mutual Exclusion** — prevent simultaneous execution of contradictory Goals.
4. **Goal Merge** — fold multiple Goals requesting the same artifact/intermediate operation into one Goal Tree.
5. **Goal Cancellation** — revoke a Goal invalidated by a parent Goal, a governance change, or trade-off loss.

## Data Structures

```
enum GoalOrigin { User, System, Policy, External }
enum GoalPriority { Critical, High, Normal, Low, Background }

struct GoalNode {
    id: UUID
    tenant_id: TenantID
    workspace_id: WorkspaceID
    level: RuleLevel            // L5 Goal, L6 Directive, L7 Instruction
    origin: GoalOrigin
    priority: GoalPriority
    intent_statement: String
    constraints: List<PolicyRef>
    dependencies: List<UUID>
    conflicts: List<UUID>
    parent_goal_id: Optional<UUID>
    sub_nodes: List<GoalNode>
    status: GoalStatus
    deadline: Optional<Timestamp>
    evaluation_criteria: EvaluationMetric
}
```

### Decomposition and evaluation pipeline

1. **Top-Down Intent Decomposition** — split a high-order Goal into Directives.
2. **Instruction Lowering** — convert each Directive into a DAG of atomic Instructions.
3. **Bottom-Up Evaluation** — `Score(G) = Σ w_k · Evaluate(D_k)`; a Goal is `Completed` once its score exceeds a defined threshold `θ_complete`.

> Splitting a Goal into Directives, and per-Directive evaluation, are domain/LLM-dependent planning problems. This repository ships them as `IntentDecomposer`/`GoalEvaluator` interfaces (Protocols) only — no concrete decomposition or evaluation logic is implemented. `Score(G)` itself is a plain deterministic weighted sum and is fully implemented.

## Interfaces to Other Subsystems

- **RFC-SensOS21 (Governance Manager)** — requests Law/Policy arbitration criteria and pre-validation of Directives/Instructions.
- **RFC-SensOS22 (Workspace Manager)** — requests Workspace isolation and Context binding for a Goal's execution unit.
- **RFC-SensOS19 (Process Manager)** — dispatches the generated Instruction DAG to Agent processes, bound to priority-based task queues.

## Future Standardization Roadmap

- **RFC-SensOS21** — Semantic Governance Architecture (established)
- **RFC-SensOS22** — Domain Boundary Separation & Kernel Manager Architecture (established)
- **RFC-SensOS23** — Goal Manager & Intent Decomposition Protocol (this specification)
- **RFC-SensOS24** — Workspace Context Switching & Suspension Protocol (next)

---

## Validated by

**EXP-8000** — Multi-Goal Arbitration & Conflict Resolution (EXP-8002): deterministic priority-based resolution of mutually-exclusive Goals. Dynamic Decomposition & Cascading Cancellation (EXP-8003): cancelling a parent Goal recursively cancels every descendant Directive/Instruction, leaving no orphaned executing state.
