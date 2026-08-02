---
title: NVS Capability-Based Access Control
status: Proposed
category: Security and capability architecture
version: "1.1.0"
updated: 2026-08-02
repository: TBD — public SensOS repository
supersedes: []
superseded_by: []
related:
  - RFC-NVS-0200
  - RFC-NVS-0201
  - RFC-NVS-0202
  - RFC-NVS-GOV-0001
---

## Abstract

This specification defines the public security model for Capability-Based Access Control (CBAC) in SensOS: capabilities authorize negotiate, bind, execute, observe, or control actions within explicit scope, budget, tenant, and time bounds.

This public RFC describes **concepts, guarantees, and observable authorization behavior**. Token syntax, wire encoding, hop grammar, TTL values, and validation-order tables are published only in the Partner Specification under NDA.

## Purpose

Establish a least-privilege authorization model in which:

1. Agents act only with explicitly granted capabilities.
2. Audit records never retain raw bearer secrets.
3. Delegation can narrow authority but cannot expand it.
4. Revocation can invalidate an authorization root efficiently.
5. Enterprise operators can reason about authorization without reading proprietary token encodings.

## Scope

**In scope (public):**

- CBAC concept and security goals
- Separation of bearer presentation vs audit evidence
- Delegation principles (narrowing only)
- Revocation principles
- Scope classes at a conceptual level
- Cancellation authorization principles

**Out of scope (not public):**

- Token prefixes and grammar
- Wire encodings and canonical payload layouts
- Numeric hop limits and TTL constants
- Certificate lifetime constants
- Validation-order algorithms
- Transport broadcast encodings for revocation

## Security model

Callers present a capability credential only at an authenticated API or transport boundary.

Immutable audit and knowledge records MUST store only a non-reversible authorization root reference derived from the root capability. They MUST NOT store raw bearer tokens, delegable secrets, or private keys.

Before privileged action, the authorization engine MUST verify:

- authenticity of the capability,
- tenant binding,
- validity window,
- requested scope,
- resource limits,
- revocation state.

Requested cost/budget MUST NOT exceed granted limits.

## Delegation principles

Delegation is permitted only when it:

1. preserves the same authorization root identity for audit,
2. narrows (never expands) scopes,
3. does not extend validity beyond the parent capability,
4. binds the delegate to an intended target where required,
5. remains short-lived relative to the parent for remote work.

Receivers MUST NOT forward an unchanged long-lived bearer credential across trust boundaries. Remote work MUST use a down-scoped derived capability.

## Revocation principles

Revocation is keyed by the authorization root reference, not by each ephemeral delegate independently. Conformant receivers MUST honor revocation before accepting privileged work. Emergency revocation MUST propagate across the distributed runtime control plane.

## Scope classes (conceptual)

Capabilities are expressed over action classes such as ingest, observe, annotate, store, evaluate, control, pipeline management, and administrative override. Exact scope string registries and enforcement tables are partner-documented.

Administrative override is an exceptional class and MUST be tightly controlled. Kernel-internal safety fallback is not a client-grantable capability.

## Cancellation authorization (conceptual)

A cancellation request is authorized when it is issued by the owning authorization root, by a same-tenant pipeline manager capability, or by an administrative override capability. All other requests MUST fail closed.

## Observable behavior

| Concern | Public expectation |
| --- | --- |
| Presentation | Capability shown only at authenticated boundaries |
| Audit | Root reference only; no raw secrets in durable stores |
| Delegation | Narrowing only; no privilege expansion |
| Remote forward | Down-scoped derived capability required |
| Limits | Budget/scope overruns fail closed |
| Revocation | Root-keyed; checked before use |
| Denial | Unauthorized cancel/execute fails closed |

## Partner Specification

Token grammar, encoding, hop rules, TTL constants, certificate lifetimes, scope string registry, and validation procedures are defined in:

**Partner Specification: CBAC Token Grammar** (NDA)

## Normative keywords

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in RFC 2119 and RFC 8174 when written in uppercase.
