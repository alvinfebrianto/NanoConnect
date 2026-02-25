# Code standards and patterns

Use this file for implementation-level coding conventions.

## Reuse-first policy

- Check existing components in `src/components/` before creating new ones.
- Use `src/components/ui/` patterns for UI consistency.
- Prefer existing helpers in `src/lib/` before adding new utilities.

## TypeScript and JavaScript

- Prefer explicit types where they improve clarity.
- Prefer `unknown` over `any` when type is not known.
- Use `const` by default; use `let` only when reassignment is required.
- Use optional chaining and nullish coalescing where appropriate.
- Prefer `for...of` over indexed loops and `.forEach()` for iterative logic.

## Async and error handling

- Use `async/await` instead of promise chains for app logic.
- Await promises intentionally; avoid floating promises.
- Throw `Error` objects with descriptive messages.
- Use meaningful `try/catch` blocks; avoid catch-and-rethrow noise.

## React patterns

- Use function components.
- Keep hooks at top level and include complete dependency arrays.
- Use stable keys from IDs for rendered lists.
- Prefer semantic HTML and accessible form labeling.

## Testing

- Keep assertions inside `it()` or `test()` blocks.
- Avoid `.only` and `.skip` in committed tests.
- Prefer async/await over done callbacks.

## Security

- Use `rel="noopener"` with `target="_blank"`.
- Avoid `dangerouslySetInnerHTML` unless necessary and reviewed.
- Avoid `eval()` and direct `document.cookie` writes.
- Validate and sanitize user input.

## Performance and organization

- Avoid spread-in-accumulator patterns in loops.
- Prefer top-level regex declarations outside hot loops.
- Prefer specific imports over namespace imports.
- Avoid creating new barrel files.
- Exception: keep existing `src/types/index.ts` as an allowed barrel.
