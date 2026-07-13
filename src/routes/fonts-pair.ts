import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";
import { extractPayerAddress, mintBrandKitNFT } from "../lib/nft";

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

	// Mint IP NFT to the payer's wallet on X Layer
	const payerAddress = extractPayerAddress(
		c.req.header("PAYMENT-SIGNATURE") || null,
	);
	const nft = payerAddress
		? await mintBrandKitNFT(output, "fonts", payerAddress)
		: null;

	return c.json({ ...output, nft });
}
