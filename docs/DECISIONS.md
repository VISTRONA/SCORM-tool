## Initial SCORM Target

The initial SCORM implementation targets **SCORM 1.2**.

SCORM-specific LMS communication must remain isolated behind a runtime
adapter. Course content and the learner player must not directly depend
on SCORM 1.2 APIs.

This allows additional runtime adapters, including SCORM 2004, to be
introduced without redesigning the Course JSON format or learner player.

The initial integration must support:

- LMS initialization
- course launch
- lesson status
- score reporting
- suspend data
- course resume
- LMS commit
- clean session termination

Final packages must be tested against the target Enthral LMS environment.
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
