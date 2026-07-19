# AGENTS.md

Instructions for AI coding agents working on this repository.

## Project

**BrandCanvas** — AI brand identity artist on [OKX.AI](https://okx.ai/agents/5331). Generates original brand systems (color palettes, typography specimens, brand guidelines) and mints each creation as an ERC-721 NFT on X Layer with on-chain IP provenance. Can also study any live brand's visual identity for creative reference. Payment settles per call in USDT0 via the x402 protocol.

## Commands

```bash
bun install                        # install deps
bunx playwright install chromium   # browser for extraction
bun run dev                        # dev server on :3000
bun run lint                       # biome lint
bun run format                     # biome format
bun run check                      # lint + format check
bun run test                       # vitest
```

## Architecture

Entry point: `src/index.ts` (Hono app, Bun default export).

### Endpoints (all x402-gated, handle GET + POST)

| Route               | Handler                          | Price | Type |
| ------------------- | -------------------------------- | ----- | ---- |
| `/palette/generate` | `src/routes/palette-generate.ts` | $0.10 | Generate + NFT |
| `/fonts/pair`       | `src/routes/fonts-pair.ts`       | $0.10 | Generate + NFT |
| `/brand/guidelines` | `src/routes/brand-guidelines.ts` | $0.15 | Generate + NFT |
| `/brand/extract`    | `src/routes/brand-extract.ts`    | $0.50 | Brand Study |
| `/brand/colors`     | `src/routes/brand-colors.ts`     | $0.10 | Brand Study |
| `/brand/typography` | `src/routes/brand-typography.ts` | $0.10 | Brand Study |
| `/brand/assets`     | `src/routes/brand-assets.ts`     | $0.10 | Brand Study |

### Public endpoints (no payment)

| Route                       | Handler                    |
| --------------------------- | -------------------------- |
| `/delivery/:tokenId`        | `src/routes/delivery.ts`   |
| `/assets/:tokenId/image`    | `src/routes/assets.ts`     |
| `/assets/:tokenId/metadata` | `src/routes/assets.ts`     |
| `/health`                   | inline in `src/index.ts`   |
| `/`                         | inline in `src/index.ts`   |

### Key modules

| Path                            | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| `src/lib/bedrock.ts`            | AWS Bedrock client (Claude Sonnet 4.6)         |
| `src/lib/nft.ts`                | ERC-721 minting on X Layer                     |
| `src/lib/svg.ts`                | Generative SVG artwork for NFT minting         |
| `src/lib/pinata.ts`             | IPFS pinning (PNG artwork + metadata JSON)     |
| `src/lib/delivery-templates.ts` | HTML templates for visual delivery pages       |
| `src/lib/metadata-registry.ts`  | In-memory registry mapping tokenId → IPFS URLs |
| `src/routes/delivery.ts`        | Visual presentation page per token             |
| `src/branding/index.ts`         | Live brand study (Playwright extraction)       |
| `src/branding/page-script.ts`   | In-page DOM evaluation script                  |
| `src/branding/processor.ts`     | Raw data → structured brand profile            |
| `src/branding/colors.ts`        | Color utilities (hexify, isVibrant, isGrayish) |
| `src/branding/logo.ts`          | Logo scoring and selection                     |
| `contracts/src/BrandKitNFT.sol` | ERC-721 contract (deployed on X Layer)         |

## Stack

- **Runtime:** Bun + Hono
- **Payment:** `@okxweb3/x402-hono` + `@okxweb3/x402-evm` + `@okxweb3/x402-core`
- **AI:** Claude Sonnet 4.6 on AWS Bedrock
- **Brand Study:** Playwright (headless Chromium)
- **NFT:** ERC-721 on X Layer — `0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B`
- **Deploy:** Docker on Render

## Environment Variables

```bash
WALLET_ADDRESS=0x...          # X Layer EVM address (payment recipient)
OKX_API_KEY=...               # OKX SA API key
OKX_SECRET_KEY=...            # OKX SA secret
OKX_PASSPHRASE=...            # OKX SA passphrase
AWS_PROFILE=my-bedrock-profile
AWS_REGION=us-east-1
PORT=3000
```

## Rules

- Every endpoint must handle both GET and POST (OKX probes with bare GET).
- Payment gate fires before param validation — never return 400 before 402.
- CORS must explicitly list `PAYMENT-SIGNATURE` header and expose `PAYMENT-REQUIRED` and `PAYMENT-RESPONSE`.
- The `references/` folder is READ-ONLY context. Never import from it.
- No LLM-hallucinated brand data. Brand study uses real browser rendering.
- No stubs in production. Every endpoint returns real output.
