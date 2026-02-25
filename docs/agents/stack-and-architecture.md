# Tech stack and architecture

Use this file for repository technology constraints and major structure.

## Frontend

- React + Vite
- React Router DOM
- TanStack React Query
- Tailwind CSS v3 (project theme in `tailwind.config.js`)
- Zod
- Lucide icons

## Backend and platform

- Supabase (database and auth)
- EdgeOne Pages deployment
- Node Functions for backend logic (`node-functions/`)
- AI SDK (`ai`) with OpenRouter provider (`@openrouter/ai-sdk-provider`)
- EdgeOne CDN caching via `edgeone.json`

## Main routes and features

- Homepage
- About
- Influencer listing and detail
- Order and booking flow
- AI recommendations
- Terms and conditions
- Login and register
- Profile

## Project layout

```text
src/
  components/
  components/ui/
  contexts/
  hooks/
  lib/
  pages/
  styles/
  types/
node-functions/
  ai-recommendations/
  influencers/
  orders/
  profile/
  reviews/
  lib/
rules/
specdb.sql
```
