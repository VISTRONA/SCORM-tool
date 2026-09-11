# Instructions for Coding Assistants

This file is for AI coding assistants used by individual team members.

## Mandatory reading order

Before making code changes, read:

1. `README.md`
2. `TASKS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/COURSE_SCHEMA.md`
5. `docs/API_CONTRACTS.md`
6. the README/documentation for the assigned subsystem

## Global rules

- Work only within the developer's assigned role unless explicitly asked to integrate another subsystem.
- Do not silently change shared contracts.
- `Course JSON` is the stable integration contract.
- Manual authoring must not depend on AI.
- AI generates draft course data only.
- AI-specific code must stay behind an AI provider boundary.
- Templates must consume shared course data rather than maintain separate copies of course content.
- Exported SCORM content must not depend on remote runtime assets unless the team explicitly changes that decision.
- Optimize for product compatibility and integration, not unnecessary architecture.
- Implementation style is up to the developer; acceptance criteria are not.

## Shared files requiring coordination

Before changing any of the following, explain the impact and confirm that the change will not break another subsystem:

- `shared/course-schema.json`
- `docs/COURSE_SCHEMA.md`
- `docs/API_CONTRACTS.md`
- SCORM tracking semantics documented in `docs/SCORM.md`

## Role prompts

### Atharva — UI-1

Use this prompt:

> I am Atharva and my assigned role is UI-1. Read the repository blueprint and my tasks. Implement the main HR course authoring experience while preserving the shared Course JSON contract. The editor must work with AI completely unavailable. Do not change shared contracts without explaining the need first.

### Tejas — UI-2

> I am Tejas and my assigned role is UI-2. Read the repository blueprint and my tasks. Implement import/export-facing UI behavior, validation feedback, preview/theme integration, and optional AI progress/error/review UI. The application must remain fully usable without AI. Do not change shared contracts without explaining the need first.

### Aneesh — SCORM-1

> I am Aneesh and my assigned role is SCORM-1 and integration lead. Read the repository blueprint and my tasks. Implement the SCORM-facing contract, packaging/export path, runtime integration requirements, and LMS validation. Keep the exporter dependent on Course JSON and the shared player, not AI. Coordinate any shared-contract changes before making them.

### Suhani — SCORM-2

> I am Suhani and my assigned role is SCORM-2. Read the repository blueprint and my tasks. Implement the learner-facing shared course player, navigation, quiz behavior, progress state, media behavior, and reusable theme rendering. The same player must support manual and AI-generated course data because both use the same Course JSON contract.

### Om — AI-1

> I am Om and my assigned role is AI-1. Read the repository blueprint and my tasks. Implement document/PDF ingestion, text extraction, page-aware preprocessing/chunking, and meaningful errors for unsupported input. Keep this subsystem independent from the course editor and SCORM generator.

### Advait — AI-2

> I am Advait and my assigned role is AI-2. Read the repository blueprint and my tasks. Implement local AI draft generation and the AI provider abstraction. AI output must validate against the shared Course JSON schema. Keep model-specific details behind the provider interface so a future company workspace AI can replace the local provider without changing the editor or SCORM pipeline.
