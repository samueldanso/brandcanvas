# IP Provenance + Pricing Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add on-chain IP provenance to BrandCanvas generation endpoints and update pricing to reflect real compute value.

**Architecture:** Deploy a minimal event-emitting registry contract on X Layer (chain 196) via Foundry. Wire a viem wallet client into the three generation route handlers so each response includes a provenance field with txHash, contentHash, creator, and explorerUrl. Update x402 pricing in the route config.

**Tech Stack:** Foundry (Solidity 0.8.24), viem, Bun, Hono, X Layer (eip155:196, RPC `https://rpc.xlayer.tech`, gas token OKB)

## Global Constraints

- Solidity: `0.8.24`, optimizer 200 runs
- X Layer chain ID: `196`, RPC: `https://rpc.xlayer.tech`
- Native gas: OKB (need small amount for contract deploy + mints)
- Deployer wallet: `ai.samueldanso@gmail.com` / `0x37fafa3e36aa5c0d6ef35627fd66d5991a6fd4d1` (same as x402 receiver — OR use a separate deployer key)
- viem for all chain interaction (already a transitive dep via x402 SDK)
- Non-fatal provenance: if on-chain mint fails, still return the brand asset (don't break the API)
- No new npm packages beyond `viem` (already available)
- Prices: extract $0.50, colors/typo/assets $0.10, palette/fonts $0.10, guidelines $0.15

---

### Task 1: Deploy BrandKitRegistry Contract on X Layer

**Files:**
- Create: `contracts/foundry.toml`
- Create: `contracts/src/BrandKitRegistry.sol`
- Create: `contracts/script/Deploy.s.sol`

**Interfaces:**
- Produces: Deployed contract address on X Layer (record in `.env` as `REGISTRY_ADDRESS`)
- Produces: ABI — single function `register(bytes32 contentHash, string kitType)` emitting `BrandKitRegistered(address indexed creator, bytes32 indexed contentHash, string kitType, uint256 timestamp)`

- [ ] **Step 1: Create Foundry project structure**

```bash
cd /Users/samueldanso/Workspace/Hacks/brand-canvas-agent
mkdir -p contracts/src contracts/script
```

- [ ] **Step 2: Write foundry.toml**

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
xlayer = "${XLAYER_RPC_URL}"
```

- [ ] **Step 3: Install forge-std**

```bash
cd contracts && forge install foundry-rs/forge-std --no-commit
```

- [ ] **Step 4: Write BrandKitRegistry.sol**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract BrandKitRegistry {
    event BrandKitRegistered(
        address indexed creator,
        bytes32 indexed contentHash,
        string kitType,
        uint256 timestamp
    );

    function register(bytes32 contentHash, string calldata kitType) external {
        emit BrandKitRegistered(msg.sender, contentHash, kitType, block.timestamp);
    }
}
```

- [ ] **Step 5: Write Deploy.s.sol**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import "../src/BrandKitRegistry.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        new BrandKitRegistry();
        vm.stopBroadcast();
    }
}
```

- [ ] **Step 6: Compile**

```bash
cd contracts && forge build
```

Expected: compilation successful, no errors.

- [ ] **Step 7: Deploy to X Layer**

```bash
cd contracts
export XLAYER_RPC_URL=https://rpc.xlayer.tech
export DEPLOYER_PRIVATE_KEY=<private-key-for-0x37fafa3e...>

forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $XLAYER_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast
```

Expected: Contract deployed. Record the deployed address from output.

- [ ] **Step 8: Verify deployment**

```bash
cast call <DEPLOYED_ADDRESS> "register(bytes32,string)" \
  0x0000000000000000000000000000000000000000000000000000000000000001 "test" \
  --rpc-url https://rpc.xlayer.tech \
  --private-key $DEPLOYER_PRIVATE_KEY
```

Alternatively, send a real test tx:
```bash
cast send <DEPLOYED_ADDRESS> "register(bytes32,string)" \
  0xabcdef0000000000000000000000000000000000000000000000000000000001 "test" \
  --rpc-url https://rpc.xlayer.tech \
  --private-key $DEPLOYER_PRIVATE_KEY
```

Expected: tx succeeds, visible on https://www.okx.com/explorer/xlayer

- [ ] **Step 9: Add REGISTRY_ADDRESS to .env and .env.example**

```bash
echo "REGISTRY_ADDRESS=0x<deployed-address>" >> .env
echo "REGISTRY_ADDRESS=" >> .env.example
```

- [ ] **Step 10: Commit**

```bash
git add contracts/ .env.example
git commit -m "feat: deploy BrandKitRegistry contract on X Layer"
```

---

### Task 2: Wire Provenance Client into TypeScript Backend

**Files:**
- Create: `src/lib/provenance.ts`
- Modify: `src/lib/bedrock.ts` (no changes needed — just noting dependency)

**Interfaces:**
- Consumes: `REGISTRY_ADDRESS` env var, `DEPLOYER_PRIVATE_KEY` env var
- Produces: `mintProvenance(output: object, kitType: string): Promise<ProvenanceResult | null>`

```typescript
interface ProvenanceResult {
  contentHash: string;
  txHash: string;
  creator: string;
  chain: string;
  explorerUrl: string;
}
```

- [ ] **Step 1: Write src/lib/provenance.ts**

```typescript
import {
  createWalletClient,
  defineChain,
  http,
  keccak256,
  parseAbi,
  toHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const xlayer = defineChain({
  id: 196,
  name: "X Layer",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.xlayer.tech"] },
  },
  blockExplorers: {
    default: {
      name: "OKX Explorer",
      url: "https://www.okx.com/explorer/xlayer",
    },
  },
});

const REGISTRY_ABI = parseAbi([
  "function register(bytes32 contentHash, string calldata kitType) external",
]);

export interface ProvenanceResult {
  contentHash: string;
  txHash: string;
  creator: string;
  chain: string;
  explorerUrl: string;
}

export async function mintProvenance(
  output: object,
  kitType: string,
): Promise<ProvenanceResult | null> {
  const registryAddress = process.env.REGISTRY_ADDRESS as `0x${string}`;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;

  if (!registryAddress || !privateKey) {
    console.warn("[provenance] REGISTRY_ADDRESS or DEPLOYER_PRIVATE_KEY not set — skipping mint");
    return null;
  }

  try {
    const contentHash = keccak256(toHex(JSON.stringify(output)));
    const account = privateKeyToAccount(privateKey);
    const client = createWalletClient({
      account,
      chain: xlayer,
      transport: http("https://rpc.xlayer.tech"),
    });

    const txHash = await client.writeContract({
      address: registryAddress,
      abi: REGISTRY_ABI,
      functionName: "register",
      args: [contentHash, kitType],
    });

    return {
      contentHash,
      txHash,
      creator: account.address,
      chain: "X Layer (eip155:196)",
      explorerUrl: `https://www.okx.com/explorer/xlayer/tx/${txHash}`,
    };
  } catch (error) {
    console.error("[provenance] mint failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
```

- [ ] **Step 2: Add env vars to .env.example**

Add `DEPLOYER_PRIVATE_KEY=` to `.env.example` (if not already there from Task 1).

- [ ] **Step 3: Verify viem is available**

```bash
bun run -e "import { keccak256 } from 'viem'; console.log(keccak256('0x01'))"
```

Expected: prints a keccak hash. viem is a transitive dependency of `@okxweb3/x402-evm`.

If not available:
```bash
bun add viem
```

- [ ] **Step 4: Typecheck**

```bash
bun run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/provenance.ts .env.example
git commit -m "feat: add provenance minting client for X Layer registry"
```

---

### Task 3: Wire Provenance into Generation Endpoints + Update Prices

**Files:**
- Modify: `src/routes/palette-generate.ts`
- Modify: `src/routes/fonts-pair.ts`
- Modify: `src/routes/brand-guidelines.ts`
- Modify: `src/index.ts` (pricing only)

**Interfaces:**
- Consumes: `mintProvenance(output, kitType)` from `src/lib/provenance.ts`
- Produces: Each generation endpoint response gains a `provenance` field (or `provenance: null` if minting is unavailable)

- [ ] **Step 1: Update prices in src/index.ts**

Change the `routes` config object prices:

```typescript
// /brand/extract — was "$0.30", now "$0.50"
price: "$0.50",

// /brand/colors — was "$0.05", now "$0.10"
price: "$0.10",

// /brand/typography — was "$0.05", now "$0.10"
price: "$0.10",

// /brand/assets — was "$0.05", now "$0.10"
price: "$0.10",

// /palette/generate — was "$0.05", now "$0.10"
price: "$0.10",

// /fonts/pair — was "$0.05", now "$0.10"
price: "$0.10",

// /brand/guidelines — was "$0.10", now "$0.15"
price: "$0.15",
```

- [ ] **Step 2: Wire provenance into palette-generate.ts**

```typescript
import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";
import { mintProvenance } from "../lib/provenance";

export async function handlePaletteGenerate(c: Context) {
  const body =
    c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
  const { mood, industry, adjectives } = body as {
    mood?: string;
    industry?: string;
    adjectives?: string[];
  };

  if (!mood) return c.json({ error: "Missing required parameter: mood" }, 400);

  const systemPrompt =
    "You are a world-class brand color strategist. Generate color palettes that are visually harmonious, accessible, and aligned with the brand mood. Return ONLY valid JSON.";

  const userPrompt = `Generate a 5-color brand palette for:
- Mood: ${mood}
- Industry: ${industry || "general"}
- Adjectives: ${adjectives?.join(", ") || "modern, clean"}

Return this exact JSON shape:
{
  "palette": [
    { "hex": "#XXXXXX", "name": "Color Name", "role": "primary|secondary|accent|neutral|background", "usage": "When to use this color" }
  ],
  "contrast": {
    "primaryOnWhite": "ratio",
    "primaryOnDark": "ratio"
  },
  "mood": "brief description of the palette mood",
  "accessibility": "WCAG compliance notes"
}`;

  const response = await invokeClaude(systemPrompt, userPrompt);
  const json = response.match(/\{[\s\S]*\}/)?.[0];
  if (!json) return c.json({ error: "Failed to generate palette" }, 500);

  const output = JSON.parse(json);
  const provenance = await mintProvenance(output, "palette");

  return c.json({ ...output, provenance });
}
```

- [ ] **Step 3: Wire provenance into fonts-pair.ts**

```typescript
import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";
import { mintProvenance } from "../lib/provenance";

export async function handleFontsPair(c: Context) {
  const body =
    c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
  const { style, mood, useCase } = body as {
    style?: string;
    mood?: string;
    useCase?: string;
  };

  if (!style && !mood)
    return c.json({ error: "Missing required parameter: style or mood" }, 400);

  const systemPrompt =
    "You are a typography expert specializing in font pairing for digital brands. Return ONLY valid JSON.";

  const userPrompt = `Suggest 3 font pairings for:
- Style: ${style || "modern"}
- Mood: ${mood || "professional"}
- Use case: ${useCase || "website"}

Return this exact JSON shape:
{
  "pairings": [
    {
      "heading": { "family": "Font Name", "weight": "700", "googleFontsUrl": "https://fonts.googleapis.com/css2?family=..." },
      "body": { "family": "Font Name", "weight": "400", "googleFontsUrl": "https://fonts.googleapis.com/css2?family=..." },
      "rationale": "Why these work together",
      "css": "font-family: 'Font', sans-serif;"
    }
  ],
  "recommendation": "Which pairing to use and why"
}`;

  const response = await invokeClaude(systemPrompt, userPrompt);
  const json = response.match(/\{[\s\S]*\}/)?.[0];
  if (!json) return c.json({ error: "Failed to generate font pairings" }, 500);

  const output = JSON.parse(json);
  const provenance = await mintProvenance(output, "fonts");

  return c.json({ ...output, provenance });
}
```

- [ ] **Step 4: Wire provenance into brand-guidelines.ts**

```typescript
import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";
import { mintProvenance } from "../lib/provenance";

export async function handleBrandGuidelines(c: Context) {
  const body =
    c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
  const { brandName, values, audience, colorPreferences } = body as {
    brandName?: string;
    values?: string[];
    audience?: string;
    colorPreferences?: string;
  };

  if (!brandName)
    return c.json({ error: "Missing required parameter: brandName" }, 400);

  const systemPrompt =
    "You are a senior brand strategist creating comprehensive brand guidelines. Return ONLY valid JSON.";

  const userPrompt = `Create brand guidelines for:
- Brand name: ${brandName}
- Values: ${values?.join(", ") || "innovation, trust, simplicity"}
- Target audience: ${audience || "general"}
- Color preferences: ${colorPreferences || "no preference"}

Return this exact JSON shape:
{
  "brandName": "${brandName}",
  "mission": "One-sentence mission statement",
  "vision": "One-sentence vision",
  "voiceAndTone": {
    "personality": ["trait1", "trait2", "trait3"],
    "doSay": ["example1", "example2"],
    "dontSay": ["example1", "example2"]
  },
  "colorGuidelines": {
    "primary": { "hex": "#XXXXXX", "usage": "When to use" },
    "secondary": { "hex": "#XXXXXX", "usage": "When to use" },
    "accent": { "hex": "#XXXXXX", "usage": "When to use" }
  },
  "typographyGuidelines": {
    "headingFont": "Font name",
    "bodyFont": "Font name",
    "scale": "Recommended type scale"
  },
  "usageRules": ["rule1", "rule2", "rule3"]
}`;

  const response = await invokeClaude(systemPrompt, userPrompt);
  const json = response.match(/\{[\s\S]*\}/)?.[0];
  if (!json)
    return c.json({ error: "Failed to generate brand guidelines" }, 500);

  const output = JSON.parse(json);
  const provenance = await mintProvenance(output, "guidelines");

  return c.json({ ...output, provenance });
}
```

- [ ] **Step 5: Typecheck**

```bash
bun run typecheck
```

Expected: no errors.

- [ ] **Step 6: Lint**

```bash
bun run check
```

Expected: no errors (warnings acceptable).

- [ ] **Step 7: Commit**

```bash
git add src/index.ts src/routes/palette-generate.ts src/routes/fonts-pair.ts src/routes/brand-guidelines.ts
git commit -m "feat: wire IP provenance into generation endpoints, update pricing"
```

---

### Task 4: End-to-End Test (Manual — Production)

**Files:** None (testing deployed service)

**Interfaces:**
- Consumes: Deployed BrandCanvas on Render + deployed registry on X Layer
- Produces: Confirmed working provenance flow

- [ ] **Step 1: Push to trigger Render redeploy**

```bash
git push
```

Wait 3-5 minutes for Render to rebuild Docker image.

- [ ] **Step 2: Test /palette/generate with payment (buyer wallet)**

```bash
# Get 402
curl -si -X POST https://brandcanvas.onrender.com/palette/generate \
  -H "Content-Type: application/json" \
  -d '{"mood":"bold","industry":"fintech"}' | grep payment-required

# Sign payment
onchainos payment pay --payload '<base64 from above>'

# Replay with signature
curl -s -X POST https://brandcanvas.onrender.com/palette/generate \
  -H "Content-Type: application/json" \
  -H "PAYMENT-SIGNATURE: <auth_header>" \
  -d '{"mood":"bold","industry":"fintech"}' | python3 -m json.tool
```

Expected: Response includes `"provenance": { "contentHash": "0x...", "txHash": "0x...", "creator": "0x37fafa3e...", "explorerUrl": "https://www.okx.com/explorer/xlayer/tx/0x..." }`

- [ ] **Step 3: Verify on-chain**

Open the `explorerUrl` in browser. Confirm tx is visible on X Layer block explorer with:
- From: `0x37fafa3e36aa5c0d6ef35627fd66d5991a6fd4d1`
- To: `<REGISTRY_ADDRESS>`
- Method: `register(bytes32,string)`
- Event log: `BrandKitRegistered`

- [ ] **Step 4: Test /fonts/pair and /brand/guidelines similarly**

Repeat the pay-and-replay flow for both remaining generation endpoints. Confirm each returns `provenance` field.

- [ ] **Step 5: Test extraction endpoints still work (no provenance)**

```bash
# /brand/colors should NOT have provenance field
curl -s -X POST https://brandcanvas.onrender.com/brand/colors \
  -H "Content-Type: application/json" \
  -H "PAYMENT-SIGNATURE: <auth_header>" \
  -d '{"url":"https://stripe.com"}' | python3 -c "import sys,json; d=json.load(sys.stdin); assert 'provenance' not in d; print('OK: no provenance on extraction')"
```

- [ ] **Step 6: Confirm updated prices**

```bash
curl -s https://brandcanvas.onrender.com/brand/extract | python3 -c "
import sys,json,base64
# check the 402 shows new price
"

# Decode the payment-required header from a GET probe
curl -si -X GET https://brandcanvas.onrender.com/brand/extract | grep payment-required | awk '{print $2}' | base64 -d | python3 -c "
import sys,json
d=json.load(sys.stdin)
amount = d['accepts'][0]['amount']
print(f'Extract price: {int(amount)/1000000} USDT (expected 0.50)')
assert amount == '500000', f'Wrong price: {amount}'
"
```

Expected: `500000` (= $0.50 with 6 decimals)

---

### Task 5: Register BrandCanvas ASP on OKX.AI

**Files:** None (CLI operation)

**Interfaces:**
- Requires: wallet logged in as `ai.samueldanso@gmail.com`
- Requires: publicly hosted square logo image URL
- Produces: Agent ID + tx hash on X Layer

- [ ] **Step 1: Switch wallet to seller**

```bash
onchainos wallet login ai.samueldanso@gmail.com
```

Complete OTP verification.

- [ ] **Step 2: Verify wallet**

```bash
onchainos wallet status
```

Expected: email = `ai.samueldanso@gmail.com`, EVM = `0x37fafa3e36aa5c0d6ef35627fd66d5991a6fd4d1`

- [ ] **Step 3: Register ASP**

```bash
onchainos agent create \
  --name "BrandCanvas" \
  --role asp \
  --description "Brand intelligence and IP provenance for the agentic economy. When a new project or agent spawns, it needs immediate, cohesive brand assets — extract an existing brand kit from any live URL with headless browser rendering, or create a new brand identity and mint a provenance hash directly onto X Layer to prove authorship. The only agent that reads any brand with rendering-level precision and creates new identities with on-chain IP ownership." \
  --picture "<LOGO_URL>" \
  --service '[{"serviceName":"Brand Extract","serviceDescription":"URL → complete brand kit. Headless Chromium renders the live page, extracts exact computed colors, font stacks, logo SVG, spacing, button/input components. AI-enhanced color role assignment and logo scoring.","serviceType":"A2MCP","fee":"0.50","endpoint":"https://brandcanvas.onrender.com/brand/extract"},{"serviceName":"Color System","serviceDescription":"URL → brand color system as hex. Primary, secondary, accent, neutral, background, text — extracted from computed CSS, not guessed from markup.","serviceType":"A2MCP","fee":"0.10","endpoint":"https://brandcanvas.onrender.com/brand/colors"},{"serviceName":"Typography Stack","serviceDescription":"URL → complete font system. Families, weights, size scale, heading/body/paragraph stacks resolved from computed styles.","serviceType":"A2MCP","fee":"0.10","endpoint":"https://brandcanvas.onrender.com/brand/typography"},{"serviceName":"Brand Assets","serviceDescription":"URL → logo URL (SVG/PNG), favicon, OG image. Direct links from the live page, scored and ranked.","serviceType":"A2MCP","fee":"0.10","endpoint":"https://brandcanvas.onrender.com/brand/assets"},{"serviceName":"Palette Generate","serviceDescription":"Mood + industry → 5-color palette with hex, roles, WCAG contrast. Mints a provenance hash on X Layer to prove authorship — content hash and creator wallet timestamped on-chain.","serviceType":"A2MCP","fee":"0.10","endpoint":"https://brandcanvas.onrender.com/palette/generate"},{"serviceName":"Font Pairing","serviceDescription":"Style + mood → 3 curated font pairings with Google Fonts CDN links and CSS snippets. Mints provenance hash on X Layer to prove authorship.","serviceType":"A2MCP","fee":"0.10","endpoint":"https://brandcanvas.onrender.com/fonts/pair"},{"serviceName":"Brand Guidelines","serviceDescription":"Brand name + values + audience → structured brand guidelines with voice, tone, color rules, typography. Mints provenance hash on X Layer — your brand identity, authored and timestamped on-chain.","serviceType":"A2MCP","fee":"0.15","endpoint":"https://brandcanvas.onrender.com/brand/guidelines"}]'
```

Expected: `{"ok":true,"data":{"agent":{"agentId":"XXXX",...}}}` with a valid agent ID and tx hash.

- [ ] **Step 4: Activate agent**

```bash
onchainos agent activate --agent-id <AGENT_ID>
```

- [ ] **Step 5: Verify on marketplace**

Check `https://www.okx.ai/agents/<AGENT_ID>` is accessible.

---

## Blocker Checklist

Before starting Task 1:
- [ ] Foundry installed (`forge --version`)
- [ ] Private key for deployer wallet available (export from `ai.samueldanso@gmail.com` agentic wallet OR use a separate deployer key)
- [ ] Deployer wallet funded with OKB on X Layer (gas for contract deploy + subsequent register() calls)

Before starting Task 5:
- [ ] Logo image URL (square, no text, no AI-gen — must pass OKX image checklist)
