---
title: SensOS Runtime Governance and Resource Management
status: Proposed
category: Operations and governance protocol
version: "1.0.0"
updated: 2026-07-26
repository: GemminAI/nvs-runtime
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0199
  - RFC-NVS-0201
  - RFC-NVS-0203
  - RFC-NVS-GOV-0001
---

## Abstract

This specification governs multi-tenant DLNP pipelines: admission, budget enforcement, cancellation, isolation, and immutable audit evidence. It uses CBAC identity and scope semantics from RFC-NVS-0199.

## Audit objects

The runtime MUST persist an `execution_plan` HEXT object for an admitted plan and a `partial_execution_outcome` HEXT object if a pipeline is cancelled or ends before successful completion. These objects MUST record `root_token_hash`, tenant, budget, topology, negotiation reference, timestamps, and relevant content identifiers. They MUST NOT store a raw capability token.

`content_id` identifies the audit object; `root_token_hash` identifies its authorization lineage. They are independent fields.

## Budget and admission

A budget declares maximum latency, maximum cost units, and priority. The runtime MUST reject requested cost above the capability limit. A deployment MUST publish a deterministic cost-metering policy before treating cost units as enforceable. LLM token processing, kernel occupancy, and stream bytes may be meter inputs, but are not a universal exchange rate without that policy.

The quota engine MUST enforce tenant concurrency and accumulated cost limits. Quota exhaustion returns HTTP 429 or its protocol-equivalent error. L-Port interceptors MUST enforce rate and execution-time limits, and high-cost kernel workloads SHOULD be isolated by OS/resource controls or an equivalent sandbox.

## Cancellation

`cancel_pipeline` requires a raw token at the request boundary and follows the authorization matrix in RFC-NVS-0199. On success the runtime MUST stop further work, release resources, and write a partial outcome when relevant work was performed. Budget expiry is a runtime-initiated cancellation with the same audit requirements.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
