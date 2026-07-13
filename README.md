# BrandCanvas

> Create brand identities. Own them on-chain.

Brand design assets with on-chain ownership. Extract from any live URL or generate new ones — every creation mints an NFT directly to your wallet on X Layer. You get the brand kit AND verifiable IP provenance in one call.

One agent. Two entry points. You walk away owning it.

```
URL → headless browser render → brand kit extracted
                                        ↓
Parameters → AI generation → brand identity created
                                        ↓
                              content hashed (keccak256)
                                        ↓
                              programmatic SVG art composed
                                        ↓
                              ERC-721 minted to payer on X Layer
                                        ↓
                              provenance established: owner, hash, timestamp
```

## Endpoints

### Extract — Pull any existing brand with browser precision

| Endpoint | Output | Price |
|---|---|---|
| `POST /brand/extract` | Complete brand kit — colors, fonts, logo SVG, spacing, components, design tokens. Headless Chromium + AI pass. | $0.50 |
| `POST /brand/colors` | Color system as hex — primary, secondary, accent, neutrals, text. From computed CSS. | $0.10 |
| `POST /brand/typography` | Font families, weights, size scale, heading/body stacks. From resolved styles. | $0.10 |
| `POST /brand/assets` | Logo URL (SVG/PNG), favicon, OG image. Scored and ranked. | $0.10 |

### Create + Own — Generate new brand assets, mint as on-chain IP

| Endpoint | Output | Price |
|---|---|---|
| `POST /palette/generate` | 5-color system + CSS vars + Tailwind config + WCAG contrast + SVG art + **ERC-721 NFT** | $0.10 |
| `POST /fonts/pair` | 3 font pairings + CDN links + type scale + HTML imports + SVG specimen + **ERC-721 NFT** | $0.10 |
| `POST /brand/guidelines` | Brand guidelines + voice + color system + typography + usage rules + SVG card + **ERC-721 NFT** | $0.15 |

Every generation call mints an ERC-721 to the payer's wallet. The NFT carries:
- Programmatic SVG art (unique per output, fully on-chain)
- Content hash proving what was generated
- Creator wallet address
- Block timestamp establishing provenance

```json
{
  "nft": {
    "tokenId": 1,
    "contract": "0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B",
    "owner": "0xfed31f8307cb1a7d6c8bb60f9331f60c7c4a402c",
    "contentHash": "0x5daa...",
    "txHash": "0xc340...",
    "svgUrl": "https://brandcanvas.onrender.com/assets/1.svg",
    "explorerUrl": "https://www.okx.com/explorer/xlayer/tx/0xc340..."
  }
}
```

### Public Asset Endpoints (no payment required)

| Endpoint | Returns |
|---|---|
| `GET /assets/{tokenId}.svg` | The generative SVG art for any minted token |
| `GET /assets/{tokenId}.json` | Full token metadata + owner + contract |

## Why this is different

Other Art Creation agents generate images from prompts. BrandCanvas is a **complete brand asset pipeline**:

1. **Real browser rendering** — Playwright executes CSS and returns actual computed values. LLMs reading HTML cannot do this.
2. **Structured, actionable output** — Not a PNG. CSS custom properties, Tailwind configs, Google Fonts imports. Ready to ship.
3. **On-chain IP ownership** — Every generated asset is minted as an ERC-721 with provenance. Not a receipt — a real NFT with generative art you hold in your wallet.
4. **X Layer native** — Payment settles in USDT0, NFTs mint on X Layer, provenance lives on X Layer. Full lifecycle on one chain.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Bun + Hono |
| Payment | x402 protocol — USDT0 on X Layer (`eip155:196`) |
| Extraction | Playwright headless Chromium + Claude Sonnet 4.6 (Bedrock) |
| Generation | Claude Sonnet 4.6 on AWS Bedrock |
| Art | Programmatic SVG — deterministic compositions from brand parameters |
| IP | BrandKitNFT (ERC-721) — `0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B` |
| Deploy | Docker on Render |

## Development

```bash
bun install
bunx playwright install chromium
bun run dev
```
