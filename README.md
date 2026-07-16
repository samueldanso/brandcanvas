# BrandCanvas

AI brand identity artist — generates visual brand systems with on-chain IP provenance.

BrandCanvas is an A2MCP agent on [OKX.AI](https://okx.ai/agents/5331) that creates original brand identities on demand. Describe a mood, industry, or aesthetic — receive a complete visual system: color palettes, curated font pairings, and brand guidelines. Every creation mints as an ERC-721 NFT on X Layer, establishing cryptographic proof of authorship and timestamp. Payment settles per call in USDT0 via the x402 protocol.

## Why BrandCanvas

1. **Generative brand art** — Original color palettes, typography specimens, and identity cards created from your creative brief. Not image generation — brand system creation.
2. **On-chain IP ownership** — Every generated asset mints as an ERC-721 with a content hash proving what was created, when, and by whom.
3. **Structured creative output** — CSS custom properties, Tailwind configs, Google Fonts imports, WCAG contrast ratios. Art you can ship.
4. **Live brand study** — Need inspiration? Point at any URL and extract the complete visual language — colors, fonts, spacing, components — as creative reference.
5. **X Layer native** — Payment in USDT0, NFTs on X Layer, provenance on X Layer. Full lifecycle on one chain.

## Endpoints

### Generate — create brand assets + mint NFT

| Endpoint | What it does | Price |
|---|---|---|
| `POST /palette/generate` | Mood + industry → 5-color palette with harmony, WCAG contrast, CSS vars, Tailwind config + NFT | $0.10 |
| `POST /fonts/pair` | Style + mood → 3 curated font pairings with type scale and CDN links + NFT | $0.10 |
| `POST /brand/guidelines` | Brand values + audience → complete brand guidelines with voice, color system, typography + NFT | $0.15 |

### Study — extract visual identity from any live brand

| Endpoint | What it does | Price |
|---|---|---|
| `POST /brand/extract` | Any URL → complete brand kit (colors, fonts, logo, spacing, components) | $0.50 |
| `POST /brand/colors` | URL → color system as hex values | $0.10 |
| `POST /brand/typography` | URL → font families, weights, size scale | $0.10 |
| `POST /brand/assets` | URL → logo (SVG/PNG), favicon, OG image — scored and ranked | $0.10 |

### Public (no payment)

| Endpoint | Returns |
|---|---|
| `GET /assets/:tokenId/image` | Generative SVG art for any minted token |
| `GET /assets/:tokenId/metadata` | Full token metadata + owner + contract |

## How it works

```
Creative brief (mood, industry, values)
        ↓
Claude generates brand identity
        ↓
Content hashed (keccak256)
        ↓
ERC-721 minted to payer on X Layer
        ↓
Structured art + NFT delivered

--- or ---

Live URL → browser renders → visual identity extracted → delivered as creative reference
```

## Stack

| Layer | Tech |
|---|---|
| Runtime | Bun + Hono |
| Payment | x402 protocol — USDT0 on X Layer (`eip155:196`) |
| Generation | Claude Sonnet 4.6 on AWS Bedrock |
| Extraction | Playwright headless Chromium + Claude Sonnet 4.6 |
| NFT | BrandKitNFT (ERC-721) — `0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B` |
| Deploy | Docker on Render |

## Quick Start

```bash
bun install
bunx playwright install chromium
bun run dev
```

## Links

- **Marketplace:** [okx.ai/agents/5331](https://okx.ai/agents/5331)
- **Landing page:** [brandcanvas-ai.vercel.app](https://brandcanvas-ai.vercel.app)
- **Live API:** [brandcanvas.onrender.com](https://brandcanvas.onrender.com)
- **NFT contract:** [0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B](https://www.okx.com/explorer/xlayer/address/0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B)

## License

MIT
