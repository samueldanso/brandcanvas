# BrandCanvas

Brand kits from any URL — verifiable on-chain.

BrandCanvas is an A2MCP agent on [OKX.AI](https://okx.ai/agents/5331) that extracts brand assets from live websites using headless browser rendering, or generates new brand identities from scratch. Every generated asset mints a provenance hash on X Layer as an ERC-721 NFT. Payment settles per call in USDT via the x402 protocol on X Lyer.

## Why BrandCanvas

Other agents in the Art Creation category generate images from prompts. BrandCanvas is different:

1. **Real browser rendering** — Playwright executes CSS and returns actual computed values. No LLM hallucination of brand data.
2. **Structured, actionable output** — CSS custom properties, Tailwind configs, Google Fonts imports. Ready to ship, not a PNG.
3. **On-chain IP ownership** — Every generated asset mints as an ERC-721 with a content hash proving what was created, when, and by whom.
4. **X Layer native** — Payment in USDT0, NFTs on X Layer, provenance on X Layer. Full lifecycle on one chain.

## Endpoints

### Extract — pull brand data from any URL

| Endpoint | What it does | Price |
|---|---|---|
| `POST /brand/extract` | Complete brand kit — colors, fonts, logo, spacing, components | $0.50 |
| `POST /brand/colors` | Color system as hex values from computed CSS | $0.10 |
| `POST /brand/typography` | Font families, weights, size scale from resolved styles | $0.10 |
| `POST /brand/assets` | Logo (SVG/PNG), favicon, OG image — scored and ranked | $0.10 |

### Generate — create new brand assets + mint NFT

| Endpoint | What it does | Price |
|---|---|---|
| `POST /palette/generate` | 5-color palette + CSS vars + Tailwind config + WCAG contrast + NFT | $0.10 |
| `POST /fonts/pair` | 3 font pairings + CDN links + type scale + NFT | $0.10 |
| `POST /brand/guidelines` | Brand guidelines + voice + color system + typography + NFT | $0.15 |

### Public (no payment)

| Endpoint | Returns |
|---|---|
| `GET /assets/:tokenId/image` | Generative SVG art for any minted token |
| `GET /assets/:tokenId/metadata` | Full token metadata + owner + contract |

## Stack

| Layer | Tech |
|---|---|
| Runtime | Bun + Hono |
| Payment | x402 protocol — USDT0 on X Layer (`eip155:196`) |
| Extraction | Playwright headless Chromium + Claude Sonnet 4.6 (Bedrock) |
| Generation | Claude Sonnet 4.6 on AWS Bedrock |
| NFT | BrandKitNFT (ERC-721) — `0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B` |
| Deploy | Docker on Render |

## How it works

```
URL → Playwright renders page → computed styles extracted
                                        ↓
Parameters → Claude generates → brand identity created
                                        ↓
                              content hashed (keccak256)
                                        ↓
                              ERC-721 minted to payer on X Layer
```

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
