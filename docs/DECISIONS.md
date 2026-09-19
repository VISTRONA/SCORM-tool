## SCORM Target

### Initial target: SCORM 1.2

The first supported LMS package format is SCORM 1.2.

SCORM-specific LMS communication must remain isolated from the Course JSON
format and learner player through a runtime adapter.

The initial integration must support:

- LMS initialization
- lesson status
- score reporting
- learner location/bookmark
- suspend data
- commit/save
- clean session termination
- graceful behavior when the LMS API cannot be located

The architecture should allow a SCORM 2004 adapter to be introduced later
without changing the Course JSON contract.

Generated packages must ultimately be verified using the target Enthral LMS.
# Architecture Decisions

## Agreed

### Course JSON is the shared contract

UI, AI, player, templates, and SCORM export communicate through one course-data model.

### AI is optional

Manual authoring and SCORM export must work with AI completely unavailable.

### AI is provider-agnostic

The first provider is local/on-device. A future company workspace provider should be replaceable behind the same interface.

### AI generates drafts, not SCORM architecture

AI-created content must be validated and reviewed before normal export.

### Templates are presentation layers

Different themes reuse the same course/player logic.

## Open decisions to be recorded by the development team

- exact frontend technology
- exact backend/service architecture, if any
- first SCORM target/version
- SCORM library/runtime approach
- exact completion and success rules
- exact local LLM runner/model
- exact local asset-management strategy
- whether preview/export are client-side, backend-driven, or hybrid
