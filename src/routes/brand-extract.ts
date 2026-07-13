import type { Context } from "hono";
import { extractBranding } from "../branding";

/**
 * Generate CSS custom properties from extracted brand data.
 * Agents can inject these directly into stylesheets.
 */
function toDesignTokens(profile: Record<string, unknown>): {
	css: string;
	tokens: Record<string, string>;
} {
	const colors = (profile.colors || {}) as Record<string, string | undefined>;
	const typography = (profile.typography || {}) as Record<string, unknown>;
	const spacing = (profile.spacing || {}) as Record<string, unknown>;
	const fontFamilies = (typography.fontFamilies || {}) as Record<
		string,
		string | undefined
	>;

	const tokens: Record<string, string> = {};

	if (colors.primary) tokens["--brand-primary"] = colors.primary;
	if (colors.secondary) tokens["--brand-secondary"] = colors.secondary;
	if (colors.accent) tokens["--brand-accent"] = colors.accent;
	if (colors.background) tokens["--brand-background"] = colors.background;
	if (colors.textPrimary) tokens["--brand-text"] = colors.textPrimary;
	if (colors.textSecondary)
		tokens["--brand-text-secondary"] = colors.textSecondary;
	if (colors.link) tokens["--brand-link"] = colors.link;
	if (fontFamilies.primary)
		tokens["--brand-font-body"] = `'${fontFamilies.primary}', sans-serif`;
	if (fontFamilies.heading)
		tokens["--brand-font-heading"] = `'${fontFamilies.heading}', sans-serif`;
	if (spacing.baseUnit)
		tokens["--brand-space-unit"] = `${spacing.baseUnit}px`;
	if (spacing.borderRadius)
		tokens["--brand-radius"] = String(spacing.borderRadius);

	const css = `:root {\n${Object.entries(tokens)
		.map(([k, v]) => `  ${k}: ${v};`)
		.join("\n")}\n}`;

	return { css, tokens };
}

export async function handleBrandExtract(c: Context) {
	const body =
		c.req.method === "POST" ? await c.req.json().catch(() => ({})) : {};
	const url = (body as { url?: string }).url || c.req.query("url");
	if (!url) return c.json({ error: "Missing required parameter: url" }, 400);

	const profile = await extractBranding(url, { llm: true });

	// Add design tokens — CSS custom properties agents can use directly
	const designTokens = toDesignTokens(profile as Record<string, unknown>);

	return c.json({
		...profile,
		designTokens,
	});
}
