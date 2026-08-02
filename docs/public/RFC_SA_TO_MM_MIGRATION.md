# Migration: RFC-SA → RFC-MM

**Status:** Active  
**Date:** 2026-08-02  

## Summary

Legacy **RFC-SA001–SA005** (Semantic Annotation experimental series) are
**Superseded** by **RFC-MM001–MM005** (Meaning Mapper product specification).

Historical RFCs are retained. They are not deleted.

## Cross-reference table

| Legacy RFC-SA | Status | Canonical RFC-MM | Title |
| --- | --- | --- | --- |
| RFC-SA001 | Superseded | RFC-MM001 | Meaning Mapper Architecture |
| RFC-SA002 | Superseded | RFC-MM002 | Meaning View ABI |
| RFC-SA003 | Superseded | RFC-MM003 | Meaning Payload Schema |
| RFC-SA004 | Superseded | RFC-MM004 | Meaning Runtime Bridge |
| RFC-SA005 | Superseded | RFC-MM005 | Meaning Mapper Service API |

## Compatibility

- Wire paths such as `POST /api/v1/annotate` and type name `AnnotationView` MAY remain for backward compatibility.
- Product documentation and new normative text MUST cite **RFC-MM**.
- Implementation evidence SHOULD cite RFC-ITM.

## Canonical locations

| Artifact | Path |
| --- | --- |
| Namespace architecture | `RFCv3_draft/rfc/RFC_NAMESPACE_ARCHITECTURE.md` |
| MM series index | `RFCv3_draft/rfc/MM/RFC_MM_SERIES_INDEX.md` |
| ITM series index | `RFCv3_draft/rfc/ITM/RFC_ITM_SERIES_INDEX.md` |
| SA historical index | `RFCv3_draft/rfc/SA/RFC_SA_SERIES_INDEX.md` |
| Full migration plan | `RFCv3_draft/rfc/MIGRATION_SA_TO_MM.md` |
| Open Standards page | `/Open-Standards/Namespaces` |
