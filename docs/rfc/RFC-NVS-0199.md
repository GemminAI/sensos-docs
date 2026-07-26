---
title: NVS Capability-Based Access Control
status: Proposed
category: Security and capability architecture
version: "1.0.0"
updated: 2026-07-26
repository: GemminAI/nvs-runtime
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0200
  - RFC-NVS-0201
  - RFC-NVS-0202
  - RFC-NVS-GOV-0001
---

## Abstract

This specification defines Capability-Based Access Control (CBAC) for SensOS. A capability authorizes an agent to negotiate, bind, execute, observe, or control a Layer Port within explicit scope, budget, tenant, and expiry limits.

## Security model

Callers present a raw `agent_capability_token` only at an authenticated API or transport boundary. Immutable HEKB objects and audit records MUST contain only `root_token_hash`, defined as SHA-256 of the canonical, signed hop-0 payload. They MUST NOT contain a raw token, bearer secret, or delegable private key.

The authorization engine MUST verify the token signature, tenant binding, expiry, requested scope, resource limits, and revocation state before action. Requested `budget.max_cost_units` MUST not exceed `resource_limits.max_cost_units`; otherwise it returns `ERR_CAPABILITY_LIMIT_EXCEEDED`.

## Token and delegation chain

A token is `cap_tok_v1.` followed by a base64url-encoded canonical payload containing `root_token_hash`, `tenant_id`, `agent_id`, `resource_limits`, and a `delegation_chain`. A hop includes ordinal, issuer, signing-key identifier, scopes, expiry, nonce, signature, and target delegate where applicable.

Hop 0 MUST be signed by the KMS root authority. A later hop MUST be signed by a KMS-certified node key and MAY delegate only to its declared target. The chain MUST contain no more than five hops. Every later hop MUST have subset scopes, a non-increasing expiry, and a lifetime of no more than ten seconds. Receivers MUST validate every signature and issuer/target continuity.

Each authorized node receives a KMS-signed certificate that expires within one hour. A sender MUST create a down-scoped, short-lived hop for remote work and MUST NOT forward its received bearer token unchanged.

## Revocation

Revocation is keyed by `root_token_hash`, not an individual delegated hop. Receivers MUST consult the local revocation cache before use; its refresh interval MUST be shorter than the maximum hop lifetime. Emergency revocation MUST be broadcast as `TOKEN_REVOKED` over SDRP.

## Scope registry

| Scope | Authorized action class |
| --- | --- |
| `scope:L0_ingest` | accept and normalize raw ingress |
| `scope:L1_observe` | create or read observation metadata |
| `scope:L2_annotate` | produce semantic features |
| `scope:L3_store` | canonicalize and persist HEXT objects |
| `scope:L4_execute` | perform semantic geometry |
| `scope:L5_execute` | update belief and evaluate risk boundaries |
| `scope:L6_control` | emit control commands or request explicit fallback |
| `scope:L7_execute` | apply an authorized policy to a target system |
| `scope:pipeline_manage` | plan, bind, observe, and cancel own-tenant pipelines |
| `scope:admin_override` | cross-tenant cancellation and forced teardown |

`scope:L6_control` MUST be exercised only by an enclave-attested control node. Kernel-internal safety fallback is not a client capability.

## Cancellation authorization

A request may cancel a pipeline when its `root_token_hash` equals the recorded owner hash; when its tenant matches and it has `scope:pipeline_manage`; or when it has `scope:admin_override`. All other requests MUST fail with `ERR_AUTHORIZATION_FAILED`.

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
