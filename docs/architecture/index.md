# Architecture

SensOS is an observation-centered runtime platform. Constitutional rules live in the RFC series; this section maps those norms onto the system stack.

## Kernel Executive Layer

```
Governance
    ↓
Goal Manager
    ↓
Workspace
    ↓
Runtime
```

- **Governance** ([RFC-SensOS21](/rfc/RFC-SensOS21)) — the Law/Policy hierarchy and pre-execution validation engine; the final gate every Directive and Instruction must pass.
- **Goal Manager** ([RFC-SensOS23](/rfc/RFC-SensOS23)) — arbitrates conflicting Goals and decomposes an accepted Goal into Directives and Instructions.
- **Workspace** ([RFC-SensOS22](/rfc/RFC-SensOS22)) — the execution-environment container (Context, ProcessState, RuntimeObjects, CachingSubsystem) a Goal's Instructions run inside.
- **Runtime** — the R0–R7 Observation→Control pipeline (RFC-SensOS12–19) and its Kernel managers (Cache, Memory, Knowledge, Observation, Resource) that Workspace and Goal Manager sit above.

Reference implementation: [`GemminAI/nvs-kernel`](https://github.com/GemminAI/nvs-kernel), validated by the EXP-8000 integration suite.
