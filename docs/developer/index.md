# Developer Docs

Build against **public interface standards**.

## Start here

1. Read the product overview on the [home page](/).
2. Browse [Public RFCs / Standards](/rfc).
3. Follow the RFC philosophy: integrate to **WHAT** (ABI, lifecycle, guarantees, conformance) — never depend on unpublished HOW.

## Public RFC philosophy

Public RFCs describe:

- API / ABI behavior
- lifecycle and compatibility
- guarantees and conformance

They never publish:

- algorithms
- wire layouts / token grammar
- calibration or optimization
- kernel internals or roadmaps

See `docs/public/RFC_PHILOSOPHY.md` in the repository.

## Access tiers

| Need | Where |
| --- | --- |
| Public interoperability | This site + Public RFCs |
| Wire / token annexes | Partner specifications (NDA) |
| Diligence packs | [Enterprise](/enterprise) |
| Internal design | Not published |

## Contribution

Contributions to public RFCs must preserve the WHAT-not-HOW boundary. Implementation details belong in partner, enterprise, internal, or trade-secret tiers — not in public pull requests.
