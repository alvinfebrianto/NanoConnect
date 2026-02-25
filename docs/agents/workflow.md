# Workflow and command rules

Use this file for task execution flow and command policy.

## File loading policy

- Use lazy loading for referenced files.
- Do not preload all referenced files.
- After loading a referenced file, treat it as mandatory for that task.
- Follow references recursively only when needed.

## Search workflow

Use `codemogger` when task intent is conceptual or unclear.

1. Run `codemogger index .` on first run and after major renames/refactors.
2. Run `codemogger search "query" --mode hybrid --limit 10` for concept search.
3. Optionally run `codemogger search "query" --mode semantic --snippet --format text`.

Use `rg` for exact symbol/text lookup and file discovery.

## Quality gate

- Always run `npm.cmd run check` after making changes.
