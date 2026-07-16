# BrandCanvas — Product Requirements

## What

An A2MCP agent that provides pay-per-call brand intelligence — extract brand identity from any live website or generate brand materials from scratch. URL in → brand kit out. Description in → brand identity created. Payment via x402 micropayments on X Layer.

## For Who

Design agents, content creation agents, marketing agents, website builders, any agent producing branded work. Also: founders, solo creators, and startups who need brand identity without hiring a designer.

## Problem

Design and content agents need exact brand data — logos, colors, fonts, spacing. Currently they ask the human (breaks autonomy) or guess (creates off-brand work). On the creation side: founders need brand identities but can't afford a branding agency.

LLMs cannot solve this alone. Extracting a brand kit requires rendering the page (executing CSS, resolving cascade, computing final styles). An LLM reading HTML cannot determine actual computed colors — it sees variables, media queries, and cascading rules. Only a real browser engine produces the truth.

## Endpoints

| # | Endpoint | Input | Output | Price | Type |
|---|---|---|---|---|---|
| 1 | `/brand/extract` | URL | Complete brand kit: colors, fonts, assets, spacing, components | $0.50 | Extraction |
| 2 | `/brand/colors` | URL | Color system: primary, secondary, accent, neutrals as HEX | $0.10 | Extraction |
| 3 | `/brand/typography` | URL | Font families, weights, scale, heading/body stacks | $0.10 | Extraction |
| 4 | `/brand/assets` | URL | Logo URLs (SVG/PNG), favicon, OG images — scored and ranked | $0.10 | Extraction |
| 5 | `/palette/generate` | Mood + industry + adjectives | 5-color palette + CSS vars + Tailwind config + WCAG contrast + NFT | $0.10 | Generation |
| 6 | `/fonts/pair` | Style + mood | 3 font pairings + Google Fonts CDN links + CSS snippets + NFT | $0.10 | Generation |
| 7 | `/brand/guidelines` | Brand name + values + audience | Brand guidelines + voice + color + typography + NFT | $0.15 | Generation |

Every generation endpoint mints an ERC-721 provenance NFT on X Layer with a content hash of the output.

## Out of Scope

- Logo generation (image gen)
- Full website redesign
- Print collateral
- Animated brand assets

## Stack

| Layer | Choice |
|---|---|
| Runtime | Bun + Hono |
| Payment | `@okxweb3/x402-hono` + `@okxweb3/x402-evm` + `@okxweb3/x402-core` |
| Extraction | Playwright headless Chromium |
| AI | Claude Sonnet 4.6 on AWS Bedrock |
| Color processing | `culori` |
| NFT | ERC-721 on X Layer — `0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B` |
| Settlement | X Layer `eip155:196`, USDT0 `0x779ded0c9e1022225f8e0630b35a9b54be713736` |
| Deploy | Docker on Render |

## x402 Compliance

- Every endpoint handles both GET and POST (OKX probes with bare GET)
- `PAYMENT-REQUIRED` header must be present (validator reads headers, not body)
- CORS must explicitly list `PAYMENT-SIGNATURE` in allowed headers
- CORS must expose `PAYMENT-REQUIRED` and `PAYMENT-RESPONSE`
- Payment gate fires before param validation
- Public HTTPS domain required

```bash
# Validation self-check
curl -i -X GET https://brandcanvas.onrender.com/brand/extract   # must return 402
curl -i -X POST https://brandcanvas.onrender.com/brand/extract  # must return 402 + PAYMENT-REQUIRED header
```

## Differentiation

| What others build | What BrandCanvas does |
|---|---|
| Image generation wrappers (DALL-E, Midjourney) | Brand system creation — colors, fonts, guidelines |
| "Generate a logo" tools | Design intelligence — extract + create brand identities |
| Generic creative assistants | Structured output that agents can use directly |

BrandCanvas creates brand identities — color systems, typography, design guidelines. The extraction side is input; the creation side is output. Together = a complete branding service with verifiable on-chain provenance.
