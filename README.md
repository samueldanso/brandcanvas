# BrandCanvas

> Extract any brand. Create and own new ones.

Brand intelligence and on-chain IP for the agentic economy. When a new project or agent spawns, it needs immediate, cohesive brand assets — extract an existing brand kit from any live URL with headless browser rendering, or create a new brand identity and mint a provenance hash directly onto X Layer to prove authorship.

Agent pays → AI generates a brand identity → ERC-721 NFT mints directly to the payer's wallet on X Layer → they own that brand asset as a verifiable on-chain IP.

## Services

### Brand Intelligence (Extraction)

| Endpoint | What you get | Price |
|---|---|---|
| `POST /brand/extract` | Complete brand kit — colors, fonts, logo SVG, spacing, components, personality. Full headless Chromium render + AI refinement pass. | $0.50 |
| `POST /brand/colors` | Color system — primary, secondary, accent, neutrals, background, text. Hex values from computed CSS. | $0.10 |
| `POST /brand/typography` | Font families, weights, size scale, heading/body/paragraph stacks. | $0.10 |
| `POST /brand/assets` | Logo URL (SVG/PNG), favicon, OG image, Twitter card. Direct links from the live page. | $0.10 |

Powered by headless Chromium rendering the actual page. Returns what the browser computes — not what an LLM guesses from raw HTML.

### Brand Creation + On-Chain IP (Generation → NFT Mint)

| Endpoint | What you get | Price |
|---|---|---|
| `POST /palette/generate` | 5-color palette with hex, roles, WCAG contrast. **ERC-721 NFT minted to your wallet on X Layer.** | $0.10 |
| `POST /fonts/pair` | 3 font pairings + Google Fonts CDN links + CSS. **ERC-721 NFT minted to your wallet on X Layer.** | $0.10 |
| `POST /brand/guidelines` | Structured brand guidelines — mission, voice, tone, color rules, typography. **ERC-721 NFT minted to your wallet on X Layer.** | $0.15 |

Every generated brand asset is hashed and minted as an ERC-721 NFT directly to the payer's wallet. The token stores the content hash, kit type, and creation timestamp on-chain — establishing IP authorship that any agent can independently verify.

```json
{
  "nft": {
    "tokenId": 1,
    "contract": "0x5D74842220B4a68D0012C59A871bD47285C6a0cb",
    "owner": "0xfed31f8307cb1a7d6c8bb60f9331f60c7c4a402c",
    "contentHash": "0xabc...",
    "txHash": "0x123...",
    "chain": "X Layer (eip155:196)",
    "explorerUrl": "https://www.okx.com/explorer/xlayer/tx/0x123..."
  }
}
```

## How It Works

**Extract** — Playwright launches headless Chromium, navigates to the target URL, waits for render, and evaluates the DOM. Colors are extracted from computed `getComputedStyle()` values, not parsed from source. Fonts from resolved font stacks. Logos scored by header position, alt text, and href context. An optional Claude pass refines color roles, cleans font names, and classifies buttons.

**Create + Mint** — Claude generates structured brand assets from your parameters. The output JSON is hashed (`keccak256`) and an ERC-721 NFT is minted directly to the payer's wallet on X Layer in the same call. You receive the brand asset JSON and a real NFT proving you own it.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Bun + Hono |
| Payment | x402 protocol — `@okxweb3/x402-hono`, USDT0 on X Layer |
| Extraction | Playwright (headless Chromium) + Claude Sonnet 4.6 (Bedrock) |
| Generation | Claude Sonnet 4.6 on AWS Bedrock |
| IP Provenance | BrandKitNFT (ERC-721) on X Layer — `0x5D74842220B4a68D0012C59A871bD47285C6a0cb` |
| Deploy | Docker on Render |

## Quick Start

```bash
# Probe any endpoint — returns 402 with payment requirements
curl -i https://brandcanvas.onrender.com/brand/extract

# After x402 payment:
curl -X POST https://brandcanvas.onrender.com/palette/generate \
  -H "Content-Type: application/json" \
  -H "PAYMENT-SIGNATURE: <signed_payload>" \
  -d '{"mood": "bold", "industry": "fintech"}'
```

## Development

```bash
bun install
bunx playwright install chromium
bun run dev
```
