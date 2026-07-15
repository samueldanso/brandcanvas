import { OKXFacilitatorClient } from "@okxweb3/x402-core";
import type { RoutesConfig } from "@okxweb3/x402-core/server";
import { ExactEvmScheme } from "@okxweb3/x402-evm/exact/server";
import {
	paymentMiddlewareFromHTTPServer,
	x402HTTPResourceServer,
	x402ResourceServer,
} from "@okxweb3/x402-hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handleBrandAssets } from "./routes/brand-assets";
import { handleBrandColors } from "./routes/brand-colors";
import { handleBrandExtract } from "./routes/brand-extract";
import { handleBrandGuidelines } from "./routes/brand-guidelines";
import { handleBrandTypography } from "./routes/brand-typography";
import { handleFontsPair } from "./routes/fonts-pair";
import { handlePaletteGenerate } from "./routes/palette-generate";
import { handleAssetMetadata, handleAssetSVG } from "./routes/assets";

const app = new Hono();

// CORS — explicit headers required; wildcard breaks x402 validator
app.use(
	"/*",
	cors({
		origin: "*",
		allowHeaders: [
			"Content-Type",
			"Authorization",
			"PAYMENT-SIGNATURE",
			"X-Payment",
		],
		exposeHeaders: ["PAYMENT-REQUIRED", "PAYMENT-RESPONSE"],
		allowMethods: ["GET", "POST", "OPTIONS"],
	}),
);

// Facilitator: use real OKX client when SA keys are set; local stub otherwise
function createFacilitator() {
	const apiKey = process.env.OKX_API_KEY;
	const secretKey = process.env.OKX_SECRET_KEY;
	const passphrase = process.env.OKX_PASSPHRASE;

	if (apiKey && secretKey && passphrase) {
		console.log("[brandcanvas] Using OKXFacilitatorClient (SA keys present)");
		return new OKXFacilitatorClient({
			apiKey,
			secretKey,
			passphrase,
			syncSettle: true,
		});
	}

	console.warn(
		"[brandcanvas] OKX SA keys not set — using local stub (402 only, no settlement)",
	);
	return {
		async getSupported() {
			return {
				kinds: [
					{ x402Version: 2, scheme: "exact", network: "eip155:196" as const },
				],
				extensions: [] as string[],
				signers: {} as Record<string, string[]>,
			};
		},
		async verify(_payload: unknown, _requirements: unknown): Promise<never> {
			throw new Error(
				"OKX SA keys not configured — payment verification unavailable",
			);
		},
		async settle(_payload: unknown, _requirements: unknown): Promise<never> {
			throw new Error(
				"OKX SA keys not configured — payment settlement unavailable",
			);
		},
	};
}

// x402 payment middleware
const WALLET = process.env.WALLET_ADDRESS;
if (!WALLET)
	throw new Error("[brandcanvas] WALLET_ADDRESS env var is required");

const BASE_URL = process.env.BASE_URL || "https://brandcanvas.onrender.com";

const routes: RoutesConfig = {
	"/brand/extract": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.50",
		},
		resource: `${BASE_URL}/brand/extract`,
		description:
			"URL → complete brand kit. Headless Chromium renders the page, extracts colors, fonts, logo, spacing, components. AI-enhanced.",
		mimeType: "application/json",
	},
	"/brand/colors": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.10",
		},
		resource: `${BASE_URL}/brand/colors`,
		description:
			"URL → color system extracted from computed CSS. Primary, secondary, accent, neutrals as hex.",
		mimeType: "application/json",
	},
	"/brand/typography": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.10",
		},
		resource: `${BASE_URL}/brand/typography`,
		description:
			"URL → font families, weights, size scale, heading/body stacks from computed styles.",
		mimeType: "application/json",
	},
	"/brand/assets": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.10",
		},
		resource: `${BASE_URL}/brand/assets`,
		description:
			"URL → logo URL (SVG/PNG), favicon, OG image. Scored and ranked from the live page.",
		mimeType: "application/json",
	},
	"/palette/generate": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.10",
		},
		resource: `${BASE_URL}/palette/generate`,
		description:
			"Mood + industry → 5-color palette + WCAG contrast. Mints IP NFT to payer on X Layer.",
		mimeType: "application/json",
	},
	"/fonts/pair": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.10",
		},
		resource: `${BASE_URL}/fonts/pair`,
		description:
			"Style + mood → 3 font pairings + Google Fonts CDN. Mints IP NFT to payer on X Layer.",
		mimeType: "application/json",
	},
	"/brand/guidelines": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.15",
		},
		resource: `${BASE_URL}/brand/guidelines`,
		description:
			"Brand name + values → structured brand guidelines. Mints IP NFT to payer on X Layer.",
		mimeType: "application/json",
	},
};

const resourceServer = new x402ResourceServer(createFacilitator()).register(
	"eip155:196",
	new ExactEvmScheme(),
);

// Extended poll deadline for Playwright extraction (can take 10-15s)
const httpServer = new x402HTTPResourceServer(resourceServer, routes);
httpServer.setPollDeadline(30000); // 30s — Playwright browser launch + page load + extraction

app.use("/*", paymentMiddlewareFromHTTPServer(httpServer));

// Route handlers — each handles GET + POST
app.on(["GET", "POST"], "/brand/extract", handleBrandExtract);
app.on(["GET", "POST"], "/brand/colors", handleBrandColors);
app.on(["GET", "POST"], "/brand/typography", handleBrandTypography);
app.on(["GET", "POST"], "/brand/assets", handleBrandAssets);
app.on(["GET", "POST"], "/palette/generate", handlePaletteGenerate);
app.on(["GET", "POST"], "/fonts/pair", handleFontsPair);
app.on(["GET", "POST"], "/brand/guidelines", handleBrandGuidelines);

// Health check — not payment-gated
app.get("/health", (c) => c.json({ status: "ok" }));
app.get("/", (c) =>
	c.json({
		status: "ok",
		agent: "BrandCanvas",
		version: "2.0.0",
		tagline: "Create brand identities. Own them on-chain.",
		description:
			"Verifiable generative brand assets with on-chain provenance. When a user or agent needs brand identity for a new project — extract an existing brand kit (colors, fonts, logos, spacing, components) from any live URL (stripe.com, linear.app, any site) with headless browser rendering, or generate a new one from scratch. Every generated asset mints a provenance hash on X Layer and delivers an ERC-721 NFT directly to the payer's wallet. Pay per call, own what you create.",
		contract: "0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B",
		chain: "X Layer (eip155:196)",
		endpoints: {
			extraction: [
				"/brand/extract",
				"/brand/colors",
				"/brand/typography",
				"/brand/assets",
			],
			generation: ["/palette/generate", "/fonts/pair", "/brand/guidelines"],
			assets: ["/assets/:tokenId/image", "/assets/:tokenId/metadata"],
		},
	}),
);

// Public asset endpoints — serve NFT art and metadata (not payment-gated)
app.get("/assets/:tokenId/image", handleAssetSVG);
app.get("/assets/:tokenId/metadata", handleAssetMetadata);

export default {
	port: Number(process.env.PORT ?? 3000),
	fetch: app.fetch,
};
