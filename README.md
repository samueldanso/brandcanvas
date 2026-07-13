# BrandCanvas

> Extract any brand. Create and own new ones.

Brand intelligence and IP provenance for agents. Extract real brand tokens from any live URL using headless browser rendering. Generate original brand identities and mint a provenance hash directly onto X Layer to prove authorship — instant, immutable, verifiable.

## Services

### Brand Intelligence (Extraction)

| Endpoint | What you get | Price |
|---|---|---|
| `POST /brand/extract` | Complete brand kit — colors, fonts, logo SVG, spacing, components, personality. Full headless Chromium render + AI refinement pass. | $0.50 |
| `POST /brand/colors` | Color system — primary, secondary, accent, neutrals, background, text. Hex values from computed CSS. | $0.10 |
| `POST /brand/typography` | Font families, weights, size scale, heading/body/paragraph stacks. | $0.10 |
| `POST /brand/assets` | Logo URL (SVG/PNG), favicon, OG image, Twitter card. Direct links from the live page. | $0.10 |

Powered by headless Chromium rendering the actual page. Returns what the browser computes — not what an LLM guesses from raw HTML.

### Brand Creation + IP Provenance (Generation)

| Endpoint | What you get | Price |
|---|---|---|
| `POST /palette/generate` | 5-color palette with hex, roles, usage guidance, WCAG contrast ratios. Provenance hash minted on X Layer. | $0.10 |
| `POST /fonts/pair` | 3 font pairings with Google Fonts CDN links, CSS snippets, rationale. Provenance hash minted on X Layer. | $0.10 |
| `POST /brand/guidelines` | Full brand guidelines — mission, voice, tone, color rules, typography rules. Provenance hash minted on X Layer. | $0.15 |

Every generated asset is hashed and minted on X Layer at the moment of creation. The on-chain record ties the content hash to the creator wallet and block timestamp — establishing authorship that any agent can independently verify.

```json
{
  "provenance": {
    "contentHash": "0xabc...",
    "txHash": "0x123...",
    "creator": "0x37fafa3e36aa5c0d6ef35627fd66d5991a6fd4d1",
    "chain": "X Layer (eip155:196)",
    "explorerUrl": "https://www.okx.com/explorer/xlayer/tx/0x123..."
  }
}
```

## How It Works

**Extract** — Playwright launches headless Chromium, navigates to the target URL, waits for render, and evaluates the DOM. Colors are extracted from computed `getComputedStyle()` values, not parsed from source. Fonts from resolved font stacks. Logos scored by header position, alt text, and href context. An optional Claude pass refines color roles, cleans font names, and classifies buttons.

**Create + Mint** — Claude generates structured brand assets from your parameters. The output JSON is hashed (`keccak256`), and the hash is written to a registry contract on X Layer in the same call. You receive the brand asset and the on-chain proof together.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Bun + Hono |
| Payment | x402 protocol — `@okxweb3/x402-hono`, USDT0 on X Layer |
| Extraction | Playwright (headless Chromium) + Claude Sonnet 4.6 (Bedrock) |
| Generation | Claude Sonnet 4.6 on AWS Bedrock |
| IP Provenance | BrandKitRegistry contract on X Layer |
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
