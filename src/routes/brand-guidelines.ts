import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";
import { extractPayerAddress, mintBrandKitNFT } from "../lib/nft";
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

	const response = await invokeClaude(systemPrompt, userPrompt);
	const json = response.match(/\{[\s\S]*\}/)?.[0];
	if (!json)
		return c.json({ error: "Failed to generate brand guidelines" }, 500);

	const output = JSON.parse(json);

	// Generate brand identity card SVG
	const svg = generateGuidelinesSVG(output);
	const imageUri = svgToDataUri(svg);

	// Mint IP NFT with embedded SVG to the payer's wallet
	const payerAddress = extractPayerAddress(
		c.req.header("PAYMENT-SIGNATURE") || null,
	);
	const nft = payerAddress
		? await mintBrandKitNFT(output, "guidelines", payerAddress, imageUri)
		: null;

	return c.json({ ...output, svg, nft });
}
