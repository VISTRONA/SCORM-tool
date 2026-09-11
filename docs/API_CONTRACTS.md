# Logical API Contracts

These endpoints define logical application boundaries. They do not require a particular backend framework or network architecture.

## Course validation

### `POST /api/course/validate`

Purpose: validate a candidate Course JSON document.

Conceptual request:

```json
{"courseDocument": {}}
```

Conceptual response:

```json
{
  "valid": true,
  "errors": []
}
```

Owner: shared/integration; consumed heavily by UI and SCORM export.

---

## Course preview

### `POST /api/course/preview`

Purpose: prepare or return the data/runtime required to preview a course with a selected theme.

Conceptual request:

```json
{
  "courseDocument": {},
  "templateId": "corporate"
}
```

Owner: UI + player/template integration.

Implementation may be entirely client-side if the team chooses.

---

## Course export

### `POST /api/course/export`

Purpose: generate a SCORM package from validated course data.

Conceptual request:

```json
{
  "courseDocument": {},
  "templateId": "corporate",
  "scormTarget": "agreed-target"
}
```

Conceptual result: SCORM ZIP or a handle/reference to the generated package.

Owner: Aneesh / SCORM-1.

---

## Templates

### `GET /api/templates`

Purpose: list available themes/templates and display metadata.

Conceptual response:

```json
{
  "templates": [
    {
      "id": "corporate",
      "name": "Corporate",
      "description": "Professional corporate training theme"
    }
  ]
}
```

### `GET /api/templates/:id`

Purpose: get metadata/configuration for one template.

Owner: UI/player/template integration.

---

## PDF extraction

### `POST /api/ai/extract-pdf`

Purpose: extract normalized, page-aware source text from a PDF.

Conceptual response:

```json
{
  "pages": [
    {"page": 1, "text": "..."}
  ]
}
```

Owner: Om / AI-1.

---

## AI course generation

### `POST /api/ai/generate-draft`

Purpose: generate a draft course using the currently selected AI provider.

Conceptual request:

```json
{
  "source": {
    "pages": []
  },
  "options": {}
}
```

Conceptual response:

```json
{
  "status": "draft",
  "courseDocument": {}
}
```

`courseDocument` must validate against the shared schema.

Owner: Advait / AI-2.

---

## Cancel AI generation

### `POST /api/ai/cancel`

Purpose: cancel an in-progress generation request if the implementation supports asynchronous generation.

Owner: AI subsystem.

## Error contract

All logical APIs should expose errors that a non-technical UI can translate into useful messages. Avoid leaking model stack traces, parser internals, or SCORM implementation details directly to HR users.
