# BrandCanvas

> Extract any brand. Create new ones.

Agent-native brand intelligence — an A2MCP agent delivering pay-per-call brand extraction and creation via x402 on X Layer.

## Endpoints

| Endpoint | Purpose | Price |
|----------|---------|-------|
| `/brand/extract` | URL → complete brand kit JSON (colors, fonts, logo, components) | $0.30 |
| `/brand/colors` | URL → color system (primary, secondary, accent, neutrals) | $0.05 |
| `/brand/typography` | URL → font families, weights, scale, stacks | $0.05 |
| `/brand/assets` | URL → logo URLs, favicon, OG images | $0.05 |
| `/palette/generate` | Mood + industry → 5-color palette + contrast ratios | $0.05 |
| `/fonts/pair` | Style + mood → 3 font pairings + Google Fonts CDN links | $0.05 |
| `/brand/guidelines` | Brand name + values → formatted brand guidelines | $0.10 |

## Stack

- **Runtime:** Bun + Hono
- **Payment:** x402 protocol via `@okxweb3/x402-hono`
- **Extraction:** Playwright (headless Chromium)
- **AI:** Claude Sonnet 4.6 on AWS Bedrock
- **Settlement:** X Layer (`eip155:196`), USDT0

## How It Works

**Extraction** — Playwright renders any live URL, executes CSS, and extracts computed styles (colors, fonts, spacing, logos). LLMs cannot do this — they can't render pages.

**Creation** — Claude generates original color palettes, font pairings, and brand guidelines from a description. Structured JSON output agents can consume directly.

## Usage

All endpoints are x402-gated. Agents pay per call in USDT0 on X Layer.

```bash
# Returns 402 Payment Required (pay via x402 to access)
curl -X POST https://brandcanvas.onrender.com/brand/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}'
```

## Development

```bash
bun install
bunx playwright install chromium
bun run dev
```

## License

MIT
