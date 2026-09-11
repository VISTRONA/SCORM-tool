# AI Subsystem

## Purpose

AI is an optional authoring accelerator that converts source documents into editable draft course data.

It is not required for the manual course-authoring product to work.

## Pipeline

```text
PDF
 -> extract text/pages
 -> normalize/chunk source
 -> AIProvider
 -> structured draft
 -> schema validation
 -> human review
 -> normal editor
```

## Provider independence

The rest of the product should depend on a provider-neutral AI interface rather than a specific local runner.

Conceptually:

```text
AIProvider
  generateCourseDraft(source, options)
```

Initial provider:

```text
LocalProvider -> local runner/model
```

Future provider:

```text
WorkspaceProvider -> company-approved AI workspace/API
```

Changing providers must not require rewriting:

- course editor
- shared schema
- player
- templates
- SCORM exporter

## Privacy rule

The initial AI path must not silently send confidential course content to a cloud provider.

No cloud fallback should occur unless the company explicitly approves and configures a workspace provider.

## Output rule

AI output is **draft course data**.

AI must not directly generate the final SCORM manifest, package structure, or arbitrary final runtime HTML.

## Validation

Generated data must:

- parse successfully
- match the Course JSON schema
- use valid slide types
- avoid fabricated local asset paths
- remain marked/reviewed as draft until a human accepts or edits it
