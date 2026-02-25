# EdgeOne-specific guidance

Use this file when working on EdgeOne deployment and function placement.

## Source of truth and precedence

- Project-specific rules in this repository take precedence over generic EdgeOne templates.
- `pages-llms.mdc` is a reference guide, not a stack override.
- Keep this project on React + Vite + Tailwind v3 unless a migration is explicitly requested.

## When to load `pages-llms.mdc`

- Load it only for EdgeOne-specific tasks, function structure questions, or deployment/configuration details.
- Do not preload it for unrelated frontend or domain tasks.

## Function placement policy

- Use `node-functions/` for complex backend logic, database writes, auth, payments, and third-party integrations.
- Use `edge-functions/` for lightweight low-latency logic near the edge.
- Keep UI and display rendering in `src/`.

## EdgeOne project notes

- `.edgeone/` is generated and should not contain user-authored app logic.
- Frontend dev server and function dev server are separate concerns.
- Use `edgeone.json` only when overriding defaults is required.
