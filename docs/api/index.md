# API Reference

API and ABI surfaces for SensOS / NVS Runtime consumers.

## Contract layers

| Layer | Kind | Normative RFC |
|---|---|---|
| Observation | Data / wire ABI | [RFC-0200](../rfc/RFC-0200.md) |
| Projection | Provider ABI | [RFC-0201](../rfc/RFC-0201.md) |
| Runtime Bridge | Isolation interface | [RFC-0202](../rfc/RFC-0202.md) |
| Constraint Boundary | Boundary oracle API | [RFC-0203](../rfc/RFC-0203.md) |
| Verification | Evaluation protocol | [RFC-0100](../rfc/RFC-0100.md) |

## Conceptual API groups

### Observation

```text
Observation
ObservationSource
Annotation
AnnotatedObservation
```

See [RFC-0200](../rfc/RFC-0200.md) for normative field ownership and non-goals.

### Projection Provider

```text
ProjectionProvider.project(annotated_observation) -> coordinates / trajectory features
```

See [RFC-0201](../rfc/RFC-0201.md). Calibration and benchmarks are governed by the 01xx verification cluster ([RFC-0100](../rfc/RFC-0100.md)).

### Kernel primitives (conformance-facing)

```text
NVS.SysObserve
NVS.SysNavigate
```

Required for CORE conformance under [RFC-0001](../rfc/RFC-0001.md). Exact signatures evolve with Accepted / Implemented RFCs.

## Reference implementation

Executable APIs live in:

- [https://github.com/GemminAI/nvs-runtime](https://github.com/GemminAI/nvs-runtime)

This portal documents contracts and mapping only.

## Stability

| Lifecycle (RFC_MAP) | API expectation |
|---|---|
| Draft / Planned | Unstable |
| Accepted / Partial | Review-bound; breaking changes possible |
| Implemented / CI Verified | Compatibility expected within minor versions |
| Released | Normative for public consumers |

## Related

- [Architecture](../architecture/index.md)
- [Runtime](../runtime/index.md)
- [Tutorials](../tutorials/index.md)
