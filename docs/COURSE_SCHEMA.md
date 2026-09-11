# Course JSON Contract

Course JSON is the integration contract between all subsystems.

The exact schema may evolve only through coordinated changes.

## Required conceptual structure

```json
{
  "schemaVersion": "1.0",
  "course": {
    "id": "course-id",
    "title": "Course title",
    "description": "Optional description",
    "objectives": ["Objective 1"],
    "slides": []
  }
}
```

## Supported slide types

### Content slide

```json
{
  "id": "slide-1",
  "type": "content",
  "title": "Introduction",
  "content": "Course content"
}
```

### Image slide

```json
{
  "id": "slide-2",
  "type": "image",
  "title": "Example",
  "content": "Optional supporting text",
  "asset": {
    "path": "assets/example.png",
    "alt": "Description of image"
  }
}
```

### Video slide

```json
{
  "id": "slide-3",
  "type": "video",
  "title": "Demonstration",
  "asset": {
    "path": "assets/demo.mp4"
  }
}
```

### Quiz slide

```json
{
  "id": "slide-4",
  "type": "quiz",
  "title": "Knowledge Check",
  "question": "Which option is correct?",
  "options": [
    {"id": "a", "text": "Option A"},
    {"id": "b", "text": "Option B"}
  ],
  "correctOptionId": "b"
}
```

## Rules

- slide IDs must be stable and unique within the course
- slide order is defined by the `slides` array
- local media references must use the agreed asset path convention
- AI-generated drafts must conform to the same schema
- AI must not invent references to files that do not exist
- presentation/theme information should be kept separate from core educational content where possible

See `shared/course-schema.json` for the machine-readable baseline contract.
