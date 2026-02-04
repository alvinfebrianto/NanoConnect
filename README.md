# NanoConnect - SME & Nano Influencer Matching Platform

## Project Overview

**Concept**: "Tinder for UMKM & Nano Influencers"
A platform that matches SMEs (UMKM) with local nano influencers based on budget, niche, and target audience.

## Business Requirements

### Core Features
- **Matching Algorithm**: Budget-based, niche-specific, location-aware matching
- **Target Users**: SMEs and local nano influencers
- **Low Latency**: Real-time data using edge computing

## Tech Stack & Infrastructure

### Frontend
- **Framework**: React.js + Vite
- **Deployment**: Tencent EdgeOne Pages

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
npm run dev              # Start development server (Vite)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npx prettier --write .   # Format code
```

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
- **Linting**: Run `npm run lint` before committing
- **Formatting**: Run `npx prettier --write .` to format code
- **File naming**: PascalCase for components (e.g., `InfluencerCard.tsx`), camelCase for utilities
- **Imports**: Use path aliases (`@/components`, `@/lib`, `@/pages`)

### Important
1. Always check existing components in `src/components/` before creating new ones
2. Run `npm run lint` after making changes
3. Run `npx prettier --write <files-you-changed>` to format your changes
4. Prefer existing utility functions in `src/lib/` over creating new ones
5. Use the project's existing UI patterns (check `src/components/ui/`)
