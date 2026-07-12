import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";

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

	return c.json(JSON.parse(json));
}
