import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";
import { extractPayerAddress, mintBrandKitNFT } from "../lib/nft";
import { generateFontsSVG, svgToDataUri } from "../lib/svg";

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

	const systemPrompt = `You are a senior typographer who pairs fonts for production digital products. You know which Google Fonts work at scale, which weights to load, and how to set a type hierarchy. Your pairings ship in real products — not just design comps. Return ONLY valid JSON.`;

	const userPrompt = `Create 3 production-ready font pairings:

BRIEF:
- Style: ${style || "modern"}
- Mood: ${mood || "professional"}
- Use case: ${useCase || "SaaS product / marketing site"}

REQUIREMENTS:
- All fonts must be available on Google Fonts (free, production-ready)
- Include exact weights to load (don't over-load — performance matters)
- CSS snippets must be copy-paste ready
- Each pairing needs a clear rationale — why these two fonts work together
- Rank them: best first

Return this exact JSON:
{
  "pairings": [
    {
      "heading": {
        "family": "Font Name",
        "weights": ["600", "700"],
        "googleFontsUrl": "https://fonts.googleapis.com/css2?family=Font+Name:wght@600;700&display=swap",
        "css": "font-family: 'Font Name', sans-serif;"
      },
      "body": {
        "family": "Font Name",
        "weights": ["400", "500"],
        "googleFontsUrl": "https://fonts.googleapis.com/css2?family=Font+Name:wght@400;500&display=swap",
        "css": "font-family: 'Font Name', sans-serif;"
      },
      "rationale": "Why these two work together — be specific about contrast and hierarchy",
      "scale": "Recommended type scale (e.g. 1.25 major third)",
      "htmlImport": "<link href='...' rel='stylesheet'>"
    }
  ],
  "recommendation": "Which pairing to use and why — one clear answer",
  "typescale": {
    "h1": "48px / 3rem",
    "h2": "36px / 2.25rem",
    "h3": "24px / 1.5rem",
    "body": "16px / 1rem",
    "small": "14px / 0.875rem"
  }
}`;

	const response = await invokeClaude(systemPrompt, userPrompt);
	const json = response.match(/\{[\s\S]*\}/)?.[0];
	if (!json) return c.json({ error: "Failed to generate font pairings" }, 500);

	const output = JSON.parse(json);

	// Generate typography specimen SVG
	const svg = generateFontsSVG(output.pairings || []);
	const imageUri = svgToDataUri(svg);

	// Mint IP NFT with embedded SVG to the payer's wallet
	const payerAddress = extractPayerAddress(
		c.req.header("PAYMENT-SIGNATURE") || null,
	);
	const nft = payerAddress
		? await mintBrandKitNFT(output, "fonts", payerAddress, imageUri)
		: null;

	return c.json({ ...output, svg, nft });
}
