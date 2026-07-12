import type { Context } from "hono";
import { invokeClaude } from "../lib/bedrock";

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

	return c.json(JSON.parse(json));
}
