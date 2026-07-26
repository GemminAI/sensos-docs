# Kernel

Kernel documentation for the SensOS semantic / observation runtime kernel.

## Role

The kernel provides the minimal governable execution core:

- observation and navigation primitives
- trajectory / geodesic handling at the runtime boundary
- hooks for constraint evaluation and safety intervention
- conformance surfaces required by [RFC-0001](../rfc/RFC-0001.md)

## What the kernel is not

- Not a general-purpose language model
- Not an application business-logic layer
- Not a broad knowledge base (see [HEKB](../hekb/index.md) narrowing)

## Kernel concerns vs RFCs

| Concern | Primary RFC | Notes |
|---|---|---|
| Conformance levels (CORE / ENHANCED / ENTERPRISE) | [RFC-0001](../rfc/RFC-0001.md) | Cumulative levels |
| Observation ABI | [RFC-0200](../rfc/RFC-0200.md) | Upstream contract |
| Projection ABI | [RFC-0201](../rfc/RFC-0201.md) | Downstream of annotation |
| Runtime Bridge | [RFC-0202](../rfc/RFC-0202.md) | Isolates non-determinism |
| Constraint boundary | [RFC-0203](../rfc/RFC-0203.md) | Boundary oracle role |
| Projection verification | [RFC-0100](../rfc/RFC-0100.md) | Empirical hypotheses |

## Conceptual call surface

```text
NVS.SysObserve   — map reality/language inputs into observation/projection path
NVS.SysNavigate  — move along geodesic / attractor structure under constraints
```

Exact ABI signatures evolve under the RFC process. Treat this page as orientation; normative detail lives in the RFCs.

## Reference implementation

See [nvs-runtime](https://github.com/GemminAI/nvs-runtime).

## Related

- [Runtime](../runtime/index.md)
- [Architecture](../architecture/index.md)
- [RFC Index](../rfc/index.md)
