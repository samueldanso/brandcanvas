import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";
import { extractPayerAddress, mintBrandKitNFT } from "../lib/nft";
import { generatePaletteSVG, svgToDataUri } from "../lib/svg";

export async function handlePaletteGenerate(c: Context) {
	const body =
		c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
	const { mood, industry, adjectives, darkMode } = body as {
		mood?: string;
		industry?: string;
		adjectives?: string[];
		darkMode?: boolean;
	};

	if (!mood) return c.json({ error: "Missing required parameter: mood" }, 400);

	const systemPrompt = `You are a senior brand designer who creates production-ready color systems. You understand color theory, WCAG accessibility, and how colors work in real product interfaces. Your palettes are used by developers and design agents to ship real products. Return ONLY valid JSON — no markdown, no commentary.`;

	const userPrompt = `Create a complete, production-ready 5-color brand palette:

BRIEF:
- Mood: ${mood}
- Industry: ${industry || "general"}
- Adjectives: ${adjectives?.join(", ") || "modern, clean"}
- Mode: ${darkMode ? "dark mode optimized" : "light mode primary"}

REQUIREMENTS:
- Primary: The dominant brand color. Must pass WCAG AA contrast on ${darkMode ? "dark backgrounds" : "white"}.
- Secondary: Supports primary. Different hue or value — never too similar.
- Accent: Eye-catching, used sparingly for CTAs, badges, highlights.
- Neutral: For text, borders, subtle UI. Must feel intentional, not generic gray.
- Background: Page/card surface color. ${darkMode ? "Dark but not pure black." : "Light but not pure white."}
- Every color must be distinct — no two colors within 10% lightness of each other.

Return this exact JSON:
{
  "palette": [
    {
      "hex": "#XXXXXX",
      "name": "Descriptive Name",
      "role": "primary",
      "usage": "Specific guidance — where exactly to use this in a UI",
      "onWhite": "AA|AAA|FAIL",
      "onBlack": "AA|AAA|FAIL"
    }
  ],
  "contrast": {
    "primaryOnBackground": "X.X:1",
    "accentOnBackground": "X.X:1",
    "neutralOnBackground": "X.X:1"
  },
  "css": {
    "variables": ":root { --color-primary: #XXX; --color-secondary: #XXX; --color-accent: #XXX; --color-neutral: #XXX; --color-background: #XXX; }",
    "tailwind": "{ primary: '#XXX', secondary: '#XXX', accent: '#XXX', neutral: '#XXX', background: '#XXX' }"
  },
  "mood": "One sentence describing the emotional quality of this palette",
  "pairsWith": "Font style suggestion that works with this palette",
  "avoid": "What NOT to do with these colors"
}`;

	const response = await invokeClaude(systemPrompt, userPrompt, 1024);
	const json = response.match(/\{[\s\S]*\}/)?.[0];
	if (!json) return c.json({ error: "Failed to generate palette" }, 500);

	const output = JSON.parse(json);

	// Generate programmatic SVG art from the palette
	const svg = generatePaletteSVG(output.palette || []);
	const imageUri = svgToDataUri(svg);

	// Fire-and-forget NFT mint
	const payerAddress = extractPayerAddress(
		c.req.header("PAYMENT-SIGNATURE") || null,
	);
	if (payerAddress) {
		mintBrandKitNFT(output, "palette", payerAddress, imageUri)
			.then((r) => { if (r) console.log(`[nft] palette minted #${r.tokenId}`); })
			.catch((e) => console.error("[nft] palette mint error:", e));
	}

	return c.json({ ...output, svg, nft: { contract: "0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B", chain: "X Layer (eip155:196)", status: "minting" } });
}
