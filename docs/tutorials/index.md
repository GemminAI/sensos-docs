# Tutorials

Hands-on guides for working with SensOS documentation and the NVS Runtime reference repository.

## Tutorials

| Tutorial | Audience | Status |
|---|---|---|
| [Portal orientation](../getting-started.md) | Everyone | Available |
| Build this site locally | Contributors | See below |
| Map an implementation claim to RFCs | Reviewers | Outline below |

## Tutorial: Build the docs locally

```bash
git clone https://github.com/GemminAI/sensos-docs.git
cd sensos-docs
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve
```

Open `http://127.0.0.1:8000`.

## Tutorial: Map a claim to RFCs

1. Identify the claim (e.g. “observation boundary is stable”).
2. Find the governing RFC in [RFC Index](../rfc/index.md).
3. Check lifecycle stage in [RFC_MAP](../rfc/RFC_MAP.md).
4. If the stage is Draft / Planned, do **not** treat the claim as Canonical.
5. Link evidence (tests, CI, experiment reports) in a PR description when proposing a status transition.

## Upcoming tutorials

- Consuming Observation ABI types in a client
- Writing a Projection Provider against RFC-0201
- Running conformance checks for CORE level

Contributions welcome via [sensos-docs](https://github.com/GemminAI/sensos-docs).

## Related

- [Getting Started](../getting-started.md)
- [API](../api/index.md)
- [Runtime](../runtime/index.md)
