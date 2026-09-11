# Development Responsibilities

These tasks define **required outcomes**, not implementation methods. Each developer may choose their own implementation approach inside their assigned subsystem as long as the shared contracts and acceptance criteria are respected.

## Shared responsibility

### TEAM-01 — All team members

Agree and record the following before dependent implementation becomes fixed:

- selected frontend/backend architecture
- chosen SCORM target/version for the first working implementation
- learner tracking requirements
- Enthral test access and upload workflow
- demo/test hardware for local AI
- chosen local AI runner/model
- how local assets are represented in Course JSON

Every subsystem must be able to load and reason about `shared/sample-course.json`.

---

## UI-1 — Atharva

### UI-01 — Base course editor

Required outcome:

- load a Course JSON document
- display course title and learning objectives
- display the ordered slide list
- edit course content without silently dropping fields from the shared schema
- maintain valid editor state

### UI-03 — Slide authoring

Required outcome:

- add slides
- remove slides
- reorder slides
- support required slide types: text/content, image, video, quiz
- edit quiz question/options/correct answer
- prevent obvious invalid course state such as accidental deletion of all required course structure
- support practical copy/paste authoring for HR users

Dependencies: shared Course JSON contract.

---

## UI-2 — Tejas

### UI-02 — Import/export-facing UI and validation

Required outcome:

- import Course JSON
- save/export editable Course JSON
- show understandable validation errors
- document how local media/assets are selected or associated
- ensure saved JSON conforms to the shared schema

### UI-04 — Preview, themes, optional AI interaction

Required outcome:

- integrate the shared player as course preview
- support template/theme selection
- display optional AI generation progress/errors if AI is available
- provide explicit human review/acceptance of AI-created drafts
- editing AI-generated content must behave the same as editing manually created content
- AI failure/unavailability must never block manual authoring

### QA-UI

Run a short HR-style usability test and fix blocking UX problems. Record major friction points found during authoring.

---

## SCORM-1 — Aneesh

### SC-01 — SCORM integration contract

Required outcome:

- confirm the first supported SCORM target
- define runtime tracking behavior
- define how the LMS API is located/called
- define the expected SCORM package structure
- create/own the root-manifest and export contract
- verify an initial package can launch in the real LMS environment

### SC-04 — Export/package path

Required outcome:

- validate Course JSON before export
- validate referenced local assets
- package the shared player, selected theme, course data, and media
- avoid accidental remote runtime dependencies
- produce an LMS-importable SCORM ZIP
- ensure export is independent of the AI implementation

### QA-SCORM

With Suhani's support, verify and record:

- package upload
- launch
- navigation
- score behavior
- pass/fail if used
- completion
- exit and relaunch
- resume/progress
- behavior when the SCORM API cannot be found

### Integration leadership

Aneesh owns cross-subsystem integration decisions that affect final SCORM export, but shared contract changes still require discussion with impacted developers.

---

## SCORM-2 — Suhani

### SC-02 — Shared learner player

Required outcome:

- render Course JSON through one shared player
- support text/content slides
- support image slides
- support quiz slides
- support navigation
- provide useful missing-asset behavior
- provide keyboard-accessible core navigation

### SC-03 — Runtime learner behavior

Required outcome:

- local video support
- quiz submission behavior
- score calculation/state required by SCORM integration
- visited-slide/progress state
- last-location state required for resume
- render at least the core agreed themes using the same player

The player must not care whether Course JSON came from the manual editor or AI.

---

## AI-1 — Om

### AI-01 — Document extraction

Required outcome:

- extract usable text from supported text-based PDFs
- preserve page numbers/source boundaries where practical
- return actionable errors for empty, scanned-only, encrypted, or otherwise unsupported PDFs

### AI-03 — Preprocessing and handoff

Required outcome:

- normalize extracted text
- bound input size
- create page-aware chunks if chunking is required
- clean temporary files/data as appropriate
- provide a stable normalized handoff to AI generation
- expose understandable errors to the application layer

### QA-AI input testing

With Advait's support, test valid, empty, scanned, oversized, encrypted/malformed, and unsupported-input behavior.

---

## AI-2 — Advait

### AI-02 — Local AI draft generation

Required outcome:

- run against the agreed local AI runner/model
- consume normalized document text
- produce a structured course draft that conforms to `shared/course-schema.json`
- reject malformed model output
- prevent fabricated local asset references from silently entering the final course
- record the local model/runner assumptions required for testing

### AI-04 — Provider abstraction and generation safeguards

Required outcome:

- define a provider-neutral AI generation interface
- implement the local provider behind that interface
- leave a clear future path for a company workspace provider
- validate generated drafts
- support one bounded repair/retry strategy if desired by implementation
- support cancellation/timeout behavior where appropriate
- no hidden cloud fallback
- preserve AI output as draft content requiring human review

---

## Final integration expectation

The product must support both of these paths:

```text
Manual Editor -> Course JSON -> Preview/Theme -> SCORM Export -> Enthral
```

and, when AI is available:

```text
PDF -> AI -> Draft Course JSON -> Human Review/Edit -> Preview/Theme -> SCORM Export -> Enthral
```

The second path is optional enhancement. The first path is a complete product path and must never depend on the second.
