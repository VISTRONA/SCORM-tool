# Templates and Themes

## Goal

Provide multiple learner-facing visual styles without duplicating course content or learner logic.

Planned starting themes:

- Corporate
- Minimal
- Classroom
- Dark

## Contract

Templates consume the same Course JSON through the shared player.

```text
Course JSON + Shared Player + Theme = Learner Experience
```

A theme may control presentation such as:

- typography
- spacing
- header/footer appearance
- buttons
- cards
- quiz styling
- progress UI
- media framing

A theme should not redefine quiz correctness, SCORM tracking, or course content.

Each template folder initially contains only a README. Developers decide the implementation format.
