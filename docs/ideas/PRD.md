# BrandForge — Agent-Native Brand Intelligence & Creation

## What

An always-on A2MCP agent that provides pay-per-call brand intelligence — extract brand identity from any live website AND generate brand materials from scratch. The "design system as a service" for agents. URL in → brand kit out. Description in → brand identity created. Paid via x402 micropayments.

## For Who

Design agents, content creation agents, white-label agents, marketing agents, website builders, any agent producing branded work for a client. Also: founders, solo creators, and startups who need brand identity without hiring a designer.

## Problem

Design and content agents start work for a brand/client. They need the EXACT brand kit — logos, colors, fonts, spacing — not approximations. Currently they ask the human (breaks agent autonomy) or guess (creates off-brand work that gets rejected). On the creation side: founders need brand identities but can't afford $5K for a branding agency. No tool on OKX.AI gives agents instant, structured brand data from a live URL OR generates brand systems from a description.

LLMs CANNOT do this by prompting alone. Extracting a brand kit requires RENDERING the page (executing CSS, resolving cascade, computing final styles). An LLM reading raw HTML cannot tell you the actual computed color — it sees CSS variables, media queries, and cascading rules. Only a real browser engine produces the truth.

## Market Context (Researched July 12 2026)

### Competitive landscape

| Tool | Approach | Effective $/call | Key weakness |
|---|---|---|---|
| **Brandfetch** | Static DB (44M brands) | $0.013–$0.10 overage | Fails on new/private/SMB brands (85% miss rate on 300M+ sites). Subscription required. No generation. |
| **Context.dev** | DB + AI fallback | $0.016/call | Cached quarterly — first-time lookups 10–30s. Subscription required. No generation. |
| **Sivi AI** | Queue-based async | $0.038–$0.112/call | Slow, incomplete, intake for their own pipeline — not standalone. No per-call pricing. |
| **Logo.dev** | DB images only | $0.0001/image | Logo only. No brand kit. No generation. |
| **Clearbit** | DB | — | **DEAD — shut down Dec 8 2025** (HubSpot). Migration wave unserved. |
| **@brandsystem/mcp** | Headless Chrome MCP | Free (self-hosted) | Lives in Claude/VS Code dev tool world — not monetized, not on OKX.AI. |
| **Web3 Brand Workflow** | OKX.AI, manual/negotiable | Negotiable | **0 sales.** Poorly differentiated, human-freelancer model. |

**Nobody does per-call agent-native pricing. Nobody generates. BrandForge is the only agent on OKX.AI doing real-browser extraction.**

### PMF evidence

Brandfetch case studies (hard numbers):
- **Typeform**: 5% free→paid conversion lift using brand API on onboarding
- **Pitch**: 3× template adoption after brand integration
- **LottieFiles**: Domain → instant branded workspace at signup
- Total: >1 billion API calls processed by Brandfetch alone

Clearbit shutdown (Dec 2025) created an unserved migration wave — Reddit r/webdev thread went viral.

Per-call pricing has zero market precedent — every competitor requires $49–$129/mo minimums. An agent doing a one-off job cannot amortize a monthly subscription.

### Pricing verdict

| Endpoint | BrandForge price | Closest comparable | Verdict |
|---|---|---|---|
| `/brand/extract` | $0.30 | Brandfetch overage: $0.10 (cached DB) | Justified — live Playwright extraction covers any URL Brandfetch misses |
| `/brand/colors` | $0.05 | No per-component pricing exists | Competitive |
| `/brand/typography` | $0.05 | No standalone option exists | Competitive |
| `/palette/generate` | $0.05 | Nobody offers this | Underpriced — could go $0.10 |
| `/fonts/pair` | $0.05 | Nobody offers this | Unique |
| `/brand/guidelines` | $0.10 | Nobody generates guidelines | Unique |

### OKX.AI Art Creation category (live snapshot)

- `dealer.exe` — 10 sales, $0.001 (trading card + avatar gen)
- `Eat This?` — 539 sales, $0.01 (food photo health assessment) — top seller pattern: sharp use case, ultra-low price, structured JSON output, 5.0 rating
- `Onchain Data Explorer` — 652 sales, $0.5 (Finance category) — proves higher-priced structured data agents work
- `Web3 Brand Workflow` — **0 sales**, negotiable — the cautionary tale
- **Zero URL→brand-kit agents on the platform. Category is open.**

### 3 gaps BrandForge owns

1. **Per-call no-subscription pricing** — first and only brand intelligence service with zero-subscription agent access
2. **Live extraction for the 99%** — Brandfetch covers 44M brands; 300M+ websites exist. Playwright renders anything, any time
3. **Generation, not just retrieval** — nobody generates palettes, font pairs, or brand guidelines via API at any price

## How the Business Works

BrandForge is an agent-run business — a one-person company (OPC) where the agent IS the service provider. It runs a full branding consultancy autonomously: serves design agents with extraction, serves founders with brand creation, collects payment per call, scales without limits.

**Analogies:**
- A branding agency that works in 10 seconds, charges $0.05–0.30/call instead of $5K/project
- BrandPull (extraction) + Coolors/Fontjoy (generation) combined into one agent service
- The "design token API" for the agent economy

## Revenue Model

**Pricing:** Pay-per-call via x402 micropayments.

| Tier | Endpoints | Price | Rationale |
|------|-----------|-------|-----------|
| Quick extractions | colors, typography, assets | $0.05 | Fast, single-dimension |
| Full extraction | full-kit | $0.30 | Comprehensive, high compute (renders page) |
| Generation | palette-gen, font-pair, guidelines | $0.05-0.10 | Creative output, LLM-powered |

**Revenue math (during hackathon campaign 3-4 days):**
- Self-buy: 200 calls × $0.05 avg = $10 cost / $10 revenue
- ScoutGate: 7 endpoints × auto-test = ~14+ purchases/reviews
- Organic: share in TG + X post
- Target: 300+ orders, $15-30 revenue

## Scope

### In Scope (MVP — build in 1.5 days)

**7 A2MCP endpoints:**

| # | Endpoint | Input | Output | Price | Type |
|---|----------|-------|--------|-------|------|
| 1 | `/brand/extract` | URL | Complete brand kit JSON: colors, fonts, assets, spacing, components | $0.30 | Extraction |
| 2 | `/brand/colors` | URL | Color system: primary, secondary, accent, neutrals + HEX + usage context | $0.05 | Extraction |
| 3 | `/brand/typography` | URL | Font families, weights, scale ratios, line heights, heading/body stacks | $0.05 | Extraction |
| 4 | `/brand/assets` | URL | Logo URLs (SVG/PNG), favicon, OG images, brand imagery | $0.05 | Extraction |
| 5 | `/palette/generate` | Mood + industry + adjectives (e.g. "bold, fintech, trustworthy") | 5-color palette with HEX, names, usage suggestions, contrast ratios | $0.05 | Creation |
| 6 | `/fonts/pair` | Style + use case + mood | 3 font pairing suggestions with Google Fonts CDN links + CSS snippets | $0.05 | Creation |
| 7 | `/brand/guidelines` | Brand name + values + audience + color preferences | Formatted brand guidelines: mission statement, color usage, typography rules, voice & tone | $0.10 | Creation |

### Out of Scope

- Logo generation (image gen — too generic, everyone else will do this)
- Full website redesign
- Print collateral design
- Brand strategy consulting (A2A territory)
- Animated brand assets

## Data Sources & Infrastructure (All FREE, Zero Dependency)

| Component | What it does | Cost | Dependency |
|-----------|-------------|------|------------|
| **brandpull extraction core** | Color extraction, font detection, logo scoring, component extraction — production-proven pipeline. Already built by Samuel. | $0 — your own code | ZERO — self-contained |
| **Playwright** (headless Chromium) | Renders pages, executes CSS, extracts computed styles | $0 — open source | ZERO — runs on your server |
| **culori** | Color parsing, alpha blending, hex normalization | $0 — npm | ZERO |
| **Claude Sonnet 4.6 on Bedrock** | Palette generation, font pairing, brand guidelines, optional LLM enhancement pass on extraction | AWS Bedrock — existing profile | `my-bedrock-profile`, `us-east-1` |
| **Color theory algorithms** | Complementary, analogous, triadic palette math | $0 — math | ZERO — in your code |

**Key advantage:** The extraction pipeline is **pre-validated** — Samuel built brandpull, a production Playwright CLI with color extraction, font detection, logo scoring, and component extraction already working. BrandForge wraps this core as x402-gated Hono endpoints + adds 3 generation endpoints via Bedrock. Not greenfield. Not a spike risk.

## Stack

**OKX-prescribed stack — no substitutions.**

| Layer | Choice | Notes |
|---|---|---|
| **Runtime** | Bun + Hono | Fast, minimal. `@okxweb3/x402-hono` is framework-specific |
| **Payment SDK** | `@okxweb3/x402-hono` | OKX's own SDK. Hono middleware — mounts before all handlers |
| **Extraction core** | brandpull (Samuel's own code) | Production-proven Playwright pipeline — colors, fonts, logos, components. Port directly. |
| **Rendering** | Playwright (headless Chromium in Docker) | Required for computed CSS extraction — LLMs cannot render pages |
| **AI — extraction enhancement** | Claude Sonnet 4.6 on Bedrock (`my-bedrock-profile`, `us-east-1`) | Optional LLM pass to refine logo selection, color roles, font cleanup |
| **AI — generation** | Claude Sonnet 4.6 on Bedrock (same) | `/palette/generate`, `/fonts/pair`, `/brand/guidelines` — no new keys |
| **Color processing** | `culori` | Already used in brandpull — color parsing, alpha blending, hex normalization |
| **Settlement** | X Layer `eip155:196`, USD₮0 `0x779ded0c9e1022225f8e0630b35a9b54be713736`, scheme: `exact` | EIP-3009 single payment per call |
| **Deploy** | Render (Docker — required for Playwright/Chromium) | Hong Kong or Singapore region. Custom domain + HTTPS auto-cert |
| **Domain** | Custom domain + HTTPS cert | Required — OKX rejects IP-only endpoints |

**Amount base units (decimals=6):**
| Price | Amount string |
|---|---|
| $0.05 USDT | `"50000"` |
| $0.10 USDT | `"100000"` |
| $0.30 USDT | `"300000"` |



## Technical Requirements

### ⚠️ CRITICAL #1 — Probe-shape mismatch (confirmed: syke + David Shui | OKX)

**The OKX x402 validator probes endpoints with a bare HTTP GET.**

POST-only endpoints return `405 Method Not Allowed` → validator marks endpoint invalid, even if POST returns a perfect 402. Confirmed root cause of multiple failed ASP listings.

```typescript
// Mount middleware on /* — intercepts all methods including GET
app.use("/*", paymentMiddlewareFromConfig(routes));

// Register routes for GET + POST explicitly
app.on(["GET", "POST"], "/brand/extract", handler);
```

```bash
curl -i -X GET https://your-domain/brand/extract
# ✅ Must return HTTP 402 — NOT 405
```

---

### ⚠️ CRITICAL #2 — PAYMENT-REQUIRED header (confirmed: David Shui | OKX)

**The OKX validator reads the `PAYMENT-REQUIRED` header — not the response body.**

Use `@okxweb3/x402-hono` — it sets the header correctly and automatically. Do not implement x402 manually.

Manual fallback only:
```typescript
const encoded = Buffer.from(JSON.stringify(paymentRequirements)).toString("base64");
return c.json(paymentRequirements, 402, { "PAYMENT-REQUIRED": encoded });
```

---

### SDK install

```bash
bun add @okxweb3/x402-hono @okxweb3/x402-evm @okxweb3/x402-core
```

---

### Correct Hono integration pattern

```typescript
import { paymentMiddlewareFromConfig } from "@okxweb3/x402-hono";

const routes = {
  "/brand/extract":    { accepts: { scheme: "exact", network: "eip155:196", payTo: process.env.WALLET_ADDRESS!, price: "$0.30" } },
  "/brand/colors":     { accepts: { scheme: "exact", network: "eip155:196", payTo: process.env.WALLET_ADDRESS!, price: "$0.05" } },
  "/brand/typography": { accepts: { scheme: "exact", network: "eip155:196", payTo: process.env.WALLET_ADDRESS!, price: "$0.05" } },
  "/brand/assets":     { accepts: { scheme: "exact", network: "eip155:196", payTo: process.env.WALLET_ADDRESS!, price: "$0.05" } },
  "/palette/generate": { accepts: { scheme: "exact", network: "eip155:196", payTo: process.env.WALLET_ADDRESS!, price: "$0.05" } },
  "/fonts/pair":       { accepts: { scheme: "exact", network: "eip155:196", payTo: process.env.WALLET_ADDRESS!, price: "$0.05" } },
  "/brand/guidelines": { accepts: { scheme: "exact", network: "eip155:196", payTo: process.env.WALLET_ADDRESS!, price: "$0.10" } },
};

app.use("/*", paymentMiddlewareFromConfig(routes));
```

---

### Required env vars

```bash
WALLET_ADDRESS=0x<your-X-Layer-EVM-address>   # from Agentic Wallet setup
AWS_PROFILE=my-bedrock-profile                 # already configured
AWS_REGION=us-east-1
```

> No OKX trading API keys needed. `@okxweb3/x402-hono` only needs `WALLET_ADDRESS`. Bedrock uses the existing AWS profile — no new credentials.

---

### Full x402 compliance checklist

- [ ] `bun add @okxweb3/x402-hono @okxweb3/x402-evm @okxweb3/x402-core`
- [ ] `paymentMiddlewareFromConfig(routes)` mounted before all handlers
- [ ] All 7 routes in the routes config with correct prices
- [ ] `OPTIONS` returns 204 (CORS preflight)
- [ ] CORS: `PAYMENT-SIGNATURE` explicitly in `Access-Control-Allow-Headers` — **do NOT use wildcard `*`**
- [ ] CORS: `PAYMENT-REQUIRED` + `PAYMENT-RESPONSE` in `Access-Control-Expose-Headers`
- [ ] Payment gate fires before param validation (middleware order)
- [ ] Public HTTPS domain (not IP)

**Self-check before submitting — test both methods:**
```bash
curl -i -X GET https://your-domain/brand/extract
# ✅ HTTP 402, NOT 405

curl -i -X POST https://your-domain/brand/extract
# ✅ HTTP 402, PAYMENT-REQUIRED: <non-empty base64>
```

---

### ⚠️ onchainos CLI bug

Bare CLI v4.2.0 broken — returns empty `apiKey`, fails all authenticated calls. v4.2.2 upgrade also broken (checksum mismatch). **Always run Onchain OS through an agent (Hermes, Claude Code, OpenCode).** If wallet account gets stuck, register with a new email.

---

### Image requirements (marketplace listing)

OKX exact rejection criteria:
- [ ] Relevant to the service description
- [ ] No text in the image
- [ ] No AI-generated / Claude-generated images
- [ ] No real people, characters, or scenery
- [ ] No borders (makes it look non-square)
- [ ] No rounded corners
- [ ] No transparent or plain white background
- [ ] True 1:1 square aspect ratio



## Why Art Creation (Category Fit)

| What others will build | What BrandForge does |
|----------------------|---------------------|
| Image generation wrappers (DALL-E, Midjourney API) | Brand SYSTEM creation — colors, fonts, guidelines |
| "Generate a logo" tools | Design INTELLIGENCE — extract + create brand identities |
| Generic creative assistants | Structured creative output that agents can USE directly |

BrandForge is Art Creation because it CREATES brand identities — color systems, typography systems, design guidelines. It's a creative design service, not a dev tool. The extraction side is the INPUT; the creation side is the OUTPUT. Together = a complete branding service.

**Not image generation.** That's what everyone else will submit. This is DESIGN SYSTEMS creation — more sophisticated, more useful, more innovative.

## Why This Wins (Filter Check)

| # | Filter | Pass? | Evidence |
|---|--------|-------|----------|
| 1 | Real value + revenue model | ✅ | Per-call x402 |
| 2 | Fits OKX format types | ✅ | Ready-to-use tool, always-on service |
| 3 | OPC, agent-operated 24/7 | ✅ | Runs without human |
| 4 | Fits Art Creation category | ✅ | Creates brand systems (colors, fonts, guidelines) |
| 5 | Sells an outcome | ✅ | Returns brand kit or brand identity |
| 6 | Agent IS the business | ✅ | Branding consultancy run by one agent |
| 7 | Agent-native | ✅ | Structured JSON output agents consume directly |
| 8 | A2MCP callable | ✅ | Per-call x402, instant |
| 9 | Multiple endpoints | ✅ | 7 services |
| 10 | Painful deliverable | ✅ | Agents CANNOT render pages or extract computed styles |
| 11 | High frequency | ✅ | Every new client/project needs brand tokens |
| 12 | Before/after | ✅ | Without: agent guesses brand → off-brand work rejected. With: exact tokens → on-brand work approved |
| 13 | Agent is buyer | ✅ | Design agents, content agents, website builders |
| 14 | LLM + real compute | ✅ | Playwright rendering + color clustering = not promptable |
| 15 | LLMs don't have natively | ✅ | Can't render pages, can't extract computed CSS |

## Competition on OKX.AI

**Direct:** Zero. No brand intelligence or brand creation agents.
**Adjacent:** Otto AI's `/generate-meme` ($0.15) — image gen, not brand systems.
**Expected from hackathon:** Image generation wrappers (DALL-E/Midjourney). We're different — design systems, not pictures.

## Demo Script (90 seconds)

```
[0-10s] "I built BrandForge — brand intelligence for the agent economy"
[10-30s] Show /brand/extract: paste "stripe.com" → complete brand kit JSON: colors (#635BFF, #0A2540...), fonts (Inter, system-ui), spacing
[30-45s] Show /brand/colors: paste "linear.app" → color system extracted: primary, accent, neutrals
[45-60s] Show /palette/generate: "bold, fintech, trustworthy, dark mode" → original 5-color palette generated
[60-75s] Show /fonts/pair: "modern SaaS, clean, professional" → 3 pairings with Google Fonts links
[75-85s] "7 endpoints. Extract any brand. Create new ones. $0.05-0.30/call."
[85-90s] "Try it: okx.ai/agents/[ID] — #OKXAI"
```

## Success Criteria

1. All 7 endpoints pass OKX x402 validation on first submission
2. Listed and live on OKX.AI marketplace by Monday Jul 14
3. 300+ orders by Thursday Jul 17
4. 5.0 rating, 100% positive reviews
5. X demo showing real extraction from a known brand (Stripe, Linear, Apple)
6. Google form submitted before Jul 17 23:59 UTC

## Prize Strategy (Research-Backed)

**Primary targets:** Artistic Excellence ($2,500 × 3) + Social Buzz ($1,000 × 10)
**Upside:** Creative Genius ($20,000) — "real browser rendering → structured brand contract for agents" is a genuinely novel framing

### Why BrandForge wins Artistic Excellence
Submit extraction output for a real crypto/web3 brand: full hex palette, font stack, logo SVG, tone descriptors, DTCG token JSON. Judges see immediately this is more useful than the NFT art generators dominating the category. No other submission will have live browser rendering as the core mechanic.

### Why BrandForge wins Social Buzz
90-second X demo. Show: (1) paste a URL, (2) Playwright rendering live, (3) structured JSON out, (4) that JSON fed into another agent writing on-brand copy. Agent-chaining demo is uniquely shareable and is exactly the A2A story OKX wants to tell.

### Revenue Rocket seeding strategy
- Price at $0.05–$0.1 for initial calls to drive volume
- Ask 10 builder friends to each make 5–10 test calls (50+ sales, 5.0 rating = Revenue Rocket entry)
- Target other hackathon builders: if their agents need brand data, BrandForge is the only option on the platform
- Being cited/used by OTHER agents creates passive recurring revenue

### The cautionary tale
`Web3 Brand Workflow` on OKX.AI has 0 sales at negotiable pricing. Failure mode: vague positioning + human-freelancer model + no autonomous execution. BrandForge avoids all three.

- **Artistic Excellence** ($2,500 × 3) — top-performing in Art Creation category
- **Creative Genius** ($10K) — most innovative concept on the marketplace
- **Best Product** ($10K) — complete, reliable, genuinely useful
- **Social Buzz** ($1K × 10) — visual demo of brand extraction = shareable

## References

### Extraction core — `references/brandpull/`

Samuel's own brandpull CLI. **Port this code directly** — do not rewrite from scratch.

| File | What to port |
|---|---|
| `src/branding/index.ts` | `extractBranding()` — Playwright launch, navigate, evaluate, close |
| `src/branding/page-script.ts` | In-page DOM evaluation script — runs inside the browser context |
| `src/branding/processor.ts` | `processRawBranding()` — color inference, font extraction, button/input scoring |
| `src/branding/colors.ts` | `hexify()`, `isVibrant()`, `isGrayish()` — color utilities |
| `src/branding/logo.ts` | `selectLogoWithConfidence()` — logo candidate scoring |
| `src/branding/types.ts` | `BrandingProfile`, `RawBrandingData` — complete type shapes |
| `src/branding/llm.ts` | `enhanceWithLLM()` — swap OpenAI call → Bedrock `invokeModel` |

The LLM enhancement pass in `llm.ts` calls `openai/v1/chat/completions`. Replace with Bedrock `@aws-sdk/client-bedrock-runtime` `InvokeModelCommand`. Same prompt shape, same JSON output contract.

### Outstanding spikes (2 unknowns)

| # | Spike | Question |
|---|---|---|
| 001 | `render-docker-playwright` | Does Playwright/Chromium run cleanly on Render Docker? Cold start < 15s? Needs `--no-sandbox`? |
| 002 | `bedrock-generation` | Claude Sonnet 4.6 on Bedrock for palette + font pairing + guidelines — output quality + latency acceptable? |

Run spike 001 first — it's the only real deploy risk.

## Registration & Go-Live (Onchain OS — agent-driven)

### Phase 1 — Agentic Wallet
```
npx skills add okx/onchainos-skills --yes -g
Log in to Agentic Wallet with email
```
Same wallet as Glowfy — one wallet, two ASPs.

### Phase 2 — Build + deploy
Build BrandForge (7 endpoints, x402-gated), deploy to Render with Docker (required for Playwright), custom domain, HTTPS live.

### Phase 3 — Register ASP
```
Help me register an A2MCP ASP on OKX.AI using Onchain OS
```

### Phase 4 — Hackathon form (after approval)
- [ ] ASP Name
- [ ] Agent ID
- [ ] ASP Description
- [ ] ASP Type: A2MCP
- [ ] X Account Handle
- [ ] X Participation Post link
- [ ] Telegram Handle

---

## Branding & Launch Tasks

### Identity
- [ ] **Name** — ✅ BrandForge
- [ ] **Tagline** — ✅ *"Extract any brand. Create new ones."*
- [ ] **Logo** — square, 1:1, no text, no AI-gen, no faces. Minimal — forge/anvil shape or abstract brand mark. Must pass OKX image checklist.
- [ ] **Color palette** — suggest: deep indigo `#2D1B69` + white + gold accent. Design/creative energy, premium.

### Social
- [ ] **X (Twitter) account** — `@brandforgeai` or similar
- [ ] **Participation post** — 90-second demo: extract Stripe's brand kit live. Visual = shareable. `#OKXAI`.
- [ ] **TG winner hub** — share once listing approved.



## Post-Hackathon Potential

- Add component extraction (buttons, cards, forms)
- Add animation/motion tokens
- Multi-page brand consistency scoring
- White-label report generation
- Integration with Figma/design tools
- Subscription tier for agencies managing multiple brands
