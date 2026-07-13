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
 * Generate an abstract geometric composition from a 5-color palette.
 * Produces a unique visual based on color relationships — overlapping shapes,
 * angular cuts, and gradient bands.
 */
export function generatePaletteSVG(colors: PaletteColor[]): string {
	const hexes = colors.map((c) => c.hex);
	const [c1, c2, c3, c4, c5] = [
		hexes[0] || "#000000",
		hexes[1] || "#333333",
		hexes[2] || "#666666",
		hexes[3] || "#999999",
		hexes[4] || "#CCCCCC",
	];

	// Derive composition angles from color values for uniqueness
	const seed = hashColors(hexes);
	const angle = 15 + (seed % 30);
	const r1 = 80 + (seed % 60);
	const r2 = 60 + ((seed * 3) % 80);
	const cx = 200 + ((seed * 7) % 100);
	const cy = 180 + ((seed * 11) % 100);

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c3}"/>
      <stop offset="60%" stop-color="${c3}" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="500" height="500" fill="${c5}"/>
  <!-- Primary diagonal block -->
  <polygon points="0,0 500,0 500,${280 + (seed % 40)} 0,${350 - (seed % 50)}" fill="${c1}" opacity="0.95"/>
  <!-- Secondary angular cut -->
  <polygon points="${200 + (seed % 80)},0 500,0 500,${220 + (seed % 60)} ${100 + (seed % 100)},${300 + (seed % 40)}" fill="${c2}" opacity="0.85"/>
  <!-- Accent circle -->
  <circle cx="${cx}" cy="${cy}" r="${r1}" fill="${c3}" opacity="0.9"/>
  <!-- Smaller complementary circle -->
  <circle cx="${cx + 120}" cy="${cy + 80}" r="${r2}" fill="${c4}" opacity="0.7"/>
  <!-- Accent stripe -->
  <rect x="0" y="${420 - (seed % 30)}" width="500" height="${60 + (seed % 20)}" fill="${c3}" opacity="0.8" transform="rotate(-${angle} 250 250)"/>
  <!-- Subtle grid lines -->
  <line x1="0" y1="250" x2="500" y2="250" stroke="${c4}" stroke-width="0.5" opacity="0.3"/>
  <line x1="250" y1="0" x2="250" y2="500" stroke="${c4}" stroke-width="0.5" opacity="0.3"/>
  <!-- Color strip at bottom -->
  <rect x="0" y="460" width="100" height="40" fill="${c1}"/>
  <rect x="100" y="460" width="100" height="40" fill="${c2}"/>
  <rect x="200" y="460" width="100" height="40" fill="${c3}"/>
  <rect x="300" y="460" width="100" height="40" fill="${c4}"/>
  <rect x="400" y="460" width="100" height="40" fill="${c5}" stroke="${c4}" stroke-width="1"/>
  <!-- BrandCanvas watermark -->
  <text x="16" y="448" font-family="monospace" font-size="9" fill="${c4}" opacity="0.6">BrandCanvas IP</text>
</svg>`;
}

/**
 * Generate a typography specimen SVG showing font pairings.
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

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="#0A0A0A"/>
  <!-- Heading font showcase -->
  <text x="40" y="100" font-family="'${heading}', sans-serif" font-size="48" font-weight="700" fill="#FFFFFF" letter-spacing="-1">Aa</text>
  <text x="40" y="145" font-family="monospace" font-size="12" fill="#666666">${heading}</text>
  <text x="40" y="165" font-family="monospace" font-size="10" fill="#444444">Heading · 700</text>
  <!-- Body font showcase -->
  <text x="40" y="250" font-family="'${body}', sans-serif" font-size="36" font-weight="400" fill="#CCCCCC">Aa Bb Cc</text>
  <text x="40" y="290" font-family="monospace" font-size="12" fill="#666666">${body}</text>
  <text x="40" y="310" font-family="monospace" font-size="10" fill="#444444">Body · 400</text>
  <!-- Sample text block -->
  <text x="40" y="370" font-family="'${body}', sans-serif" font-size="14" fill="#888888">The quick brown fox jumps over</text>
  <text x="40" y="390" font-family="'${body}', sans-serif" font-size="14" fill="#888888">the lazy dog. 0123456789</text>
  <!-- Divider -->
  <line x1="40" y1="195" x2="460" y2="195" stroke="#222222" stroke-width="1"/>
  <!-- Label -->
  <text x="40" y="460" font-family="monospace" font-size="9" fill="#444444">BrandCanvas IP · Font Pairing</text>
</svg>`;
}

/**
 * Generate a brand identity card SVG from guidelines.
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

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" fill="#0D0D0D"/>
  <!-- Monogram circle -->
  <circle cx="250" cy="180" r="80" fill="${primary}"/>
  <text x="250" y="205" font-family="'Inter', 'Helvetica', sans-serif" font-size="72" font-weight="700" fill="#FFFFFF" text-anchor="middle">${initial}</text>
  <!-- Brand name -->
  <text x="250" y="310" font-family="'Inter', 'Helvetica', sans-serif" font-size="28" font-weight="600" fill="#FFFFFF" text-anchor="middle">${name}</text>
  <!-- Tagline -->
  <text x="250" y="340" font-family="'Inter', 'Helvetica', sans-serif" font-size="12" fill="#666666" text-anchor="middle">Brand Guidelines · Generated by BrandCanvas</text>
  <!-- Color swatches -->
  <rect x="160" y="380" width="50" height="50" rx="6" fill="${primary}"/>
  <rect x="225" y="380" width="50" height="50" rx="6" fill="${secondary}"/>
  <rect x="290" y="380" width="50" height="50" rx="6" fill="${accent}"/>
  <!-- Swatch labels -->
  <text x="185" y="450" font-family="monospace" font-size="8" fill="#555555" text-anchor="middle">Primary</text>
  <text x="250" y="450" font-family="monospace" font-size="8" fill="#555555" text-anchor="middle">Secondary</text>
  <text x="315" y="450" font-size="8" font-family="monospace" fill="#555555" text-anchor="middle">Accent</text>
  <!-- Footer -->
  <text x="250" y="488" font-family="monospace" font-size="9" fill="#333333" text-anchor="middle">BrandCanvas IP · X Layer</text>
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
