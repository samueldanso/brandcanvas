# CLAUDE.md

This file provides guidance to coding Agents Claude Code / OpenCode / Codex when working with code in this repository.

## Project

**BrandCanvas** — an A2MCP agent  that delivers brand kit intelligence via x402-gated endpoints. Agents call endpoints directly; payment settles per call in USDT0 on X Layer. No login, no session state, no UI.



## Commands

```bash
bun install          # install deps (includes playwright)
bunx playwright install chromium  # install Chromium after bun install
bun run dev          # hot-reload dev server on :3000
bun run lint         # biome lint
bun run format       # biome format (auto-fix)
bun run check        # biome lint + format check
bun run test         # vitest run
```

## Stack

- **Runtime:** Bun + Hono
- **Payment:** `@okxweb3/x402-hono` + `@okxweb3/x402-evm` + `@okxweb3/x402-core`
- **AI:** Claude Sonnet 4.6 on AWS Bedrock (`my-bedrock-profile`, `us-east-1`)
- **Extraction:** Playwright (headless Chromium)
- **Color processing:** `culori` — already used in brandpull
- **Settlement:** X Layer `eip155:196`, USDT0 `0x779ded0c9e1022225f8e0630b35a9b54be713736`
- **Deploy:** Render (Docker — required for Playwright/Chromium)

## Architecture

Seven paid endpoints, all x402-gated:

| Endpoint | Purpose | Price | Type |
|---|---|---|---|
| `/brand/extract` | URL → complete brand kit JSON (colors, fonts, logo, components) | $0.30 | Extraction |
| `/brand/colors` | URL → color system (primary, secondary, accent, neutrals + HEX) | $0.05 | Extraction |
| `/brand/typography` | URL → font families, weights, scale, stacks | $0.05 | Extraction |
| `/brand/assets` | URL → logo URLs (SVG/PNG), favicon, OG images | $0.05 | Extraction |
| `/palette/generate` | Mood + industry → 5-color palette + contrast ratios | $0.05 | Generation |
| `/fonts/pair` | Style + mood → 3 font pairings + Google Fonts CDN links | $0.05 | Generation |
| `/brand/guidelines` | Brand name + values → formatted brand guidelines doc | $0.10 | Generation |

Entry point: `src/index.ts` (Hono app, Bun default export).


## Environment Variables

```bash
WALLET_ADDRESS=0x<X-Layer-EVM-address>
OKX_API_KEY=...
OKX_SECRET_KEY=...
OKX_PASSPHRASE=...
AWS_PROFILE=my-bedrock-profile
AWS_REGION=us-east-1
PORT=3000
```

## Strict Rules

### OKX Documentation Source of Truth

When uncertain about OKX.AI, Onchain OS, x402 protocol, or payment SDK behavior, consult these sources **in order**:

1. **Primary:** `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SamuelOS/Knowledge/Sources/` — OKX docs archive
2. **Project context:** `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SamuelOS/Projects/BrandCanvas.md`
3. **SDK reference:** `references/payments/` and `references/onchainos-skills/` in this repo


### Project Status Log

After each major update, append a dated entry to:
**`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SamuelOS/Projects/BrandCanvas.md`**

## Key Docs

- `docs/BRANDCANVAS.md` — implementation overview, stack, traps, build phases
- `docs/ideas/PRD.md` — full product spec (single source of truth for endpoints, pricing, deploy)


## Onchain OS CLI

The `onchainos` binary is at `/Users/samueldanso/.local/bin/onchainos`. Use it directly for wallet and payment operations.

```bash
onchainos wallet status
onchainos wallet balance
onchainos wallet login
onchainos payment pay
```

### Available OKX skills

`okx-agent-payments-protocol` · `okx-agentic-wallet` · `okx-ai` · `okx-dapp-discovery` · `okx-defi` · `okx-dex-market` · `okx-growth-competition` · `okx-guide`

## Development Process

Use the `superpowers:subagent-driven-development` skill for all implementation work.

## GitHub Merge Rule

**Never squash merges.** Use `gh pr merge --merge --delete-branch`.
