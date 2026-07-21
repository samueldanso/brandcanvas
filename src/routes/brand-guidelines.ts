import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";
import { registerDelivery } from "../lib/metadata-registry";
import { extractPayerAddress, mintBrandKitNFT } from "../lib/nft";
import { pinMetadata, pinSVG } from "../lib/pinata";
import { generateGuidelinesSVG, svgToDataUri } from "../lib/svg";

export async function handleBrandGuidelines(c: Context) {
	const body =
		c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
	const { brandName, values, audience, industry, colorPreferences } = body as {
		brandName?: string;
		values?: string[];
		audience?: string;
		industry?: string;
		colorPreferences?: string;
	};

	if (!brandName)
		return c.json({ error: "Missing required parameter: brandName" }, 400);

	const systemPrompt = `You are a senior brand strategist who creates actionable brand guidelines that teams and agents can enforce. Your guidelines are specific enough to maintain consistency across all touchpoints — not generic corporate fluff. Return ONLY valid JSON.`;

	const userPrompt = `Create production-ready brand guidelines:

BRAND:
- Name: ${brandName}
- Industry: ${industry || "technology"}
- Values: ${values?.join(", ") || "innovation, trust, simplicity"}
- Target audience: ${audience || "modern professionals"}
- Color preferences: ${colorPreferences || "no preference — choose what fits"}

REQUIREMENTS:
- Mission and vision must be specific to THIS brand — not generic
- Voice traits must have concrete do/don't examples
- Color system must include exact hex values + when to use each
- Typography must name real fonts (Google Fonts preferred)
- Usage rules must be enforceable — specific enough that an AI agent can check compliance

Return this exact JSON:
{
  "brandName": "${brandName}",
  "mission": "One specific sentence — what this brand does and for whom",
  "vision": "Where this brand is going — ambitious but credible",
  "positioning": "One sentence: For [audience], [brand] is the [category] that [differentiator]",
  "voiceAndTone": {
    "personality": ["trait1", "trait2", "trait3"],
    "voice": "How the brand sounds in one sentence",
    "doSay": ["specific example phrase", "another example"],
    "dontSay": ["specific anti-pattern", "another anti-pattern"],
    "toneShifts": {
      "marketing": "How tone shifts for marketing content",
      "support": "How tone shifts for support/help content",
      "error": "How tone shifts for error states"
    }
  },
  "colorSystem": {
    "primary": { "hex": "#XXXXXX", "name": "Color Name", "usage": "Exactly where to use" },
    "secondary": { "hex": "#XXXXXX", "name": "Color Name", "usage": "Exactly where to use" },
    "accent": { "hex": "#XXXXXX", "name": "Color Name", "usage": "Exactly where to use" },
    "neutralDark": { "hex": "#XXXXXX", "usage": "Text, headings" },
    "neutralLight": { "hex": "#XXXXXX", "usage": "Backgrounds, surfaces" }
  },
  "typography": {
    "headingFont": { "family": "Font Name", "googleFontsUrl": "https://fonts.googleapis.com/css2?family=..." },
    "bodyFont": { "family": "Font Name", "googleFontsUrl": "https://fonts.googleapis.com/css2?family=..." },
    "scale": "Type scale ratio (e.g. 1.25)",
    "css": ":root { --font-heading: 'X', sans-serif; --font-body: 'Y', sans-serif; }"
  },
  "usageRules": [
    "Specific enforceable rule 1",
    "Specific enforceable rule 2",
    "Specific enforceable rule 3",
    "Specific enforceable rule 4",
    "Specific enforceable rule 5"
  ],
  "doNot": [
    "Specific prohibition 1",
    "Specific prohibition 2",
    "Specific prohibition 3"
  ]
}`;

	let response: string;
	try {
		response = await invokeClaude(systemPrompt, userPrompt, 5000, true);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : "Unknown error";
		console.error("[brand-guidelines] Bedrock error:", msg);
		return c.json({ error: "AI generation failed", detail: msg }, 500);
	}
	const json = response.match(/\{[\s\S]*\}/)?.[0];
	if (!json)
		return c.json({ error: "Failed to generate brand guidelines" }, 500);

	let output: Record<string, unknown>;
	try {
		output = JSON.parse(json);
	} catch {
		try {
			let repaired = json
				.replace(/,\s*([}\]])/g, "$1")
				.replace(/([}\]])(\s*")/g, "$1,$2");
			const opens = (repaired.match(/{/g) || []).length;
			const closes = (repaired.match(/}/g) || []).length;
			if (opens > closes) {
				repaired = repaired.replace(/,?\s*"[^"]*$/, "");
				repaired += "}".repeat(opens - closes);
			}
			output = JSON.parse(repaired);
		} catch {
			console.error(
				"[brand-guidelines] JSON repair failed, raw:",
				json.slice(0, 500),
			);
			return c.json({ error: "Failed to parse brand guidelines output" }, 500);
		}
	}

	const svg = generateGuidelinesSVG(output);
	const imageUri = svgToDataUri(svg);

	const pinResult = await pinSVG(svg, `guidelines-${Date.now()}`);
	const ipfsImageUrl = pinResult?.gatewayUrl || undefined;
	const ipfsProtocolUrl = pinResult?.ipfsUrl || undefined;

	const payerAddress = extractPayerAddress(
		c.req.header("PAYMENT-SIGNATURE") || null,
	);

	let nft: Record<string, string | number> = {
		contract: "0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B",
		chain: "X Layer (eip155:196)",
		status: "no_payer_detected",
	};

	if (payerAddress) {
		const mintResult = await Promise.race([
			mintBrandKitNFT(
				output,
				"guidelines",
				payerAddress,
				imageUri,
				ipfsImageUrl,
				ipfsProtocolUrl,
			),
			new Promise<null>((resolve) => setTimeout(() => resolve(null), 12000)),
		]);

		if (mintResult) {
			nft = {
				tokenId: mintResult.tokenId,
				contract: mintResult.contract,
				chain: mintResult.chain,
				txHash: mintResult.txHash,
				explorerUrl: mintResult.explorerUrl,
				imageUrl: mintResult.imageUrl,
				metadataUrl: mintResult.metadataUrl,
				owner: mintResult.owner,
				status: "minted",
			};

			const metaPin = await pinMetadata(
				output,
				`brandcanvas-${mintResult.tokenId}`,
			);
			if (metaPin && ipfsImageUrl) {
				registerDelivery(
					mintResult.tokenId,
					"guidelines",
					metaPin.gatewayUrl,
					ipfsImageUrl,
					mintResult.txHash,
				);
			}
		} else {
			nft = {
				contract: "0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B",
				chain: "X Layer (eip155:196)",
				status: "mint_timeout_pending",
			};
		}
	}

	const BASE_URL = process.env.BASE_URL || "https://brandcanvas.onrender.com";
	const deliveryUrl = nft.tokenId
		? `${BASE_URL}/delivery/${nft.tokenId}`
		: ipfsImageUrl || imageUri;

	return c.json({ ...output, viewUrl: imageUri, deliveryUrl, nft });
}
