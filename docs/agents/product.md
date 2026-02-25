# Product and business rules

Use this file for product intent and user-facing constraints.

## Product summary

NanoConnect is a matching platform for SMEs and nano influencers.

## Global localization requirements

- User-facing website UI text must be Indonesian.
- Pricing and budget values must use Rupiah (`Rp`).

## Core domain entities

- `Influencer`: niche, rates, location, portfolio.
- `SME`: budget, target audience, campaign requirements.
- `Matching Score`: AI-calculated compatibility.

## Canonical types and schema

- TypeScript types are centered in `src/types/index.ts`.
- Database schema is defined in `specdb.sql` (`users`, `influencers`, `orders`, `reviews`).
