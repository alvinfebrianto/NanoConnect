# Product and business rules

Use this file for product intent and user-facing constraints.

## Core domain entities

- `Influencer`: niche, rates, location, portfolio.
- `SME`: budget, target audience, campaign requirements.
- `Matching Score`: AI-calculated compatibility.

## Canonical types and schema

- TypeScript types are centered in `src/types/index.ts`.
- Database schema is defined in `specdb.sql` (`users`, `influencers`, `orders`, `reviews`).
