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
			price: "$0.30",
		},
		resource: `${BASE_URL}/brand/extract`,
		description:
			"URL → complete brand kit JSON (colors, fonts, logo, components)",
		mimeType: "application/json",
	},
	"/brand/colors": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.05",
		},
		resource: `${BASE_URL}/brand/colors`,
		description:
			"URL → color system (primary, secondary, accent, neutrals + HEX)",
		mimeType: "application/json",
	},
	"/brand/typography": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.05",
		},
		resource: `${BASE_URL}/brand/typography`,
		description: "URL → font families, weights, scale, stacks",
		mimeType: "application/json",
	},
	"/brand/assets": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.05",
		},
		resource: `${BASE_URL}/brand/assets`,
		description: "URL → logo URLs (SVG/PNG), favicon, OG images",
		mimeType: "application/json",
	},
	"/palette/generate": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.05",
		},
		resource: `${BASE_URL}/palette/generate`,
		description: "Mood + industry → 5-color palette with contrast ratios",
		mimeType: "application/json",
	},
	"/fonts/pair": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.05",
		},
		resource: `${BASE_URL}/fonts/pair`,
		description: "Style + mood → 3 font pairings with Google Fonts CDN links",
		mimeType: "application/json",
	},
	"/brand/guidelines": {
		accepts: {
			scheme: "exact",
			network: "eip155:196",
			payTo: WALLET,
			price: "$0.10",
		},
		resource: `${BASE_URL}/brand/guidelines`,
		description: "Brand name + values → formatted brand guidelines document",
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
app.get("/", (c) =>
	c.json({ status: "ok", agent: "BrandCanvas", version: "1.0.0" }),
);

export default {
	port: Number(process.env.PORT ?? 3000),
	fetch: app.fetch,
};
