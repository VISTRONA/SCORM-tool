# Contributing

## Engineering principle

This repository defines subsystem boundaries and shared contracts. Each developer controls implementation details within their own area.

## Branch ownership

Suggested primary branches:

- `feature/ui-atharva`
- `feature/ui-tejas`
- `feature/scorm-aneesh`
- `feature/scorm-suhani`
- `feature/ai-om`
- `feature/ai-advait`

Developers may create additional branches if useful.

## Shared contracts

Changes to the following require coordination with affected team members:

- Course JSON schema
- logical API contracts
- SCORM tracking semantics
- asset-reference format
- template/player contract

Do not silently introduce a second course-data format.

## Integration rule

All subsystems should be testable against `shared/sample-course.json` where applicable.

AI is not a dependency of the manual authoring/export path.

## Pull request expectations

A change should state:

- what subsystem it changes
- what documented task it satisfies
- whether it changes a shared contract
- how another developer can test the behavior
- known limitations
