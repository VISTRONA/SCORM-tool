# SCORM Subsystem

## Responsibility

The SCORM subsystem turns a validated course into an LMS-importable package and manages learner-to-LMS tracking through the selected SCORM standard.

## Inputs

- validated Course JSON
- shared player
- selected template/theme
- referenced local assets
- selected SCORM target

## Output

A SCORM ZIP containing the required manifest, launch content, course/player assets, selected theme, media, and runtime logic.

## Tracking requirements to agree and test

At minimum the team should explicitly decide how to handle:

- initialization
- learner completion
- quiz/final score
- success/pass-fail if applicable
- learner location/bookmark
- resume state
- commit/save
- exit/termination
- behavior if SCORM API is missing

## Architecture rule

The exporter must not depend on the AI subsystem.

```text
Course JSON -> Player/Theme -> SCORM Export
```

The source of Course JSON is irrelevant.

## Runtime and package are different concerns

A valid ZIP/manifest is not enough. Runtime communication with the LMS must also be verified.

## SCORM target

The team must record the first supported target in `docs/DECISIONS.md` after confirming project/LMS requirements.
