# UI Requirements

## User profile

Primary user: HR/L&D staff member who should not need web-development or SCORM knowledge.

## Core authoring experience

The UI must make these operations obvious:

- create/open a course
- enter course title and objectives
- add a slide
- select slide type
- copy/paste content
- add image/video
- create/edit quiz
- reorder slides
- delete slides
- choose a theme
- preview the learner experience
- validate/export

## Required slide types

- content/text
- image
- video
- quiz

Additional types are optional and should not break the shared schema architecture.

## AI behavior in UI

AI is optional.

The UI may expose:

- Upload PDF
- Generate draft
- generation progress
- useful errors
- review generated draft

But manual creation must remain available regardless of AI status.

Generated content must be editable using the normal editor.

## UX principle

Prefer terminology HR users understand. Do not require them to understand concepts such as SCORM API, manifest, runtime adapter, iDevice, or schema validation.
