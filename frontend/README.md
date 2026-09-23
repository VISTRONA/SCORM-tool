# Frontend Subsystem

Owners: Atharva (UI-1), Tejas (UI-2)

The frontend should provide the HR-first authoring experience documented in `docs/UI.md`.

Primary responsibilities:

- editor
- slide list and ordering
- content/image/video/quiz editing
- Course JSON import/export
- validation feedback
- template selection
- learner preview integration
- optional AI generation status/review UI

Hard requirement: the complete manual authoring path must work without AI.

Implementation details are owned by Atharva and Tejas.

## Running locally

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + production build
```

Stack: React + TypeScript + Vite, Tailwind CSS v4, shadcn/ui (`components.json`), zustand.

- Design tokens (Linear-style neutral palette + indigo accent) live in `src/index.css`.
- `@shared/*` resolves to the repo-level `shared/` directory (e.g. `@shared/sample-course.json`).
- `src/types/course.ts` mirrors `shared/course-schema.json`; change the schema first, then the types.
