# NanoConnect - SME & Nano Influencer Matching Platform

## Project Overview

**Concept**: "Tinder for UMKM & Nano Influencers"
Platform untuk mencocokkan UMKM/SME dengan nano influencers lokal berdasarkan budget, niche, dan target audience.

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
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
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
- Use TypeScript for type safety
- Follow existing component patterns
- Run `npm run lint` before committing
