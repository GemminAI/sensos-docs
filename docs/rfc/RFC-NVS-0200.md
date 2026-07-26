---
title: NVS Model Context Protocol and Layer-Port ABI
status: Proposed
category: Architecture and runtime interface
version: "1.0.0"
updated: 2026-07-26
repository: GemminAI/nvs-runtime
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0199
  - RFC-NVS-0201
  - RFC-NVS-0203
---

## Abstract

This specification defines L-Ports and the language-neutral L-ABI used to form SensOS perception, reasoning, and control pipelines. An L-Port is a self-describing runtime interface, represented by a `type: port` HEXT object. The protocol exposes ports to MCP-compatible clients through discovery, inspection, and invocation operations.

## Layer contract

| Layer | Input | Output | Responsibility |
| --- | --- | --- | --- |
| L0 | raw stream | `L0_RawPayload` | multimodal ingestion |
| L1 | raw payload | `L1_ObservationObject` | source, time, and confidence metadata |
| L2 | observation | `L2_SemanticFeature` | semantic annotation |
| L3 | semantic feature | `L3_HEXTObject` | canonicalization and immutable storage |
| L4 | canonical HEXT | `L4_GeometricState` | distance, curvature, and velocity |
| L5 | geometric state | `L5_RiskBeliefState` | belief and safety-boundary evaluation |
| L6 | risk/belief state | `L6_ControlCommand` | cybernetic control decision |
| L7 | control command | `L7_ExecutionOutcome` | policy application and outcome reporting |

A port descriptor MUST include an identifier, layer, semantic version, input and output type/schema, capabilities, provider, and ABI version. Binding is permitted only when adjacent contracts and ABI versions are compatible and CBAC authorizes the required action.

## MCP surface

The server MUST provide `discover_ports`, `inspect_port`, and `invoke_port`. DLNP extends this surface with negotiation and pipeline-lifecycle operations. The server MUST return only ports and operations that the caller is permitted to inspect or use.

## L-ABI requirements

The native ABI uses C-compatible, versioned structures. Every extensible structure MUST begin with `struct_size` and `abi_version`. A packet contains a timestamp, serialized payload, and an optional 32-byte `content_id`. `content_id` MUST be absent or all-zero before L3 canonicalization and MUST be the SHA-256 identifier of the canonical HEXT object at L3 and later.

On successful invocation, the provider allocates the output packet. The caller MUST release it through that provider's `free_packet` callback and MUST NOT free it through another allocator. Receivers MUST ignore fields beyond the recognized `struct_size`.

## Canonicalization

Raw L2 output and canonical HEXT identity are different concepts. The L3 Canonicalizer MUST transform structured features into a defined canonical form, such as sorted keys, excluded nondeterministic fields, and specified numeric rounding, before computing `content_id`. Implementations MUST NOT claim independently generated model text has the same identity without this transformation.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
