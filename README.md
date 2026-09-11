# HR SCORM Studio

HR SCORM Studio is a planned internal authoring tool for non-technical HR/L&D users to create interactive SCORM courses quickly using manual editing, reusable course templates, and optional AI-assisted PDF-to-course generation.

This repository currently contains the **engineering blueprint only**. It defines the architecture, shared contracts, responsibilities, APIs, and expected outcomes. The development team is responsible for implementing the product.

## Why this project exists

General-purpose authoring tools such as eXeLearning already create interactive learning content and SCORM packages, but they are broader educational authoring environments. This project focuses on a narrower corporate workflow:

- simple HR-first authoring
- copy/paste content creation
- reusable company/course themes
- text, image, video, and quiz slide types
- preview before export
- SCORM export for Enthral LMS
- optional local AI that converts a PDF into an editable draft course
- future ability to replace local AI with the company's approved workspace AI

The goal is not to recreate every e-learning feature. The goal is to make a focused workflow that is easier for HR staff to use.

## Core design principles

1. **Manual authoring must work without AI.**
2. **Course JSON is the shared contract** between UI, AI, player, templates, and SCORM export.
3. **AI produces draft course data only.** It must not directly create final SCORM files or uncontrolled HTML.
4. **AI must be provider-agnostic.** Local AI is the first provider; a company workspace provider can be added later.
5. **Templates change presentation, not content structure.**
6. **Subsystems may be implemented independently** as long as shared contracts are respected.
7. **Implementation methods are the developer's decision.** This repo defines required outcomes, not coding style.

## End-to-end workflows

### Manual workflow

```text
HR user
  -> Create/open course
  -> Add/reorder/edit slides
  -> Copy/paste text
  -> Add images/videos/quizzes
  -> Select theme
  -> Preview
  -> Validate
  -> Export SCORM
  -> Upload/test in Enthral LMS
```

### Optional AI workflow

```text
PDF/document
  -> PDF extraction
  -> normalized source text
  -> AI provider
      -> Local provider now
      -> Workspace provider later
  -> schema-valid draft Course JSON
  -> HR reviews/edits
  -> same preview/template/SCORM pipeline as manual workflow
```

If AI is unavailable, the manual workflow still works completely.

## High-level architecture

```text
                    +-------------------+
                    |      HR User      |
                    +---------+---------+
                              |
                 +------------+-------------+
                 |                          |
                 v                          v
        +----------------+          +----------------+
        | Manual Editor  |          | Optional AI    |
        | UI team        |          | PDF -> Draft   |
        +-------+--------+          +--------+-------+
                |                            |
                +-------------+--------------+
                              v
                    +-------------------+
                    |    Course JSON    |
                    | shared contract   |
                    +----+----+----+----+
                         |    |    |
             +-----------+    |    +-----------+
             v                v                v
      +-------------+   +------------+   +------------+
      |   Player    |   | Templates  |   |   SCORM    |
      | preview/run |   | appearance |   | packaging  |
      +-------------+   +------------+   +-----+------+
                                                 |
                                                 v
                                           Enthral LMS
```

## Team

| Role | Developer | Primary ownership |
|---|---|---|
| UI-1 | Atharva | Core course editor and slide authoring UX |
| UI-2 | Tejas | Import/export, preview integration, themes, AI-facing UI states |
| SCORM-1 | Aneesh | SCORM contract, export packaging, LMS integration, integration leadership |
| SCORM-2 | Suhani | Learner/player experience, navigation, quiz behavior, theme rendering |
| AI-1 | Om | PDF extraction, preprocessing, page-aware chunking, input errors |
| AI-2 | Advait | Local LLM generation, structured output, provider abstraction, AI validation |

See `TASKS.md` for detailed responsibilities and acceptance criteria.

## Repository map

```text
README.md                 Project overview
AGENTS.md                 Instructions for coding assistants
TASKS.md                  Ownership and required outcomes
CONTRIBUTING.md           Collaboration and shared-contract rules

docs/
  ARCHITECTURE.md         System boundaries and integration model
  COURSE_SCHEMA.md        Shared Course JSON contract
  API_CONTRACTS.md        Logical endpoint/interface contracts
  UI.md                   UI behavior and responsibilities
  SCORM.md                SCORM responsibilities and runtime/export contract
  AI.md                   AI pipeline and provider-independence rules
  TEMPLATES.md            Theme/template architecture
  BRANCHING.md            Branch ownership and merge rules
  TESTING.md              Cross-system acceptance tests
  ENTHRAL.md              LMS validation expectations
  DECISIONS.md            Agreed and open architecture decisions

frontend/README.md        UI subsystem brief
backend/README.md         Logical service boundary brief
player/README.md          Learner player brief
scorm/README.md           SCORM subsystem brief
ai/README.md              AI subsystem brief

templates/                Theme ownership/specs
shared/                    Shared schema and sample course contracts
samples/                   Example course data
```

## Shared contract rule

These files are contracts, not private implementation details:

- `shared/course-schema.json`
- `docs/COURSE_SCHEMA.md`
- `docs/API_CONTRACTS.md`

A developer may propose changes, but should not silently change them in a way that breaks another subsystem.

## Suggested branches

- `main`
- `feature/ui-atharva`
- `feature/ui-tejas`
- `feature/scorm-aneesh`
- `feature/scorm-suhani`
- `feature/ai-om`
- `feature/ai-advait`

See `docs/BRANCHING.md`.

## What is explicitly out of scope for the blueprint

This repository does not prescribe:

- exact frontend framework
- exact backend framework
- state-management library
- SCORM library choice
- local LLM choice
- model runner choice
- database choice
- exact styling framework

Developers may choose implementation details provided the product meets the documented contracts.

## Definition of product success

The intended product is successful when:

1. An HR user can manually create and edit a course without AI.
2. The same course can be rendered using different templates.
3. The course can be previewed before export.
4. A valid SCORM package can be generated and tested in Enthral.
5. The package correctly handles the agreed tracking requirements such as completion, score, and resume.
6. AI, when available, creates an editable draft that conforms to the exact same Course JSON contract.
7. Switching from local AI to a company workspace AI requires changing the AI provider implementation, not the editor or SCORM architecture.
