# NanoConnect - SME & Nano Influencer Matching Platform Project Rules

## Project Overview

**Concept**: "Tinder for UMKM & Nano Influencers"
A platform that matches SMEs (UMKM) with local nano influencers based on budget, niche, and target audience.

## External File Loading

CRITICAL: When you encounter a file reference (e.g., @rules/pages-llms.mdc), use your Read tool to load it on a need-to-know basis. They're relevant to the SPECIFIC task at hand.

Instructions:

- Do NOT preemptively load all references - use lazy loading based on actual need
- When loaded, treat content as mandatory instructions that override defaults
- Follow references recursively when needed

## Development Guidelines

For EdgeOne Pages CLI best practices: @rules/pages-llms.mdc

## Business Requirements

### Core Features

- **Matching Algorithm**: Budget-based, niche-specific, location-aware matching
- **Target Users**: SMEs and local nano influencers
- **Low Latency**: Real-time data using edge computing

### Website Localization

- **Language**: user-facing text on website UI must be in Indonesia
- **Currency**: pricing and budget displays must use Rupiah (Rp)

## Tech Stack & Infrastructure

### Frontend

- **Framework**: React.js + Vite
- **Deployment**: Tencent EdgeOne Pages
- **Development**: EdgeOne CLI
- **Icons**: FontAwesome for icons
- **CSS Framework**: Tailwind CSS v3

### Backend & Storage

- **Database**: Supabase
- **Edge Storage**: KV Storage (Cache)
- **Serverless**: Node Functions for business logic
- **AI Integration**: OpenRouter for smart matching

### Authentication

- **Auth Service**: Supabase Auth
- **Method**: Third-party login integration

## Application Architecture

### Pages & Components

```
├── Homepage
├── About
├── Influencer Listing
├── Influencer Detail
├── Order/Booking System
├── AI Recommendations
├── Terms & Conditions
└── Authentication Pages
```

## Data Models

- **Influencer Profile**: Niche, rates, location, portfolio
- **SME Profile**: Budget, target audience, campaign requirements
- **Matching Score**: AI-calculated compatibility rating

## Development

### Setup

```bash
npm install
```

### Run Commands

```bash
npm run dev       # Start development server (Vite)
npm run typecheck # Run TypeScript checks without emitting files
npm run build     # Build for production
npm run preview   # Preview production build
npx ultracite check  # Check for linting/formatting issues
npx ultracite fix    # Fix linting/formatting issues
```

### Codex CLI (Windows PowerShell)

When running commands from Codex CLI in Windows PowerShell, use `.cmd`
executables for npm tooling to avoid Volta PowerShell shim resolution issues.

- Use `npm.cmd ...` instead of `npm ...`
- Use `npx.cmd ...` instead of `npx ...`
- Example checks:
  - `npx.cmd ultracite check`
  - `npx.cmd ultracite fix`

### Project Structure

```
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── lib/         # Utilities and helpers
│   └── styles/      # CSS/styling
├── supabase/        # Database migrations
└── public/          # Static assets
```

### Environment Variables

Create `.env` file with:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_OPENROUTER_API_KEY` - OpenRouter API key

### Tech Conventions

- **TypeScript**: All new code must be TypeScript with strict types
- **Linting/Formatting**: Run `npx ultracite fix` before committing
- **File naming**: PascalCase for components (e.g., `InfluencerCard.tsx`), camelCase for utilities
- **Imports**: Use path aliases (`@/components`, `@/lib`, `@/pages`)

### Important

1. Always check existing components in `src/components/` before creating new ones
2. Run `npx ultracite fix` after making changes to auto-fix linting/formatting issues
3. Prefer existing utility functions in `src/lib/` over creating new ones
4. Use the project's existing UI patterns (check `src/components/ui/`)
5. Before committing, run:
   - `npx ultracite fix` (or `npx.cmd ultracite fix` in Codex CLI on Windows)
   - `npm run typecheck` (or `npm.cmd run typecheck` in Codex CLI on Windows)

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `npx ultracite fix`
- **Check for issues**: `npx ultracite check`
- **Diagnose setup**: `npx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**

- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**

- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `npx ultracite fix` before committing to ensure compliance.
