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
 * Generate an abstract color-field composition from a 5-color palette.
 * Radial gradient blobs + organic bezier shapes on a dark ground —
 * deterministic from the input colors, looks like a designed art piece.
 */
export function generatePaletteSVG(colors: PaletteColor[]): string {
	const hexes = colors.map((c) => c.hex);
	const [c1, c2, c3, c4, c5] = [
		hexes[0] || "#4A1942",
		hexes[1] || "#C05780",
		hexes[2] || "#FF8C42",
		hexes[3] || "#F4E04D",
		hexes[4] || "#F8F4E1",
	];

	const seed = hashColors(hexes);

	// Deterministic blob positions distributed across canvas
	const p0x = 60 + (seed % 120);
	const p0y = 60 + ((seed * 3) % 120);
	const p1x = 320 + (seed % 100);
	const p1y = 40 + ((seed * 7) % 120);
	const p2x = 120 + ((seed * 5) % 140);
	const p2y = 290 + ((seed * 2) % 100);
	const p3x = 370 + (seed % 80);
	const p3y = 310 + ((seed * 4) % 100);
	const p4x = 230 + ((seed * 9) % 100);
	const p4y = 430 + (seed % 50);

	// Blob radii
	const r0 = 200 + (seed % 80);
	const r1 = 180 + ((seed * 3) % 80);
	const r2 = 220 + ((seed * 7) % 60);
	const r3 = 190 + ((seed * 2) % 90);
	const r4 = 160 + ((seed * 5) % 80);

	// Bezier path control points for organic accent shapes
	const bx1 = 80 + (seed % 160);
	const by1 = 20 + ((seed * 3) % 120);
	const bx2 = 300 + ((seed * 5) % 140);
	const by2 = 180 + ((seed * 7) % 140);
	const bex = 460 + (seed % 40);
	const bey = 280 + ((seed * 2) % 80);

	const bx3 = 40 + ((seed * 11) % 100);
	const by3 = 320 + (seed % 80);
	const bx4 = 240 + ((seed * 4) % 160);
	const by4 = 460 + ((seed * 3) % 40);

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <radialGradient id="rg0" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c1}" stop-opacity="0.9"/><stop offset="70%" stop-color="${c1}" stop-opacity="0.3"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></radialGradient>
    <radialGradient id="rg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c2}" stop-opacity="0.85"/><stop offset="65%" stop-color="${c2}" stop-opacity="0.25"/><stop offset="100%" stop-color="${c2}" stop-opacity="0"/></radialGradient>
    <radialGradient id="rg2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c3}" stop-opacity="0.8"/><stop offset="60%" stop-color="${c3}" stop-opacity="0.2"/><stop offset="100%" stop-color="${c3}" stop-opacity="0"/></radialGradient>
    <radialGradient id="rg3" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c4}" stop-opacity="0.85"/><stop offset="70%" stop-color="${c4}" stop-opacity="0.25"/><stop offset="100%" stop-color="${c4}" stop-opacity="0"/></radialGradient>
    <radialGradient id="rg4" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c5}" stop-opacity="0.75"/><stop offset="65%" stop-color="${c5}" stop-opacity="0.2"/><stop offset="100%" stop-color="${c5}" stop-opacity="0"/></radialGradient>
    <pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="1" height="1" x="1" y="1" fill="white" opacity="0.035"/><rect width="1" height="1" x="3" y="3" fill="white" opacity="0.025"/></pattern>
  </defs>
  <rect width="500" height="500" fill="#080808"/>
  <ellipse cx="${p0x}" cy="${p0y}" rx="${r0}" ry="${Math.round(r0 * 0.8)}" fill="url(#rg0)"/>
  <ellipse cx="${p1x}" cy="${p1y}" rx="${r1}" ry="${Math.round(r1 * 0.9)}" fill="url(#rg1)"/>
  <ellipse cx="${p2x}" cy="${p2y}" rx="${r2}" ry="${Math.round(r2 * 0.85)}" fill="url(#rg2)"/>
  <ellipse cx="${p3x}" cy="${p3y}" rx="${r3}" ry="${Math.round(r3 * 0.95)}" fill="url(#rg3)"/>
  <ellipse cx="${p4x}" cy="${p4y}" rx="${r4}" ry="${Math.round(r4 * 0.75)}" fill="url(#rg4)"/>
  <path d="M 0,${180 + (seed % 60)} C ${bx1},${by1} ${bx2},${by2} ${bex},${bey}" stroke="${c2}" stroke-width="1.5" fill="none" opacity="0.25"/>
  <path d="M ${30 + (seed % 60)},500 C ${bx3},${by3} ${bx4},${by4} 500,${360 + ((seed * 3) % 80)}" stroke="${c4}" stroke-width="1" fill="none" opacity="0.2"/>
  <rect width="500" height="500" fill="url(#grain)"/>
  <text x="484" y="492" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="7" fill="white" opacity="0.18" text-anchor="end" letter-spacing="2.5">BRANDCANVAS</text>
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
export function generateGuidelinesSVG(guidelines: {
	brandName: string;
	colorGuidelines?: {
		primary?: { hex: string };
		secondary?: { hex: string };
		accent?: { hex: string };
	};
}): string {
	const name = guidelines.brandName || "Brand";
	const initial = name.charAt(0).toUpperCase();
	const primary = guidelines.colorGuidelines?.primary?.hex || "#4F6BED";
	const secondary = guidelines.colorGuidelines?.secondary?.hex || "#1A1A2E";
	const accent = guidelines.colorGuidelines?.accent?.hex || "#00D4AA";

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
