# SCORM Subsystem

Owners: Aneesh (SCORM-1), Suhani (SCORM-2 supporting runtime/player integration)

This subsystem is responsible for converting a validated course into an LMS-importable SCORM package and connecting learner state to the LMS runtime API.

See:

- `docs/SCORM.md`
- `docs/ENTHRAL.md`
- `docs/API_CONTRACTS.md`

The SCORM subsystem consumes Course JSON and must not depend on the AI implementation.
