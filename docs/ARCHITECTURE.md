# Architecture

## Purpose

The architecture allows UI, SCORM, and AI work to proceed independently while sharing one stable data model.

## Central contract

`Course JSON` is the common data model.

```text
Manual Editor -----+
                   |
Optional AI -------+--> Course JSON --> Shared Player --> Template --> SCORM Export
```

Neither the player nor the SCORM exporter should need to know whether the course was manually authored or AI-generated.

## Manual path

The manual path is the baseline product:

```text
HR Editor
 -> Course JSON
 -> Validation
 -> Preview through shared player
 -> Theme selection
 -> SCORM packaging
 -> Enthral LMS
```

It must operate with the AI subsystem removed or disabled.

## AI path

```text
PDF
 -> Extraction
 -> Normalized source
 -> AIProvider
 -> Draft Course JSON
 -> Schema validation
 -> Human review/edit
 -> Existing manual pipeline
```

AI inserts data into the product. It does not own rendering, templates, or SCORM packaging.

## Provider boundary

Conceptual interface:

```text
AIProvider.generateCourseDraft(normalizedSource, options) -> CourseDraft
```

Provider implementations may include:

```text
LocalProvider      -> local runner / local LLM
WorkspaceProvider  -> future company-approved workspace AI
```

Changing providers should not require changes to:

- editor
- course schema
- player
- templates
- SCORM package generator

## Player/template relationship

The player owns learner behavior. Themes own appearance.

```text
Course JSON
   +
Shared Player
   +
Selected Theme
   =
Rendered Course
```

Do not create separate course implementations per theme.

## Logical service boundary

The project may use a backend API, local service, desktop bridge, or another implementation. The documented endpoints are logical contracts rather than a required deployment architecture.
