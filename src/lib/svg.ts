/**
 * Programmatic SVG generation for BrandCanvas NFTs.
 * Each palette/font/guideline produces a unique visual composition.
 */

interface PaletteColor {
	hex: string;
	name?: string;
	role?: string;
}

/**
 * Generate a polished brand palette card SVG — clear color swatches
 * with hex values, names, and roles. Looks like a design agency deliverable.
 */
export function generatePaletteSVG(colors: PaletteColor[]): string {
	const palette = colors.slice(0, 5).map((c, i) => ({
		hex: c.hex || ["#4A1942", "#C05780", "#FF8C42", "#F4E04D", "#F8F4E1"][i],
		name: c.name || `Color ${i + 1}`,
		role:
			c.role || ["primary", "secondary", "accent", "neutral", "background"][i],
	}));

	const swatches = palette
		.map((c, i) => {
			const x = 40 + i * 88;
			const textColor = isLight(c.hex) ? "#1A1A1A" : "#FFFFFF";
			return `<rect x="${x}" y="120" width="76" height="180" rx="6" fill="${c.hex}"/>
  <text x="${x + 38}" y="330" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="9" fill="#AAAAAA" text-anchor="middle" letter-spacing="0.5">${c.hex.toUpperCase()}</text>
  <text x="${x + 38}" y="348" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="8" fill="#666666" text-anchor="middle" letter-spacing="1.5">${c.role.toUpperCase()}</text>
  <text x="${x + 38}" y="220" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="8" fill="${textColor}" text-anchor="middle" opacity="0.8" letter-spacing="0.5">${truncate(c.name, 10)}</text>`;
		})
		.join("\n  ");

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="#0A0A0A"/>
  <text x="40" y="52" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="11" fill="#FFFFFF" letter-spacing="3" opacity="0.9">COLOR SYSTEM</text>
  <line x1="40" y1="68" x2="460" y2="68" stroke="#222222" stroke-width="1"/>
  <text x="40" y="92" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="9" fill="#555555" letter-spacing="1">${palette.length} COLORS • WCAG ACCESSIBLE</text>
  ${swatches}
  <line x1="40" y1="380" x2="460" y2="380" stroke="#1A1A1A" stroke-width="1"/>
  <rect x="40" y="400" width="420" height="60" rx="4" fill="#111111"/>
  <text x="60" y="422" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="8" fill="#555555" letter-spacing="1">CSS VARIABLES</text>
  <text x="60" y="442" font-family="monospace" font-size="8" fill="#888888">--color-primary: ${palette[0].hex}; --color-secondary: ${palette[1].hex};</text>
  <text x="60" y="454" font-family="monospace" font-size="8" fill="#888888">--color-accent: ${palette[2].hex}; --color-neutral: ${palette[3].hex};</text>
  <text x="460" y="492" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="white" opacity="0.15" text-anchor="end" letter-spacing="2.5">BRANDCANVAS • X LAYER</text>
</svg>`;
}

/**
 * Generate a typographic poster SVG showcasing font pairings.
 * Giant ghost letterform as backdrop, warm-neutral palette, editorial feel.
 */
export function generateFontsSVG(
	pairings: Array<{
		heading: { family: string };
		body: { family: string };
	}>,
): string {
	const pair = pairings[0] || {
		heading: { family: "Inter" },
		body: { family: "System" },
	};
	const heading = pair.heading.family;
	const body = pair.body.family;

	const giant = heading.charAt(0).toUpperCase();
	const headingUpper = heading.toUpperCase();
	const bodyUpper = body.toUpperCase();
	const headingFontSize = heading.length > 14 ? 32 : 40;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0D0A"/>
      <stop offset="100%" stop-color="#1A1612"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bgGrad)"/>
  <text x="-20" y="420" font-family="'${heading}', Georgia, 'Times New Roman', serif" font-size="500" font-weight="700" fill="#F5F0E8" opacity="0.03" letter-spacing="-20">${giant}</text>
  <rect x="40" y="162" width="56" height="2" fill="#C8964C"/>
  <text x="40" y="148" font-family="'${heading}', Georgia, 'Times New Roman', serif" font-size="72" font-weight="700" fill="#F5F0E8" letter-spacing="-2">${giant}g</text>
  <text x="40" y="188" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="9" fill="#C8964C" letter-spacing="4">${headingUpper}</text>
  <text x="40" y="204" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="8" fill="#4A4035" letter-spacing="2">DISPLAY . BOLD 700</text>
  <line x1="40" y1="230" x2="460" y2="230" stroke="#2A2520" stroke-width="1"/>
  <text x="40" y="${230 + headingFontSize + 10}" font-family="'${heading}', Georgia, 'Times New Roman', serif" font-size="${headingFontSize}" font-weight="700" fill="#F5F0E8" letter-spacing="-1">The quick brown</text>
  <text x="40" y="${230 + headingFontSize * 2 + 18}" font-family="'${heading}', Georgia, 'Times New Roman', serif" font-size="${headingFontSize}" font-weight="700" fill="#F5F0E8" letter-spacing="-1">fox jumps over.</text>
  <line x1="40" y1="345" x2="460" y2="345" stroke="#1E1A16" stroke-width="0.5"/>
  <text x="40" y="370" font-family="'${body}', 'Georgia', serif" font-size="22" font-weight="400" fill="#8A8070" letter-spacing="1">Aa Bb Cc Dd 1 2 3</text>
  <text x="40" y="396" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="9" fill="#C8964C" letter-spacing="4">${bodyUpper}</text>
  <text x="40" y="412" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="8" fill="#4A4035" letter-spacing="2">BODY . REGULAR 400</text>
  <text x="40" y="450" font-family="'${body}', 'Georgia', serif" font-size="12" fill="#4A4035">The quick brown fox jumps over the lazy dog.</text>
  <line x1="40" y1="468" x2="460" y2="468" stroke="#1E1A16" stroke-width="0.5"/>
  <text x="460" y="488" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="#2E2820" text-anchor="end" letter-spacing="2.5">BRANDCANVAS . TYPOGRAPHY</text>
</svg>`;
}

/**
 * Generate a polished brand identity card SVG from guidelines.
 * Asymmetric layout: primary-color left band, brand name hero, integrated color chips.
 */
export function generateGuidelinesSVG(
	guidelines: Record<string, unknown>,
): string {
	const name = (guidelines.brandName as string) || "Brand";
	const initial = name.charAt(0).toUpperCase();
	const colors = (guidelines.colorSystem ||
		guidelines.colorGuidelines ||
		{}) as Record<string, { hex?: string }>;
	const primary = colors.primary?.hex || "#4F6BED";
	const secondary =
		colors.secondary?.hex || colors.neutralDark?.hex || "#1A1A2E";
	const accent = colors.accent?.hex || "#00D4AA";

	const displayName = name.length > 16 ? `${name.substring(0, 16)}...` : name;
	const nameFontSize = name.length > 12 ? 34 : name.length > 8 ? 44 : 54;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primary}"/>
      <stop offset="100%" stop-color="${primary}" stop-opacity="0.88"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="#080808"/>
  <rect x="0" y="0" width="155" height="500" fill="url(#bandGrad)"/>
  <text x="77" y="320" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="220" font-weight="700" fill="white" opacity="0.1" text-anchor="middle">${initial}</text>
  <text x="77" y="300" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="110" font-weight="700" fill="white" opacity="0.92" text-anchor="middle">${initial}</text>
  <rect x="155" y="0" width="1" height="500" fill="${accent}" opacity="0.35"/>
  <text x="182" y="${200}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="${nameFontSize}" font-weight="700" fill="white" letter-spacing="-1">${displayName}</text>
  <rect x="182" y="${200 + 16}" width="200" height="2" fill="url(#accentLine)"/>
  <text x="182" y="${200 + 38}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="9" fill="${accent}" letter-spacing="4">BRAND IDENTITY</text>
  <text x="182" y="${200 + 56}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="9" fill="#3A3A3A" letter-spacing="1">Generated by BrandCanvas</text>
  <rect x="182" y="340" width="72" height="72" rx="3" fill="${primary}"/>
  <rect x="264" y="340" width="72" height="72" rx="3" fill="${secondary}"/>
  <rect x="346" y="340" width="72" height="72" rx="3" fill="${accent}"/>
  <text x="218" y="432" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="#444444" text-anchor="middle" letter-spacing="1">PRIMARY</text>
  <text x="300" y="432" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="#444444" text-anchor="middle" letter-spacing="1">SECONDARY</text>
  <text x="382" y="432" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="#444444" text-anchor="middle" letter-spacing="1">ACCENT</text>
  <text x="218" y="446" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="#2A2A2A" text-anchor="middle">${primary}</text>
  <text x="300" y="446" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="#2A2A2A" text-anchor="middle">${secondary}</text>
  <text x="382" y="446" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="#2A2A2A" text-anchor="middle">${accent}</text>
  <text x="476" y="488" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="#1E1E1E" text-anchor="end" letter-spacing="2.5">BRANDCANVAS . X LAYER</text>
</svg>`;
}

/**
 * Convert SVG string to a data URI suitable for NFT tokenURI image field.
 */
export function svgToDataUri(svg: string): string {
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function isLight(hex: string): boolean {
	const c = hex.replace("#", "");
	const r = Number.parseInt(c.substring(0, 2), 16);
	const g = Number.parseInt(c.substring(2, 4), 16);
	const b = Number.parseInt(c.substring(4, 6), 16);
	return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function truncate(str: string, max: number): string {
	return str.length > max ? `${str.substring(0, max)}…` : str;
}

/**
 * Derive a deterministic seed from color hex values for composition variation.
 */
function hashColors(hexes: string[]): number {
	const str = hexes.join("");
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit int
	}
	return Math.abs(hash);
}
