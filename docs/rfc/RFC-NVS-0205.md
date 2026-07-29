---
title: NVS-Kernel Architecture
status: Proposed
category: Kernel architecture and runtime topology
version: "1.0.0"
updated: 2026-07-29
repository: GemminAI/nvs-kernel
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0204
  - RFC-NVS-0206
  - RFC-NVS-0207
---

## Abstract

This document formalizes the concrete architecture of the SensOS Kernel that sits inside the Compiler-OS band established by RFC-NVS-0204: its central coordinating structure (the Kernel Executive), the ownership boundaries of its seven subsystems, the Observation Driver Framework as the Kernel's plug-in slot for deterministic measurement signals, and the five-region memory model that serves as the Kernel's Runtime State Space container.

## Purpose

RFC-NVS-0204 fixes that SensOS occupies the Compiler-OS band and that this band internally splits into a stateless Compiler and a stateful Kernel. This document is the architectural root of that Kernel: it names the Kernel's coordinating structure, assigns each subsystem a fixed responsibility, defines the plug-in contract by which deterministic measurement signals enter the Kernel, and defines the memory regions that hold Kernel-managed state across a Trajectory's lifetime. It formalizes content from three primary sources:

- **[SensOS12]** — the Kernel Architecture root: the Kernel Executive, the Subsystem Ownership Table, and the seven Kernel design principles.
- **[SensOS16]** — the Observation Driver Framework: the plug-in ABI and four-phase lifecycle by which deterministic modules (curvature, entropy, topology, and cross-observation memory signals) produce Observations.
- **[SensOS13]** — Memory Management: the five Kernel-owned memory regions and their lifetime, mutability, and ownership rules.

## Scope

**In scope:** the Kernel Executive as a coordinating structure (not a single feedback loop); the seven-subsystem ownership boundary and what each subsystem does and does not own; the call discipline governing cross-subsystem interaction; the Observation Driver plug-in ABI and its four-phase lifecycle (Load, Register, Observe, Unload); the naming, role, and theoretical basis of the four reference Observation Drivers; the five Kernel memory regions and their lifetime/mutability/durability/ownership properties; the boundary between this Kernel and its Compiler and Semantic Runtime neighbors.

**Out of scope:** the exact mathematical definition, closed-form formula, or calibration of any Observation signal (curvature, entropy, topology, or memory-continuity) — owned by the sibling NVS-MATH series referenced in §"Related RFCs"; the Core ABI's binary layout — owned by the SensOS Compiler series; on-disk serialization format — owned by the Kernel's Semantic File System subsystem; concrete security cryptographic primitives, boot sequencing detail, and process-scheduling algorithms — each owned by its respective subsystem specification, referenced but not restated here; product- or business-level mapping — out of scope for a Kernel-band document per RFC-NVS-0204.

## Dependencies

- **[SensOS12]** — `RFC-SensOS/RFC-SensOS12_Kernel_Architecture_v2.2.md`
- **[SensOS16]** — `RFC-SensOS/RFC-SensOS16_Observation_Driver_Framework_v2.2.md`
- **[SensOS13]** — `RFC-SensOS/RFC-SensOS13_Memory_Management_v2.0.md`
- **RFC-NVS-0204** — SensOS Runtime Constitution (this document's governing charter; establishes the Compiler-OS/Kernel/Semantic-Runtime boundary this document operates within).

## Definitions

- **Kernel Executive.** The Kernel's central coordinating structure: not a single controller with one feedback loop, but a set of cooperating subsystem managers behind a stable service boundary, each independently replaceable [SensOS12 §4].
- **Subsystem.** One of seven fixed areas of Kernel responsibility, each owned by exactly one specification and exposed only through the Kernel's service surface: Boot & Init, Memory Manager, Security Reference Monitor, Observation Driver Manager, Semantic I/O Manager, Kernel Services, and Process Manager [SensOS12 §5].
- **Observation.** The Kernel's primary unit of work — a measurement of a semantic state, produced by an Observation Module and validated before being treated as evidence. The Kernel schedules and protects Observations; it does not interpret what they mean [SensOS12 §3].
- **Observation Driver (Observation Module).** A deterministic, non-LLM plug-in that produces an Observation from a bounded view of semantic state. Architecturally analogous to a loadable kernel module: it declares its input/output capabilities, and implements a fixed lifecycle contract [SensOS16 §1, §3].
- **Runtime State Space container.** The set of Kernel-owned memory regions that collectively hold a running system's semantic state across a Trajectory's lifetime — its "where does state live between invocations." Formalized here as five regions (Semantic Stack, Semantic Heap, Observation Cache, Trajectory Memory, Crystallized Memory); their formal mathematical characterization as a state space is owned by a sibling math specification [SensOS13 §3].
- **Trajectory.** The ordered history of one Semantic Process's states and their committed Observations, addressed by a trajectory identifier [SensOS13 §3.4].
- **Exception Runtime.** The bounded, per-fault escalation path (outside the Kernel) invoked only when a deterministic subsystem or Observation Driver cannot resolve a case; never on the Kernel's steady-state path [SensOS12 §3].

## Mathematical assumptions

This document assumes, but does not itself define, a Runtime State Space: a space in which a system's semantic state at a point in time is a well-defined element, and in which a sequence of such elements over time forms a Trajectory. The Kernel's five memory regions (§"Normative requirements") are the operational container for that space — each region holds a bounded, well-defined subset of a Trajectory's state (working execution context, immutable historical objects, pending measurements, ordered history, and sealed/committed evidence, respectively) — but this document makes no claim about the space's dimensionality, distance structure, or geometry.

The Kernel further assumes that every Observation Driver signal (curvature, entropy, topological structure, cross-observation continuity) is a well-defined, deterministic function of its declared input view: identical input MUST yield identical output [SensOS12 §3 Deterministic First]. This document states that such functions exist and are deterministic; it does not state what they compute.

> **Private implementation note:** The exact functional form, derivation, and calibration of every Observation signal named in this document (curvature, entropy, topology, cross-observation memory-continuity) — and the formal definition of the Runtime State Space itself (its coordinates, metric structure, and geometric properties) — are proprietary to NVS-Kernel and maintained in the private NVS-Kernel documentation and the sibling NVS-MATH series. This public specification defines only each signal's name, role, domain, and the invariant that it is deterministic and total (it either returns a valid Observation or a structured error — never a silent best-effort guess).

## Normative requirements

**Kernel Executive and subsystem boundary**

1. The Kernel Executive MUST be organized as a set of independently replaceable subsystem managers behind a stable service boundary; it MUST NOT be implemented as a single monolithic feedback loop [SensOS12 §4].
2. Each of the seven Kernel subsystems (Boot & Init, Memory Manager, Security Reference Monitor, Observation Driver Manager, Semantic I/O Manager, Kernel Services, Process Manager) MUST have exactly one owning specification, and MUST NOT have its responsibility duplicated or forked by another subsystem [SensOS12 §5].
3. A Semantic Runtime component MUST interact with the Kernel exclusively through the Kernel Services surface; direct linkage against another subsystem's internals is non-conformant [SensOS12 §6.1].
4. Every cross-subsystem call, including calls internal to the Kernel Executive, MUST cross the Security Reference Monitor. No subsystem, including the Executive itself, MAY bypass this check [SensOS12 §6.2–§6.3].
5. The Kernel MUST be able to complete a full Observation cycle — drive a module, validate the result, commit it — with no network dependency. A remote/cloud path MAY exist as an escalation, but MUST NOT be required for baseline operation [SensOS12 §3 Edge First].
6. An LLM or other non-deterministic component MUST NOT sit on the Kernel's Observation path. It MAY be invoked, at most once per fault, through the Exception Interface, only when a deterministic subsystem or Observation Driver cannot resolve a case [SensOS12 §3 LLM as Exception Handler].
7. The Kernel MUST consume, and MUST NOT redefine, extend, or fork, the Observation contract and Core representation contracts it depends on. Where a Kernel subsystem needs a new field, it MUST propose the extension through the owning contract's own extension mechanism, never a Kernel-local shadow copy [SensOS12 §3 Semantic ABI].
8. Every Kernel subsystem MUST expose a way to verify its own claims independent of trusting its own output (e.g., a memory claim MUST be checkable, a security claim MUST be checkable, a boot claim MUST be checkable) [SensOS12 §3 Verification by Default].

**Observation Driver Framework**

9. An Observation Driver MUST declare its capabilities using the same capability-declaration mechanism the Compiler's Transformation Runtime uses for a Pass; the Kernel MUST NOT define a second, parallel capability-declaration format for drivers [SensOS16 §3].
10. Every Observation Driver MUST implement a fixed lifecycle with exactly four phases — Load, Register, Observe, Unload — and MUST implement a single mandatory entrypoint contract producing Observation-shaped output [SensOS16 §1, §4].
11. An Observation Driver's `observe` operation MUST receive only the bounded view its declared capabilities resolve to, never an unrestricted view of full semantic state (principle of least-privilege memory access) [SensOS16 §3].
12. An Observation Driver MUST return either a candidate Observation or a structured error; it MUST NOT return a best-effort, low-confidence guess as if it were a valid Observation [SensOS16 §3].
13. A candidate Observation produced by a driver MUST be validated by the Kernel before being treated as committed evidence; a driver MUST NOT itself commit its own output [SensOS16 §3].
14. A driver that faults repeatedly beyond an implementation-defined threshold MUST be isolated (quarantined) by the Kernel without requiring a full Kernel restart, and a single driver fault MUST NOT propagate to other active drivers or to the Kernel Executive [SensOS16 §7].
15. This document names, by role and theoretical domain only, four reference Observation Drivers (§"Reference Observation Drivers" below); it MUST NOT and does not state their internal algorithm.

**Memory Management / Runtime State Space container**

16. The Kernel MUST maintain each of the five memory regions (§"Reference Observation Drivers" table below) as a distinct region with its own lifetime, mutability, and durability rule; a region's data MUST NOT silently migrate into another region's semantics [SensOS13 §3–§4].
17. A per-task execution context (Semantic Stack) MUST be cleared unconditionally when its owning task completes or is preempted; it MUST NOT persist past its owning task and MUST NOT itself be treated as durable or hashed evidence [SensOS13 §3.2].
18. An immutable state object, once written into the Kernel's append-only object region (Semantic Heap), MUST NOT be mutated in place; a state change MUST always be represented as a new object [SensOS13 §3.1].
19. A state object MUST NOT be considered readable by a consumer until a valid Observation has been recorded against it [SensOS13 §3.1].
20. Once an Observation and its containing evidence container reach final seal, the corresponding memory MUST become read-only; a correction MUST always take the form of a new, superseding identifier, never an in-place edit [SensOS13 §3.5].

## References

- `RFC-SensOS/RFC-SensOS12_Kernel_Architecture_v2.2.md` — Kernel Architecture v2.2 [SensOS12]
- `RFC-SensOS/RFC-SensOS16_Observation_Driver_Framework_v2.2.md` — Observation Driver Framework v2.2 [SensOS16]
- `RFC-SensOS/RFC-SensOS13_Memory_Management_v2.0.md` — Memory Management v2.0 [SensOS13]

## Reference Observation Drivers

Four Observation Drivers are named by the primary sources. Each is defined here only by its measurement role and theoretical domain of grounding — never by its internal algorithm, which is proprietary (see the Private Implementation Note above) and owned by the referenced sibling NVS-MATH specification.

| Driver | Signal role | Theoretical domain (named, not formalized here) | Sibling math specification |
| :---- | :---- | :---- | :---- |
| `curvature.py` | Produces a scalar geometric signal characterizing a semantic state's local risk/danger-basin structure | Potential-field / danger-basin evaluation (Narrative Physics) | NVS-MATH-0001 (Curvature) |
| `entropy.py` | Produces a scalar signal characterizing epistemic uncertainty / diffusion of a semantic state | Epistemic diffusion characterization (Narrative Physics) | NVS-MATH-0003 (Semantic Metric) |
| `topology.py` | Produces a structural signal characterizing the topological duality/projection of a semantic state | Topological duality projection (Narrative Physics) | NVS-MATH-0002 (Geodesic) and NVS-MATH-0004 (Observation Geometry) |
| `memory.py` | Produces a continuity signal characterizing relationships across multiple Observations of the same Trajectory, rather than a property of a single Observation | Cross-observation continuity | NVS-MATH-0005 (Runtime State Space) |

All four drivers share the same invariant: identical input produces identical output (determinism), and an input the driver cannot confidently resolve MUST produce a structured error rather than a degraded value [SensOS16 §6]. `memory.py` is architecturally distinct from the other three in that its input additionally includes prior Trajectory history, not only the current semantic state [SensOS16 §5].

## Runtime State Space Memory Regions

The five Kernel memory regions that together form the Runtime State Space container [SensOS13 §3–§4]:

| Region | Lifetime | Mutable? | Durable across restart? | Role |
| :---- | :---- | :---- | :---- | :---- |
| Semantic Stack | One scheduled unit of work | Scratch only | No | Per-task working execution context |
| Observation Cache | Draft-to-decision window | Replace only (draft → final/discarded) | No | Holds candidate Observations pending validation |
| Semantic Heap | Process/Trajectory lifetime | No (append-only) | Reconstructable | Holds immutable state objects once written |
| Trajectory Memory | Trajectory lifetime | Append-only | Via the Kernel's persistence subsystem | Ordered, resident history of one Trajectory |
| Crystallized Memory | Indefinite | No | Yes | Read-only view over sealed, committed evidence |

> **Private implementation note:** The exact addressing scheme, handle format, and any numeric identifier-namespace partitioning used internally to implement these regions are proprietary to NVS-Kernel. This public specification defines only each region's name, lifetime, mutability, durability, and role.

## Implementation implications

- A conforming Kernel implementation must expose exactly the seven-subsystem service surface; a Semantic Runtime consumer that reaches into subsystem internals directly (bypassing Kernel Services) is non-conformant regardless of whether it produces correct output.
- A new Observation signal (beyond the four reference drivers) is added by declaring a new driver against the existing plug-in ABI — never by modifying the Kernel Executive, the memory model, or an existing driver's contract. This is the Kernel's designated extension point for new measurement science.
- Any component that computes a new geometric or informational signal about semantic state should look first at whether it can be expressed as a new Observation Driver rather than a new subsystem — subsystems are architecturally expensive (each requires its own ownership boundary, verification path, and Security Reference Monitor integration); drivers are cheap and are the intended extension surface.
- Because the Kernel is required to be edge-capable (no network dependency for baseline operation) and observation-deterministic, implementers should treat any nondeterministic dependency (model calls, external services) as automatically out of the Kernel path and belonging to the Exception Runtime instead.
- The exact mathematics behind any Observation Driver's signal, and the formal geometry of the Runtime State Space, must be sought in the sibling NVS-MATH series (NVS-MATH-0001 through NVS-MATH-0005), not in this document or its implementation.

## Related RFCs

- **RFC-NVS-0204 — SensOS Runtime Constitution.** The governing charter establishing the Compiler-OS/Kernel/Semantic-Runtime boundary this document's Kernel operates within.
- **RFC-NVS-0206 — Runtime Safety Module (Dynamic Abort Kernel).** Sibling Batch-1 document; a Kernel-adjacent safety component that consumes Observation Driver signals (see Reference Observation Drivers, above) to make intervention decisions. This document does not itself define the Runtime Safety Module's contract.
- **RFC-NVS-0207 — Observation ABI.** Sibling Batch-1 document; defines the canonical shape of the Observation objects an Observation Driver (this document's §"Observation Driver Framework") produces.
- **NVS-MATH-0001 (Curvature), NVS-MATH-0002 (Geodesic), NVS-MATH-0003 (Semantic Metric), NVS-MATH-0004 (Observation Geometry), NVS-MATH-0005 (Runtime State Space).** Sibling specifications, drafted in parallel to this batch, that own the exact mathematics this document deliberately does not define for the four reference Observation Drivers and the Runtime State Space container.

## Open Issues / Contradictions

No contradictions were found among the three primary sources for this document; [SensOS12], [SensOS16], and [SensOS13] are mutually consistent, cross-referencing amendments within the same Kernel series and share a single Subsystem Ownership Table.

Two open forward-dependencies are worth surfacing rather than silently assumed resolved:

1. This document normatively defers the exact mathematics of every named Observation signal, and the formal geometry of the Runtime State Space, to the sibling NVS-MATH-0001 through NVS-MATH-0005 series, published alongside this document in the same canonicalization batch. The invariants stated here (determinism, totality, name/role/domain) are the only publicly specified constraints on those signals beyond what the NVS-MATH series itself publishes at interface level.
2. [SensOS16] §8 further defers all concrete Observation *metric name* enumeration (as opposed to signal identity) to a planned Observation Metrics Registry specification, which per the archived source was not yet drafted anywhere in the vault at the time [SensOS16] was written. Until that registry specification exists, driver metrics are registered only provisionally, under an experimental namespace, per [SensOS16] §8 — a constraint this document inherits without resolving.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
