---
title: SensOS Distributed Runtime Protocol
status: Proposed
category: Distributed-runtime protocol
version: "1.0.0"
updated: 2026-07-26
repository: GemminAI/nvs-runtime
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0199
  - RFC-NVS-0200
  - RFC-NVS-0201
  - RFC-NVS-0202
---

## Abstract

SDRP extends DLNP across physical network boundaries. It specifies node attestation, replay-resistant discovery, asynchronous remote L-Ports, budget propagation, and deterministic recovery boundaries.

## Nodes and discovery

Edge (L0–L1) and compute/semantic (L2–L3) nodes require Level 1 identity attestation: mTLS 1.3 plus an Ed25519 node signature. Kernel nodes (L4–L7) require Level 2 hardware-enclave remote attestation.

A signed `node_announce` MUST include node identity, attestation level, endpoints, active ports, timestamp, sequence number, and nonce. Receivers MUST verify the signature, reject announcements outside the configured clock-skew window, and reject non-monotonic sequences or reused nonces.

## Remote invocation and authorization

A remote L-Port is represented by an asynchronous proxy with an explicit timeout and completion callback. A remote call MUST NOT disguise indefinite network waiting as a synchronous ABI operation. Before forwarding a request, the sender MUST issue a CBAC down-scoped hop as defined in RFC-NVS-0199.

gRPC control traffic carries serialized budget and capability context in `sensos-budget-bin`. The QUIC data-stream header is 40 bytes: version, flags, two reserved bytes, maximum latency (uint16), accumulated latency (uint16), and the 32-byte `root_token_hash`. Implementations MUST validate header version and remaining budget before forwarding.

## Recovery and residency

`RESUME_FROM_CONTENT_ID` is permitted only for a canonical L3-or-later HEXT object. It MUST NOT be used for raw or nondeterministic L2 output. Region constraints supplied to distributed planning MUST be verified through trusted attestation attributes or a trusted location-verification mechanism; node self-reporting alone is insufficient.

When reliable clock synchronization is unavailable, a node MAY estimate a link contribution from half of a recent round-trip time, while marking the result as an estimate for governance and audit purposes.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
