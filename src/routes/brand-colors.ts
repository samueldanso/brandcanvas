import type { Context } from "hono";
import { extractBranding } from "../branding";

export async function handleBrandColors(c: Context) {
	const body =
		c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
	const url = (body as { url?: string }).url || c.req.query("url");
	if (!url) return c.json({ error: "Missing required parameter: url" }, 400);

	const profile = await extractBranding(url);
	return c.json({
		url: profile.url,
		brandName: profile.brandName,
		colorScheme: profile.colorScheme,
		colors: profile.colors,
		confidence: profile.confidence?.colors,
	});
}
