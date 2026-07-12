import type { Context } from "hono";
import { extractBranding } from "../branding";

export async function handleBrandExtract(c: Context) {
	const body =
		c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
	const url = (body as { url?: string }).url || c.req.query("url");
	if (!url) return c.json({ error: "Missing required parameter: url" }, 400);

	const profile = await extractBranding(url, { llm: true });
	return c.json(profile);
}
