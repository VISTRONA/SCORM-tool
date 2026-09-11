# Product Testing

Testing is organized around product behavior rather than implementation style.

## Manual authoring

Verify that a non-technical user can:

- create/open a course
- edit title/objectives
- add/reorder/delete slides
- create text, image, video, and quiz content
- save/load valid course data
- select theme
- preview
- export without AI

## Shared player

Verify:

- all supported slide types render
- keyboard navigation works for essential controls
- broken/missing media produces useful behavior
- quiz answers and score state behave consistently
- learner progress and last location can be represented

## SCORM/LMS

Verify in the real LMS:

- upload/import
- launch
- navigation
- score
- completion
- pass/fail if used
- exit/relaunch
- resume
- missing API handling

## AI input

Verify:

- valid text PDF
- empty PDF
- scanned-only PDF
- encrypted PDF
- oversized input
- malformed file

## AI output

Verify:

- schema-valid draft
- malformed model output rejection
- no fabricated local assets accepted silently
- human editing works normally
- AI can be disabled without affecting authoring/export
