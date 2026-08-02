# RFC Classification Table

Access tiers: **Public** · **Enterprise** · **Partner** · **Internal** · **Trade Secret**

| Document | Tier | Public status after IA | Immediate redaction? |
| --- | --- | --- | --- |
| RFC-NVS-0199 | Public summary / Partner grammar | Public (concept) | **Done** |
| RFC-NVS-0200 | Partner (ABI detail) / Public summary | Public with follow-up scrub | Pending Phase 2 |
| RFC-NVS-0201 | Public | Public Safe | Light review |
| RFC-NVS-0202 | Enterprise | Public with follow-up scrub | Pending Phase 2 |
| RFC-NVS-0203 | Public summary / Partner wire | Public (goals) | **Done** |
| RFC-NVS-0204 | Public | Public Safe | Metadata only |
| RFC-NVS-0205 | Partner | Public with follow-up scrub | Pending Phase 2 |
| RFC-NVS-0206 | Public thin ABI / Partner annex | Public with follow-up scrub | Pending Phase 2 |
| RFC-NVS-0207 | Public | Public Safe after HEXT-E | Pending Phase 2 |
| RFC-NVS-0208 | Public ABI / Trade Secret algebra | Public (ABI) | **Done** |
| RFC-NVS-0209 | Public | Public Safe | Metadata only |
| RFC-SensOS21 | Enterprise | Public with follow-up scrub | Pending Phase 2 |
| RFC-SensOS22 | Internal detail / Public summary | Public (summary) | **Done** |
| RFC-SensOS23 | Internal detail / Public summary | Public (summary) | **Done** |
| RFC-NVS-GOV-0001 | Public | Public Safe | Fix inconsistencies |
| NVS-MATH-0001–0005 | Public ABI / Partner annex | Public with follow-up scrub | Pending Phase 2 |
| ADR-0001 | Internal | Not primary public | **Moved** |
| Boundary / Batch reports | Internal | Not public | **Moved** |

## Documents requiring immediate redaction (checklist)

| # | Document | Sensitive content removed from public |
| --- | --- | --- |
| 1 | RFC-NVS-0208 | Proprietary execution strategy and evaluation methods |
| 2 | RFC-NVS-0203 | Wire layouts, metadata encodings, resume framing |
| 3 | RFC-NVS-0199 | Token grammar, hop constants, validation procedures |
| 4 | RFC-SensOS22 | Manager inventory, roadmap IDs, maturity notes |
| 5 | RFC-SensOS23 | Score formulas, private methods, experiment IDs |
| 6 | ADR-0001 | Full kernel API catalog / infra targets (internalized) |
| 7 | Boundary reports | Secret catalog (internalized) |
