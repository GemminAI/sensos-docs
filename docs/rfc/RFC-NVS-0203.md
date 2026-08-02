---
title: SensOS Distributed Runtime Protocol
status: Proposed
category: Distributed-runtime protocol
version: "1.1.0"
updated: 2026-08-02
repository: TBD — public SensOS repository
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0199
  - RFC-NVS-0200
  - RFC-NVS-0201
  - RFC-NVS-0202
---

## Abstract

The SensOS Distributed Runtime Protocol (SDRP) enables observation, authorization, and governed execution to span physical network boundaries while preserving security and budget accountability.

This public RFC describes **goals, security guarantees, and interoperability expectations**. Wire layouts, header encodings, metadata keys, and resume-frame formats are published only in the Partner Specification under NDA.

## Purpose

Allow SensOS deployments to:

1. Discover and authenticate distributed runtime nodes.
2. Invoke remote capabilities without pretending the network is local.
3. Propagate authorization and resource budgets across trust boundaries.
4. Recover deterministically from durable canonical artifacts.
5. Enforce residency and attestation constraints for regulated workloads.

## Scope

**In scope (public):**

- Protocol goals and threat-relevant guarantees
- Node roles at a conceptual level (edge, compute, kernel-class)
- Authorization and budget accountability requirements
- Interoperability expectations between conformant nodes
- Recovery and residency principles

**Out of scope (not public):**

- Byte-level packet or stream headers
- Concrete metadata key names and binary encodings
- Transport-specific framing details
- Resume opcode layouts and validation-order tables
- Clock-skew numeric windows and nonce algorithms

## Security guarantees

A conformant distributed deployment MUST provide:

1. **Authenticated identity.** Nodes prove identity before accepting privileged work.
2. **Attestation-appropriate trust.** Higher-privilege execution planes require stronger attestation than ingress/edge planes.
3. **Replay-resistant discovery.** Discovery announcements MUST be authentic and resistant to replay/reuse.
4. **Capability continuity.** Remote work MUST carry down-scoped authorization derived from RFC-NVS-0199 principles; raw long-lived credentials MUST NOT be forwarded unchanged.
5. **Budget accountability.** Remaining latency/cost budget MUST be checked before forwarding privileged work.
6. **Trusted residency.** Location or region constraints MUST be verified by trusted attributes, not by unverified self-assertion alone.

## Interoperability

Conformant implementations MUST:

- expose remote invocation as an explicitly asynchronous boundary (timeouts and completion signaling),
- refuse to disguise unbounded network waits as local synchronous ABI calls,
- honor CBAC down-scoping before remote forward,
- support recovery only from durable canonical artifacts at or beyond the canonicalization boundary,
- remain transport-agnostic at the public contract layer (multiple transports MAY be used if they meet the guarantees above).

## Observable behavior

| Concern | Public expectation |
| --- | --- |
| Discovery | Authenticated, replay-resistant node presence |
| Remote call | Asynchronous proxy semantics with explicit failure modes |
| Authorization | Capability-based, down-scoped, tenant-bound |
| Budget | Remaining budget enforced before forward |
| Recovery | Canonical-artifact resume only; no raw nondeterministic resume |
| Residency | Trusted verification required when constraints apply |

## Partner Specification

Byte layouts, header structures, metadata keys, resume protocol encoding, and transport binding tables are defined in:

**Partner Specification: SDRP Wire Protocol** (NDA)

Public integrators SHOULD depend only on this RFC’s guarantees and on approved partner documentation for on-the-wire conformance tests.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
