# Public RFC Philosophy — WHAT, not HOW

SensOS publishes **interface standards**, not implementation manuals.

## Public RFCs MUST describe

| Allowed | Examples |
| --- | --- |
| Purpose | Why the contract exists |
| Guarantees | Security, safety, interoperability promises |
| Observable behavior | What integrators can rely on at the boundary |
| ABI / API behavior | Fields, lifecycles, error classes |
| Compatibility | Versioning and reserved values |
| Conformance | Edge / Standard / Enterprise observable tiers |
| State machines (external) | Public lifecycle states only |

## Public RFCs MUST NEVER describe

| Forbidden | Examples |
| --- | --- |
| Algorithms | Scoring formulas, solver methods, optimized evaluation |
| Kernel internals | Manager class graphs, private methods |
| Schedulers / optimizers | Placement heuristics, precision tuning |
| Execution strategy | Hardware mapping and proprietary runtime methods |
| Calibration | Thresholds, TTLs, windows, coefficients |
| Wire encodings | Token grammar, packet layouts, magic bytes |
| Roadmaps | Future RFC numbers, unfinished feature lists |
| Implementation notes | File paths, experiment IDs, “not yet implemented” |

## Publication rule

If a sentence helps a competitor rebuild the product faster than it helps a customer integrate safely, it does not belong in a public RFC.
