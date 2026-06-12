# NanoConnect Domain Glossary

## Core Concepts

- **NanoConnect**: Platform connecting Indonesian SMEs with nano-influencers for marketing campaigns.
- **SME** (Small Medium Enterprise): Business user who requests influencer recommendations and books campaigns.
- **Influencer**: Content creator available for campaign collaboration, verified by the platform.

## AI Recommendations

- **AI Recommendation**: Machine-generated match between an SME campaign brief and available influencers, scored 0-100.
- **Campaign Brief**: SME-submitted requirements (niche, budget, location, target audience, company size, campaign type).
- **Match Score**: 0-100 score per influencer based on niche fit, location alignment, engagement rate, and budget compatibility.
- **Deterministic Fallback**: Algorithmic scoring used when AI provider is unavailable — niche 45%, location 20%, engagement 20%, budget 15%.

## Technical

- **AI Provider**: Google Gemini via `@ai-sdk/google` SDK.
- **Default Model**: `gemini-2.5-flash-lite`.
- **API Key Source**: `GOOGLE_GENERATIVE_AI_API_KEY` environment variable (comma-separated for multiple keys with auto-rotation).
- **Provider Initialization**: Use `createGoogleGenerativeAI({ apiKey })` to create a provider instance per key. Passing `apiKey` to `google(modelId, { apiKey })` is ignored by the SDK — the key must be set at the provider level.
- **Structured Output**: `generateText` + `Output.object` with Zod schema validation.
