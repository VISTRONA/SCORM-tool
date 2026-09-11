# Branching and Ownership

## Primary branches

```text
main
feature/ui-atharva
feature/ui-tejas
feature/scorm-aneesh
feature/scorm-suhani
feature/ai-om
feature/ai-advait
```

These branches are ownership guidelines, not restrictions on additional working branches.

## Parallel development model

UI and SCORM work should proceed without waiting for AI.

AI work should proceed against the documented Course JSON schema without waiting for the full UI.

Suhani's player should be testable against sample JSON without waiting for the editor.

Aneesh's SCORM packaging should consume sample/validated JSON without waiting for AI.

## Contract changes

If a developer needs to modify:

- Course JSON schema
- endpoint contracts
- asset references
- SCORM tracking behavior

that change should be discussed with affected owners before merge.

## Integration principle

Prefer merging thin, contract-compatible increments rather than waiting for entire subsystems to be finished.
