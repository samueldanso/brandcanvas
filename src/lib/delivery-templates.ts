export interface NftInfo {
	tokenId: number;
	chain: string;
	owner: string;
	txHash: string;
	explorerUrl: string;
	imageUrl: string;
	contract: string;
}

function truncateAddress(addr: string): string {
	if (!addr || addr.length < 12) return addr;
	return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function renderNftReceipt(nft: NftInfo): string {
	return `
	<section class="nft-receipt">
		<h2>NFT Certificate of Ownership</h2>
		<div class="receipt-grid">
			<div class="receipt-item">
				<span class="label">Token</span>
				<span class="value">#${nft.tokenId}</span>
			</div>
			<div class="receipt-item">
				<span class="label">Chain</span>
				<span class="value">${nft.chain}</span>
			</div>
			<div class="receipt-item">
				<span class="label">Owner</span>
				<span class="value"><a href="https://www.okx.com/explorer/xlayer/address/${nft.owner}" target="_blank">${truncateAddress(nft.owner)}</a></span>
			</div>
			<div class="receipt-item">
				<span class="label">Contract</span>
				<span class="value"><a href="https://www.okx.com/explorer/xlayer/address/${nft.contract}" target="_blank">${truncateAddress(nft.contract)}</a></span>
			</div>
			<div class="receipt-item full-width">
				<span class="label">Transaction</span>
				<span class="value"><a href="${nft.explorerUrl}" target="_blank">${truncateAddress(nft.txHash)}</a></span>
			</div>
		</div>
	</section>`;
}

function renderDownloadSection(imageUrl: string): string {
	return `
	<section class="download-section">
		<a href="${imageUrl}" target="_blank" download class="download-btn">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v10M8 11L4 7M8 11l4-4M2 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
			Download Artwork (PNG)
		</a>
	</section>`;
}

function pageShell(title: string, content: string, extraHead = ""): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${extraHead}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	background: #0A0A0A;
	color: #E5E5E5;
	line-height: 1.6;
	min-height: 100vh;
}
.container {
	max-width: 800px;
	margin: 0 auto;
	padding: 48px 24px;
}
header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 48px;
	padding-bottom: 24px;
	border-bottom: 1px solid #1A1A1A;
}
.brand { font-size: 14px; letter-spacing: 2px; color: #888; text-transform: uppercase; }
.token-badge {
	font-size: 12px;
	padding: 4px 10px;
	border: 1px solid #333;
	border-radius: 100px;
	color: #AAA;
}
h1 { font-size: 28px; font-weight: 600; color: #FFF; margin-bottom: 8px; }
h2 { font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; color: #666; margin-bottom: 16px; }
.subtitle { color: #888; font-size: 15px; margin-bottom: 40px; }
section { margin-bottom: 48px; }
.artwork-section { text-align: center; margin-bottom: 48px; }
.artwork-section img {
	max-width: 100%;
	border-radius: 8px;
	border: 1px solid #1A1A1A;
}
.nft-receipt {
	background: #111;
	border: 1px solid #222;
	border-radius: 12px;
	padding: 24px;
}
.receipt-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
}
.receipt-item { display: flex; flex-direction: column; gap: 4px; }
.receipt-item.full-width { grid-column: 1 / -1; }
.receipt-item .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #555; }
.receipt-item .value { font-size: 14px; color: #CCC; font-family: monospace; }
.receipt-item a { color: #7B9CFF; text-decoration: none; }
.receipt-item a:hover { text-decoration: underline; }
.download-section { text-align: center; }
.download-btn {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 12px 24px;
	background: #FFF;
	color: #0A0A0A;
	border-radius: 8px;
	text-decoration: none;
	font-weight: 500;
	font-size: 14px;
	transition: opacity 0.2s;
}
.download-btn:hover { opacity: 0.85; }
.code-block {
	background: #111;
	border: 1px solid #222;
	border-radius: 8px;
	padding: 16px;
	font-family: 'SF Mono', 'Fira Code', monospace;
	font-size: 13px;
	color: #AAA;
	overflow-x: auto;
	white-space: pre-wrap;
	word-break: break-all;
}
footer {
	margin-top: 64px;
	padding-top: 24px;
	border-top: 1px solid #1A1A1A;
	text-align: center;
	color: #444;
	font-size: 12px;
	letter-spacing: 1px;
}
</style>
</head>
<body>
<div class="container">
${content}
<footer>BRANDCANVAS &middot; X LAYER</footer>
</div>
</body>
</html>`;
}

export function renderPaletteDelivery(
	data: Record<string, unknown>,
	nft: NftInfo,
): string {
	const palette = (data.palette || []) as Array<{
		hex: string;
		name: string;
		role: string;
		usage?: string;
		onWhite?: string;
		onBlack?: string;
	}>;
	const css = data.css as { variables?: string; tailwind?: string } | undefined;
	const contrast = data.contrast as Record<string, string> | undefined;
	const mood = (data.mood as string) || "";

	const swatches = palette
		.map(
			(c) => `
		<div class="swatch">
			<div class="swatch-color" style="background: ${c.hex}"></div>
			<div class="swatch-info">
				<span class="swatch-name">${c.name}</span>
				<span class="swatch-hex">${c.hex}</span>
				<span class="swatch-role">${c.role}</span>
			</div>
		</div>`,
		)
		.join("");

	const contrastRows = contrast
		? Object.entries(contrast)
				.map(
					([k, v]) =>
						`<div class="contrast-row"><span>${k.replace(/([A-Z])/g, " $1").trim()}</span><span class="contrast-value">${v}</span></div>`,
				)
				.join("")
		: "";

	const content = `
	<header>
		<span class="brand">BrandCanvas</span>
		<span class="token-badge">Token #${nft.tokenId}</span>
	</header>

	<h1>Color Palette</h1>
	<p class="subtitle">${mood}</p>

	<section class="artwork-section">
		<img src="${nft.imageUrl}" alt="Palette artwork" width="500" height="500">
	</section>

	${renderDownloadSection(nft.imageUrl)}

	<section>
		<h2>Colors</h2>
		<div class="palette-grid">${swatches}</div>
	</section>

	${
		contrastRows
			? `<section>
		<h2>Contrast Ratios (WCAG)</h2>
		<div class="contrast-list">${contrastRows}</div>
	</section>`
			: ""
	}

	${
		css?.variables
			? `<section>
		<h2>CSS Variables</h2>
		<div class="code-block">${css.variables}</div>
	</section>`
			: ""
	}

	${
		css?.tailwind
			? `<section>
		<h2>Tailwind Config</h2>
		<div class="code-block">${css.tailwind}</div>
	</section>`
			: ""
	}

	${renderNftReceipt(nft)}`;

	return pageShell(
		`BrandCanvas #${nft.tokenId} — Palette`,
		content,
		`<style>
.palette-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
.swatch { border: 1px solid #222; border-radius: 10px; overflow: hidden; background: #111; }
.swatch-color { height: 100px; }
.swatch-info { padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.swatch-name { font-size: 13px; color: #FFF; font-weight: 500; }
.swatch-hex { font-size: 12px; font-family: monospace; color: #888; }
.swatch-role { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #555; }
.contrast-list { background: #111; border: 1px solid #222; border-radius: 8px; padding: 16px; }
.contrast-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1A1A1A; font-size: 13px; }
.contrast-row:last-child { border-bottom: none; }
.contrast-value { font-family: monospace; color: #7BFF7B; }
</style>`,
	);
}

export function renderFontsDelivery(
	data: Record<string, unknown>,
	nft: NftInfo,
): string {
	const pairings = (data.pairings || []) as Array<{
		heading: {
			family: string;
			weights?: number[];
			googleFontsUrl?: string;
			css?: string;
		};
		body: {
			family: string;
			weights?: number[];
			googleFontsUrl?: string;
			css?: string;
		};
		rationale?: string;
		scale?: Record<string, string>;
		htmlImport?: string;
	}>;
	const recommendation = (data.recommendation as string) || "";
	const typescale = data.typescale as Record<string, string> | undefined;

	const fontLinks = pairings
		.flatMap((p) => [p.heading.googleFontsUrl, p.body.googleFontsUrl])
		.filter(Boolean)
		.map((url) => `<link rel="stylesheet" href="${url}">`)
		.join("\n");

	const pairingCards = pairings
		.map(
			(p, i) => `
		<div class="pairing-card">
			<div class="pairing-header">Pairing ${i + 1}</div>
			<div class="specimen-heading" style="font-family: '${p.heading.family}', serif">${p.heading.family}</div>
			<div class="specimen-body" style="font-family: '${p.body.family}', sans-serif">${p.body.family}</div>
			<p class="pairing-sample-heading" style="font-family: '${p.heading.family}', serif">The quick brown fox jumps over the lazy dog</p>
			<p class="pairing-sample-body" style="font-family: '${p.body.family}', sans-serif">Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.</p>
			${p.rationale ? `<p class="pairing-rationale">${p.rationale}</p>` : ""}
			${p.htmlImport ? `<div class="code-block">${p.htmlImport}</div>` : ""}
		</div>`,
		)
		.join("");

	const scaleSection = typescale
		? `<section>
		<h2>Type Scale</h2>
		<div class="scale-list">${Object.entries(typescale)
			.map(
				([k, v]) =>
					`<div class="scale-row"><span class="scale-label">${k}</span><span class="scale-value">${v}</span></div>`,
			)
			.join("")}</div>
	</section>`
		: "";

	const content = `
	<header>
		<span class="brand">BrandCanvas</span>
		<span class="token-badge">Token #${nft.tokenId}</span>
	</header>

	<h1>Font Pairings</h1>
	<p class="subtitle">${recommendation}</p>

	<section class="artwork-section">
		<img src="${nft.imageUrl}" alt="Typography artwork" width="500" height="500">
	</section>

	${renderDownloadSection(nft.imageUrl)}

	<section>
		<h2>Pairings</h2>
		${pairingCards}
	</section>

	${scaleSection}

	${renderNftReceipt(nft)}`;

	return pageShell(
		`BrandCanvas #${nft.tokenId} — Fonts`,
		content,
		`
${fontLinks}
<style>
.pairing-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
.pairing-header { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #555; margin-bottom: 16px; }
.specimen-heading { font-size: 32px; color: #FFF; margin-bottom: 4px; }
.specimen-body { font-size: 18px; color: #888; margin-bottom: 16px; }
.pairing-sample-heading { font-size: 20px; color: #DDD; margin-bottom: 8px; }
.pairing-sample-body { font-size: 15px; color: #888; line-height: 1.7; margin-bottom: 16px; }
.pairing-rationale { font-size: 13px; color: #666; font-style: italic; margin-bottom: 12px; }
.scale-list { background: #111; border: 1px solid #222; border-radius: 8px; padding: 16px; }
.scale-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1A1A1A; font-size: 13px; }
.scale-row:last-child { border-bottom: none; }
.scale-label { color: #888; }
.scale-value { font-family: monospace; color: #CCC; }
</style>`,
	);
}

export function renderGuidelinesDelivery(
	data: Record<string, unknown>,
	nft: NftInfo,
): string {
	const brandName = (data.brandName as string) || "Brand";
	const mission = (data.mission as string) || "";
	const vision = (data.vision as string) || "";
	const positioning = (data.positioning as string) || "";
	const voiceAndTone = data.voiceAndTone as
		| {
				personality?: string;
				voice?: string;
				doSay?: string[];
				dontSay?: string[];
		  }
		| undefined;
	const colorSystem = data.colorSystem as Record<string, string> | undefined;
	const typography = data.typography as
		| {
				headingFont?: string;
				bodyFont?: string;
				scale?: string;
				css?: string;
		  }
		| undefined;
	const usageRules = (data.usageRules as string[]) || [];
	const doNot = (data.doNot as string[]) || [];

	const colorChips = colorSystem
		? Object.entries(colorSystem)
				.map(
					([role, hex]) =>
						`<div class="color-chip"><div class="chip-swatch" style="background: ${hex}"></div><span class="chip-role">${role}</span><span class="chip-hex">${hex}</span></div>`,
				)
				.join("")
		: "";

	const voiceSection = voiceAndTone
		? `<section>
		<h2>Voice &amp; Tone</h2>
		${voiceAndTone.personality ? `<p class="voice-personality">${voiceAndTone.personality}</p>` : ""}
		${voiceAndTone.voice ? `<p class="voice-desc">${voiceAndTone.voice}</p>` : ""}
		<div class="do-dont-grid">
			${
				voiceAndTone.doSay?.length
					? `<div class="do-list"><h3>Do Say</h3><ul>${voiceAndTone.doSay.map((s) => `<li>${s}</li>`).join("")}</ul></div>`
					: ""
			}
			${
				voiceAndTone.dontSay?.length
					? `<div class="dont-list"><h3>Don't Say</h3><ul>${voiceAndTone.dontSay.map((s) => `<li>${s}</li>`).join("")}</ul></div>`
					: ""
			}
		</div>
	</section>`
		: "";

	const content = `
	<header>
		<span class="brand">BrandCanvas</span>
		<span class="token-badge">Token #${nft.tokenId}</span>
	</header>

	<h1>${brandName}</h1>
	<p class="subtitle">Brand Guidelines</p>

	<section class="artwork-section">
		<img src="${nft.imageUrl}" alt="Brand guidelines artwork" width="500" height="500">
	</section>

	${renderDownloadSection(nft.imageUrl)}

	${
		mission || vision
			? `<section>
		<h2>Mission &amp; Vision</h2>
		${mission ? `<p class="guidelines-text"><strong>Mission:</strong> ${mission}</p>` : ""}
		${vision ? `<p class="guidelines-text"><strong>Vision:</strong> ${vision}</p>` : ""}
		${positioning ? `<p class="guidelines-text"><strong>Positioning:</strong> ${positioning}</p>` : ""}
	</section>`
			: ""
	}

	${voiceSection}

	${
		colorChips
			? `<section>
		<h2>Color System</h2>
		<div class="chips-grid">${colorChips}</div>
	</section>`
			: ""
	}

	${
		typography
			? `<section>
		<h2>Typography</h2>
		<div class="typo-info">
			${typography.headingFont ? `<p><strong>Heading:</strong> ${typography.headingFont}</p>` : ""}
			${typography.bodyFont ? `<p><strong>Body:</strong> ${typography.bodyFont}</p>` : ""}
			${typography.scale ? `<p><strong>Scale:</strong> ${typography.scale}</p>` : ""}
		</div>
		${typography.css ? `<div class="code-block">${typography.css}</div>` : ""}
	</section>`
			: ""
	}

	${
		usageRules.length
			? `<section>
		<h2>Usage Rules</h2>
		<ul class="rules-list">${usageRules.map((r) => `<li>${r}</li>`).join("")}</ul>
	</section>`
			: ""
	}

	${
		doNot.length
			? `<section>
		<h2>Do Not</h2>
		<ul class="rules-list dont">${doNot.map((r) => `<li>${r}</li>`).join("")}</ul>
	</section>`
			: ""
	}

	${renderNftReceipt(nft)}`;

	return pageShell(
		`BrandCanvas #${nft.tokenId} — ${brandName} Guidelines`,
		content,
		`<style>
.guidelines-text { font-size: 15px; color: #CCC; margin-bottom: 12px; line-height: 1.7; }
.guidelines-text strong { color: #FFF; }
.voice-personality { font-size: 16px; color: #FFF; font-weight: 500; margin-bottom: 8px; }
.voice-desc { font-size: 14px; color: #888; margin-bottom: 16px; }
.do-dont-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.do-list, .dont-list { background: #111; border: 1px solid #222; border-radius: 8px; padding: 16px; }
.do-list h3 { color: #7BFF7B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.dont-list h3 { color: #FF7B7B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
.do-list ul, .dont-list ul { list-style: none; }
.do-list li, .dont-list li { font-size: 13px; color: #AAA; padding: 4px 0; }
.chips-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; }
.color-chip { background: #111; border: 1px solid #222; border-radius: 8px; padding: 12px; text-align: center; }
.chip-swatch { width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 8px; }
.chip-role { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
.chip-hex { display: block; font-size: 12px; font-family: monospace; color: #AAA; margin-top: 2px; }
.typo-info p { font-size: 14px; color: #CCC; margin-bottom: 8px; }
.typo-info strong { color: #FFF; }
.rules-list { list-style: none; background: #111; border: 1px solid #222; border-radius: 8px; padding: 16px; }
.rules-list li { font-size: 13px; color: #AAA; padding: 6px 0; border-bottom: 1px solid #1A1A1A; }
.rules-list li:last-child { border-bottom: none; }
.rules-list li::before { content: "✓ "; color: #7BFF7B; }
.rules-list.dont li::before { content: "✗ "; color: #FF7B7B; }
</style>`,
	);
}

export function renderFallbackDelivery(
	tokenId: number,
	kitType: string,
	imageUrl: string,
	owner: string,
): string {
	const content = `
	<header>
		<span class="brand">BrandCanvas</span>
		<span class="token-badge">Token #${tokenId}</span>
	</header>

	<h1>${kitType.charAt(0).toUpperCase() + kitType.slice(1)} Kit</h1>
	<p class="subtitle">Brand asset with on-chain IP provenance</p>

	<section class="artwork-section">
		<img src="${imageUrl}" alt="Brand artwork" width="500" height="500">
	</section>

	${renderDownloadSection(imageUrl)}

	<section class="nft-receipt">
		<h2>NFT Certificate of Ownership</h2>
		<div class="receipt-grid">
			<div class="receipt-item">
				<span class="label">Token</span>
				<span class="value">#${tokenId}</span>
			</div>
			<div class="receipt-item">
				<span class="label">Chain</span>
				<span class="value">X Layer (eip155:196)</span>
			</div>
			<div class="receipt-item">
				<span class="label">Owner</span>
				<span class="value"><a href="https://www.okx.com/explorer/xlayer/address/${owner}" target="_blank">${truncateAddress(owner)}</a></span>
			</div>
			<div class="receipt-item">
				<span class="label">Type</span>
				<span class="value">${kitType}</span>
			</div>
		</div>
	</section>`;

	return pageShell(`BrandCanvas #${tokenId}`, content);
}
