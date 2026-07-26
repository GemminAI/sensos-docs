---
title: Dynamic Layer Negotiation Protocol
status: Proposed
category: Runtime protocol
version: "1.0.0"
updated: 2026-07-26
repository: GemminAI/nvs-runtime
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0199
  - RFC-NVS-0200
  - RFC-NVS-0202
  - RFC-NVS-0203
---

## Abstract

DLNP enables an authorized client to discover compatible L-Ports, negotiate contracts, build a pipeline plan, bind it, execute it, observe it, and tear it down. It extends RFC-NVS-0200 and relies on RFC-NVS-0199 for every privileged operation.

## Lifecycle

The normative lifecycle is **discovery**, **inspection**, **negotiation**, **planning**, **binding**, **execution**, and **observation/teardown**. A runtime MUST revalidate authorization at binding and before privileged execution; discovery alone does not grant execution rights.

`negotiate_ports` checks source and target contracts, ABI compatibility, transformation requirements, and scopes. `plan_pipeline` selects an eligible topology subject to latency, cost, storage, and policy constraints. `bind_pipeline` creates a runtime pipeline; `unbind_pipeline` releases it; `observe_pipeline` reports health and metrics.

Plans that include a layer MUST require its registered scope from RFC-NVS-0199. For example, an L4 geometry plan requires `scope:L4_execute` and an L3 persistence step requires `scope:L3_store`.

## Lifetime and resources

Negotiation and plan TTLs identify the lifetime of server-side state. They MUST NOT be treated as a capability-token extension. A bind request MUST obey the token's concurrency and cost limits; admission is additionally governed by RFC-NVS-0202.

## Events and transport

The runtime emits `PORT_REGISTERED`, `PORT_OFFLINE`, `PORT_DEGRADED`, and `TOPOLOGY_CHANGED`. SSE is REQUIRED for HTTP/MCP event delivery. WebSocket is RECOMMENDED for bidirectional real-time streams. In-process native plugins MUST receive events through C-ABI callbacks.

On incompatibility or insufficient authorization, the response MUST be non-executable and include a machine-readable error code and unmet requirements.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
