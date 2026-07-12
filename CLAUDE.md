# CLAUDE.md

This file provides guidance to Claude Code / OpenCode when working with code in this repository.

## Project

**BrandCanvas** — an A2MCP agent (not a web app) that delivers brand intelligence via x402-gated endpoints. Agents call endpoints directly; payment settles per call in USDT0 on X Layer. No login, no session state, no UI.

Hackathon: OKX.AI Genesis Hackathon · Deadline Jul 17 2026

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
- **Extraction:** Playwright (headless Chromium) — port from `references/brandpull/src/`
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

## Critical Implementation Strategy — Read This First

### Port brandpull, don't rewrite

The extraction core already exists in `references/brandpull/src/`. Port it directly:

| Source file | What it does | Destination |
|---|---|---|
| `references/brandpull/src/branding/index.ts` | `extractBranding()` — Playwright launch, navigate, evaluate, close | `src/branding/index.ts` |
| `references/brandpull/src/branding/page-script.ts` | In-page DOM evaluation — runs inside browser context | `src/branding/page-script.ts` |
| `references/brandpull/src/branding/processor.ts` | `processRawBranding()` — color inference, fonts, buttons, inputs | `src/branding/processor.ts` |
| `references/brandpull/src/branding/colors.ts` | `hexify()`, `isVibrant()`, `isGrayish()` | `src/branding/colors.ts` |
| `references/brandpull/src/branding/logo.ts` | `selectLogoWithConfidence()` — logo scoring | `src/branding/logo.ts` |
| `references/brandpull/src/branding/types.ts` | `BrandingProfile`, `RawBrandingData` | `src/branding/types.ts` |

**One required change:** `references/brandpull/src/branding/llm.ts` calls `openai/v1/chat/completions`. Replace with `@aws-sdk/client-bedrock-runtime` `InvokeModelCommand`. Same prompt, same JSON output shape. Use the Bedrock client pattern from `references/payments/` or from `~/Workspace/Hacks/skin-beauty-agent/src/lib/bedrock.ts` (Glowfy's confirmed working Bedrock client — copy it).

**Required Playwright launch flags (confirmed from spike):**
```ts
await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
})
```

### Generation endpoints (Bedrock only)

`/palette/generate`, `/fonts/pair`, `/brand/guidelines` — pure Bedrock Claude calls. No external APIs. Use the same Bedrock client pattern from Glowfy (`src/lib/bedrock.ts`). Structured JSON output via prompt — same pattern used throughout Glowfy.

## Critical x402 Rules

These are confirmed failure modes from OKX validator (validated on Glowfy) — violating any one causes ASP rejection:

1. **Every endpoint must handle both GET and POST** — OKX probes with bare GET. POST-only → 405 → validator fails.
2. **PAYMENT-REQUIRED header must be present** — validator reads the header, not body. Use the SDK (don't implement x402 manually).
3. **CORS: explicitly list headers** — `Access-Control-Allow-Headers: *` breaks x402. Must explicitly list `PAYMENT-SIGNATURE`. Must expose `PAYMENT-REQUIRED` and `PAYMENT-RESPONSE`.
4. **Payment gate fires before param validation** — never return 400 before 402.
5. **`await resourceServer.initialize()` must run after server starts** — without it, facilitator can't sync supported kinds and all 402 challenges fail.
6. **OKX SA API keys are required** — `OKXFacilitatorClient` needs `apiKey`, `secretKey`, `passphrase` for on-chain settlement.

Validation self-check:
```bash
curl -i -X GET https://your-domain/brand/extract   # must return 402
curl -i -X POST https://your-domain/brand/extract  # must return 402 + PAYMENT-REQUIRED header
```

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
4. **Glowfy reference:** `~/Workspace/Hacks/skin-beauty-agent/` — confirmed working x402 + Bedrock implementation. Read it when stuck on payment or AI patterns.

Do NOT guess or hallucinate OKX API behavior. If a question about x402, payment flows, or Onchain OS cannot be answered from these sources, say so explicitly.

### AI & Framework References

- **AI engineering:** `/Users/samueldanso/Resources/learn/ai-engineering-from-scratch`
- **Hono patterns:** `/Users/samueldanso/Resources/learn/hono-api-with-auth-crash-course`

### References Folder

The `references/` folder is **READ-ONLY context**. Never include it in the project build, never import from it, never add it to bundler/tsconfig paths. Port code INTO `src/` — never import across.

### Project Status Log

After each major update, append a dated entry to:
**`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SamuelOS/Projects/BrandCanvas.md`**

## Key Docs

- `docs/BRANDCANVAS.md` — implementation overview, stack, traps, build phases
- `docs/ideas/PRD.md` — full product spec (single source of truth for endpoints, pricing, deploy)
- `references/brandpull/` — extraction core to port (READ-ONLY)
- `references/payments/` — OKX x402 SDK reference (READ-ONLY)
- `references/onchainos-skills/` — Onchain OS CLI skills (READ-ONLY)

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

## Competition Standard

5000+ submissions, 3 winners per category.

**Non-negotiable rules:**
- **No rewriting what already works.** brandpull extraction is production-proven — port it, don't rewrite it.
- **No faking data.** Real Playwright extraction only. Generation endpoints must produce coherent, useful output.
- **No stubs in production.** Every endpoint returns real output.
- **No LLM-hallucinated brand data.** The value prop is real browser rendering — if we fake it, we undermine the entire product.
- **Production-grade or don't ship.**

## Known Gotchas

- The bare `onchainos` CLI v4.2.0–v4.2.2 has provisioning bugs. Always run Onchain OS through an agent.
- Playwright requires `--no-sandbox` in Linux/Docker. Already confirmed in spike.
- `better-sqlite3` is NOT needed — BrandCanvas has no DB. Extraction is stateless per-call.
