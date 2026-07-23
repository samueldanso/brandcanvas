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
		<div class="receipt-header">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 6.667V5.333A4 4 0 004 5.333v1.334M3.333 6.667h9.334c.736 0 1.333.597 1.333 1.333v4.667c0 .736-.597 1.333-1.333 1.333H3.333A1.333 1.333 0 012 12.667V8c0-.736.597-1.333 1.333-1.333z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="10" r="1" fill="currentColor"/></svg>
			<span>NFT Certificate of Authenticity</span>
		</div>
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
				<span class="value">${nft.txHash ? `<a href="https://www.okx.com/explorer/xlayer/tx/${nft.txHash}" target="_blank">${truncateAddress(nft.txHash)}</a>` : "—"}</span>
			</div>
			<div class="receipt-item full-width">
				<a href="https://web3.okx.com/explorer/x-layer/evm/assets/${nft.contract.toLowerCase()}/${nft.tokenId}" target="_blank" class="explorer-link">
					View NFT on OKX Explorer →
				</a>
			</div>
		</div>
	</section>`;
}

function renderDownloadSection(
	imageUrl: string,
	explorerUrl?: string,
	tokenId?: number,
): string {
	const downloadHref = tokenId ? `/download/${tokenId}` : imageUrl;
	const viewHref = imageUrl;
	return `
	<section class="download-section">
		<a href="${downloadHref}" class="download-btn">
			<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 1v10M8 11L4 7M8 11l4-4M2 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
			Download Artwork
		</a>
		<a href="${viewHref}" target="_blank" class="view-link">Open in new tab ↗</a>
		<span class="download-hint">High-resolution PNG — minted on IPFS${explorerUrl ? ` · <a href="${explorerUrl}" target="_blank" style="color: var(--accent)">View NFT →</a>` : ""}</span>
	</section>`;
}

function pageShell(title: string, content: string, extraHead = ""): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
${extraHead}
<style>
:root {
	--bg: #151518;
	--surface: rgba(255, 255, 255, 0.04);
	--surface-border: rgba(255, 255, 255, 0.09);
	--border: rgba(255, 255, 255, 0.07);
	--text-primary: #F0EDE6;
	--text-secondary: #A8A294;
	--text-muted: #75705F;
	--accent: #4A6FA5;
	--accent-soft: rgba(74, 111, 165, 0.15);
	--success: #7BCC7B;
	--danger: #CC7B7B;
	--radius-sm: 8px;
	--radius-md: 12px;
	--radius-lg: 16px;
	--font-display: 'EB Garamond', Georgia, serif;
	--font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
	--font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
[data-theme="light"] {
	--bg: #FDFCF9;
	--surface: rgba(0, 0, 0, 0.02);
	--surface-border: rgba(0, 0, 0, 0.08);
	--border: rgba(0, 0, 0, 0.06);
	--text-primary: #33302A;
	--text-secondary: #55503F;
	--text-muted: #9A937F;
	--accent: #4A6FA5;
	--accent-soft: rgba(74, 111, 165, 0.08);
	--success: #2D7A3A;
	--danger: #B84040;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
	font-family: var(--font-body);
	background: var(--bg);
	color: var(--text-primary);
	line-height: 1.6;
	min-height: 100vh;
	transition: background 0.3s, color 0.3s;
}
.accent-line {
	height: 2px;
	background: linear-gradient(90deg, transparent, var(--accent), transparent);
	opacity: 0.4;
}
.container {
	max-width: 840px;
	margin: 0 auto;
	padding: 48px 24px;
}
header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24px;
	padding-bottom: 20px;
	border-bottom: 1px solid var(--border);
}
.header-right { display: flex; align-items: center; gap: 12px; }
.theme-toggle {
	width: 32px;
	height: 32px;
	border: 1px solid var(--surface-border);
	border-radius: 50%;
	background: var(--surface);
	color: var(--text-muted);
	cursor: pointer;
	display: grid;
	place-items: center;
	transition: all 0.2s;
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}
.theme-toggle:hover { color: var(--text-primary); border-color: var(--accent); }
.theme-toggle .sun { display: none; }
.theme-toggle .moon { display: block; }
[data-theme="light"] .theme-toggle .sun { display: block; }
[data-theme="light"] .theme-toggle .moon { display: none; }
[data-theme="light"] .download-btn { background: var(--text-primary); color: #FDFCF9; }
[data-theme="light"] .artwork-section img { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); }
[data-theme="light"] .accent-line { opacity: 0.6; }
[data-theme="light"] .code-block { background: rgba(0, 0, 0, 0.04); border-color: rgba(0, 0, 0, 0.1); }
.brand-mark {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-family: var(--font-mono);
	font-size: 0.82rem;
	font-weight: 500;
	letter-spacing: 0.04em;
	color: var(--text-secondary);
	text-transform: uppercase;
}
.brand-logo {
	width: 22px;
	height: 22px;
	border-radius: 5px;
	background: var(--accent);
	display: grid;
	place-items: center;
}
.token-badge {
	font-family: var(--font-mono);
	font-size: 0.72rem;
	padding: 5px 12px;
	border: 1px solid var(--surface-border);
	border-radius: 100px;
	color: var(--text-muted);
	background: var(--surface);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}
h1 {
	font-family: var(--font-display);
	font-size: clamp(2rem, 5vw, 2.8rem);
	font-weight: 400;
	color: var(--text-primary);
	margin-bottom: 8px;
	letter-spacing: -0.01em;
}
h1 em {
	font-style: italic;
	color: var(--accent);
}
h2 {
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--text-muted);
	margin-bottom: 16px;
}
.subtitle {
	font-family: var(--font-body);
	font-size: 1rem;
	color: var(--text-secondary);
	margin-bottom: 32px;
	line-height: 1.7;
}
section { margin-bottom: 36px; }
.section-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
.section-header h2 { margin-bottom: 0; }
.section-desc { font-size: 0.78rem; color: var(--text-muted); max-width: 280px; text-align: right; line-height: 1.5; }
.glass-card {
	background: var(--surface);
	border: 1px solid var(--surface-border);
	border-radius: var(--radius-lg);
	padding: 28px;
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
}
.artwork-section { text-align: center; margin-bottom: 24px; }
.artwork-section img {
	max-width: 560px;
	width: 100%;
	border-radius: var(--radius-lg);
	border: 1px solid var(--surface-border);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
.nft-receipt {
	background: var(--surface);
	border: 1px solid var(--surface-border);
	border-radius: var(--radius-lg);
	padding: 28px;
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
}
.receipt-header {
	display: flex;
	align-items: center;
	gap: 8px;
	font-family: var(--font-mono);
	font-size: 0.7rem;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: var(--text-muted);
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 1px solid var(--border);
}
.receipt-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
}
.receipt-item { display: flex; flex-direction: column; gap: 4px; }
.receipt-item.full-width { grid-column: 1 / -1; }
.receipt-item .label {
	font-family: var(--font-mono);
	font-size: 0.65rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--text-muted);
}
.receipt-item .value {
	font-size: 0.85rem;
	color: var(--text-secondary);
	font-family: var(--font-mono);
}
.receipt-item a, .explorer-link {
	color: var(--accent);
	text-decoration: none;
	transition: opacity 0.15s;
}
.receipt-item a:hover, .explorer-link:hover { opacity: 0.75; }
.explorer-link {
	display: inline-block;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	padding: 8px 16px;
	border: 1px solid var(--surface-border);
	border-radius: var(--radius-sm);
	color: var(--accent);
	background: var(--accent-soft);
	transition: all 0.2s cubic-bezier(0.3, 0.9, 0.3, 1);
}
.explorer-link:hover {
	background: rgba(74, 111, 165, 0.25);
	border-color: var(--accent);
}
.download-section { text-align: center; margin-bottom: 32px; }
.download-btn {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	padding: 14px 28px;
	background: var(--text-primary);
	color: var(--bg);
	border-radius: var(--radius-md);
	text-decoration: none;
	font-weight: 500;
	font-size: 0.9rem;
	transition: all 0.25s cubic-bezier(0.3, 0.9, 0.3, 1);
	box-shadow: 0 2px 12px rgba(240, 237, 230, 0.1);
}
.download-btn:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 20px rgba(240, 237, 230, 0.15);
}
.download-hint {
	display: block;
	margin-top: 10px;
	font-size: 0.75rem;
	color: var(--text-muted);
}
.view-link {
	display: inline-block;
	margin-top: 8px;
	font-size: 0.78rem;
	color: var(--text-muted);
	text-decoration: none;
	transition: color 0.2s;
}
.view-link:hover { color: var(--accent); }
.code-block {
	position: relative;
	background: rgba(0, 0, 0, 0.4);
	border: 1px solid var(--border);
	border-radius: var(--radius-md);
	padding: 18px;
	padding-right: 48px;
	font-family: var(--font-mono);
	font-size: 0.78rem;
	color: var(--text-secondary);
	overflow-x: auto;
	white-space: pre-wrap;
	word-break: break-all;
	line-height: 1.7;
}
.copy-btn {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 28px;
	height: 28px;
	border: 1px solid var(--surface-border);
	border-radius: 6px;
	background: var(--surface);
	color: var(--text-muted);
	cursor: pointer;
	display: grid;
	place-items: center;
	transition: all 0.2s;
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}
.copy-btn:hover { color: var(--text-primary); border-color: var(--accent); }
.copy-btn.copied { color: var(--success); border-color: var(--success); }
footer {
	margin-top: 72px;
	padding-top: 20px;
	border-top: 1px solid var(--border);
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.55rem;
	font-family: var(--font-mono);
	font-size: 0.72rem;
	color: var(--text-muted);
	letter-spacing: 0.02em;
}
footer a {
	color: var(--text-secondary);
	text-decoration: underline;
	text-underline-offset: 3px;
	transition: opacity 0.15s;
}
footer a:hover { opacity: 0.7; }
@media (max-width: 640px) {
	.container { padding: 32px 16px; }
	.receipt-grid { grid-template-columns: 1fr; }
	h1 { font-size: 1.8rem; }
}
</style>
</head>
<body>
<div class="accent-line"></div>
<div class="container">
${content}
<footer>

	<span>BrandCanvas</span>
	<span>&middot;</span>
	<span>X Layer</span>
	<span>&middot;</span>
	<a href="https://www.okx.ai/agents/5331" target="_blank">View on OKX.AI</a>
</footer>
</div>
<script>
function toggleTheme(){var h=document.documentElement;var t=h.getAttribute('data-theme')==='light'?'dark':'light';h.setAttribute('data-theme',t==='dark'?'':t);try{localStorage.setItem('bc-theme',t)}catch(e){}}
try{var s=localStorage.getItem('bc-theme');if(s==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}
document.querySelectorAll('.code-block').forEach(function(block){var btn=document.createElement('button');btn.className='copy-btn';btn.title='Copy';btn.innerHTML='<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M3 11V3a1.5 1.5 0 011.5-1.5H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';btn.onclick=function(){var text=block.textContent.replace(btn.textContent,'').trim();navigator.clipboard.writeText(text).then(function(){btn.classList.add('copied');btn.innerHTML='<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';setTimeout(function(){btn.classList.remove('copied');btn.innerHTML='<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M3 11V3a1.5 1.5 0 011.5-1.5H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';},2000)})};block.appendChild(btn)});
</script>
</body>
</html>`;
}

export function renderPaletteDelivery(
	data: Record<string, unknown>,
	nft: NftInfo,
): string {
	const brandName = (data.brandName as string) || "";
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

	const gradientColors = palette.map((c) => c.hex).join(", ");

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
				.map(([k, v]) => {
					const ratio = Number.parseFloat(v);
					let badge = "fail";
					let badgeClass = "badge-fail";
					if (ratio >= 7) {
						badge = "AAA";
						badgeClass = "badge-aaa";
					} else if (ratio >= 4.5) {
						badge = "AA";
						badgeClass = "badge-aa";
					}
					return `<div class="contrast-row"><span class="contrast-label">${k.replace(/([A-Z])/g, " $1").trim()}</span><span class="contrast-badge ${badgeClass}">${badge}</span><span class="contrast-ratio">${v}</span></div>`;
				})
				.join("")
		: "";

	const content = `
	<header>
		<span class="brand-mark"><span class="brand-logo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="18" height="20" stroke="white" stroke-width="2.2"/><rect x="9" y="8" width="12" height="14" stroke="white" stroke-width="2.2"/><rect x="14" y="13" width="7" height="9" stroke="white" stroke-width="2.2"/></svg></span>BrandCanvas</span>
		<div class="header-right">
			<span class="token-badge">Delivery #${nft.tokenId}</span>
			<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
				<svg class="moon" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 8.5A6 6 0 017.5 2a6 6 0 106.5 6.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
				<svg class="sun" width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
			</button>
		</div>
	</header>

	<h1>${brandName ? `<em>${brandName}</em> — ` : ""}Color Palette</h1>
	<p class="subtitle">${mood}</p>

	${palette.length > 1 ? `<div class="palette-hero" style="background: linear-gradient(135deg, ${gradientColors})"></div>` : ""}

	<section class="artwork-section">
		<img src="${nft.imageUrl}" alt="Palette artwork">
	</section>

	${renderDownloadSection(nft.imageUrl, `https://web3.okx.com/explorer/x-layer/evm/assets/${nft.contract.toLowerCase()}/${nft.tokenId}`, nft.tokenId)}

	<section>
		<div class="section-header"><h2>Colors</h2><span class="section-desc">${palette.length} colors with assigned roles for consistent application.</span></div>
		<div class="palette-grid">${swatches}</div>
	</section>

	${
		contrastRows
			? `<section>
		<div class="section-header"><h2>Contrast Ratios</h2><span class="section-desc">Every pairing checked against WCAG 2.1 guidelines.</span></div>
		<div class="glass-card"><div class="contrast-list">${contrastRows}</div></div>
	</section>`
			: ""
	}

	${
		css?.variables
			? `<section>
		<div class="section-header"><h2>CSS Variables</h2><span class="section-desc">Copy into your stylesheet — ready to use.</span></div>
		<div class="code-block">${css.variables}</div>
	</section>`
			: ""
	}

	${
		css?.tailwind
			? `<section>
		<div class="section-header"><h2>Tailwind Config</h2><span class="section-desc">Drop into tailwind.config.js colors.</span></div>
		<div class="code-block">${css.tailwind}</div>
	</section>`
			: ""
	}

	<section>
		<div class="section-header"><h2>Design Spec</h2><span class="section-desc">Copy as design.md into any project.</span></div>
		<div class="code-block"># ${brandName ? `${brandName} ` : ""}Color Palette\n\n${palette.map((c) => `- **${c.role}**: \`${c.hex}\` — ${c.name}`).join("\n")}${
			contrast
				? `\n\n## Contrast\n${Object.entries(contrast)
						.map(([k, v]) => `- ${k}: ${v}`)
						.join("\n")}`
				: ""
		}${css?.variables ? `\n\n## CSS\n\`\`\`css\n${css.variables}\n\`\`\`` : ""}</div>
	</section>

	${renderNftReceipt(nft)}`;

	return pageShell(
		`BrandCanvas #${nft.tokenId}${brandName ? ` — ${brandName}` : ""} — Palette`,
		content,
		`<style>
.palette-hero {
	height: 3px;
	border-radius: 2px;
	margin-bottom: 48px;
	opacity: 0.85;
}
.palette-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.swatch {
	border: 1px solid var(--surface-border);
	border-radius: var(--radius-md);
	overflow: hidden;
	background: var(--surface);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	transition: transform 0.2s cubic-bezier(0.3, 0.9, 0.3, 1);
}
.swatch:hover { transform: translateY(-2px); }
.swatch-color { height: 120px; }
.swatch-info { padding: 14px; display: flex; flex-direction: column; gap: 3px; }
.swatch-name { font-size: 0.85rem; color: var(--text-primary); font-weight: 500; }
.swatch-hex { font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-secondary); }
.swatch-role { font-size: 0.65rem; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-top: 4px; }
.contrast-list { display: flex; flex-direction: column; gap: 0; }
.contrast-row { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
.contrast-row:last-child { border-bottom: none; }
.contrast-label { flex: 1; font-size: 0.82rem; color: var(--text-secondary); }
.contrast-badge {
	font-family: var(--font-mono);
	font-size: 0.65rem;
	font-weight: 600;
	padding: 3px 8px;
	border-radius: 4px;
	margin-right: 12px;
	letter-spacing: 0.04em;
}
.badge-aaa { background: rgba(123, 204, 123, 0.15); color: var(--success); }
.badge-aa { background: rgba(204, 180, 80, 0.15); color: #CCB450; }
.badge-fail { background: rgba(204, 123, 123, 0.15); color: var(--danger); }
.contrast-ratio { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); min-width: 48px; text-align: right; }
</style>`,
	);
}

export function renderFontsDelivery(
	data: Record<string, unknown>,
	nft: NftInfo,
): string {
	const brandName = (data.brandName as string) || "";
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

	const primaryHeading = pairings[0]?.heading.family || "serif";

	const pairingCards = pairings
		.map(
			(p, i) => `
		<div class="glass-card pairing-card">
			<div class="pairing-num">Pairing ${i + 1}</div>
			<div class="specimen-row">
				<div class="specimen-col">
					<span class="specimen-label">Heading</span>
					<span class="specimen-display" style="font-family: '${p.heading.family}', serif">${p.heading.family}</span>
					<span class="specimen-preview" style="font-family: '${p.heading.family}', serif">Aa Bb Cc 123</span>
				</div>
				<div class="specimen-col">
					<span class="specimen-label">Body</span>
					<span class="specimen-display" style="font-family: '${p.body.family}', sans-serif">${p.body.family}</span>
					<span class="specimen-preview" style="font-family: '${p.body.family}', sans-serif">The quick brown fox jumps over the lazy dog</span>
				</div>
			</div>
			${p.rationale ? `<p class="pairing-rationale">${p.rationale}</p>` : ""}
			${p.htmlImport ? `<div class="code-block">${p.htmlImport}</div>` : ""}
		</div>`,
		)
		.join("");

	const scaleSection = typescale
		? `<section>
		<div class="section-header"><h2>Type Scale</h2><span class="section-desc">Consistent sizing hierarchy for headings and body.</span></div>
		<div class="glass-card">${Object.entries(typescale)
			.map(
				([k, v]) =>
					`<div class="scale-row"><span class="scale-label">${k}</span><span class="scale-sample" style="font-size: ${v}">${k}</span><span class="scale-value">${v}</span></div>`,
			)
			.join("")}</div>
	</section>`
		: "";

	const content = `
	<header>
		<span class="brand-mark"><span class="brand-logo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="18" height="20" stroke="white" stroke-width="2.2"/><rect x="9" y="8" width="12" height="14" stroke="white" stroke-width="2.2"/><rect x="14" y="13" width="7" height="9" stroke="white" stroke-width="2.2"/></svg></span>BrandCanvas</span>
		<div class="header-right">
			<span class="token-badge">Delivery #${nft.tokenId}</span>
			<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
				<svg class="moon" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 8.5A6 6 0 017.5 2a6 6 0 106.5 6.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
				<svg class="sun" width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
			</button>
		</div>
	</header>

	<h1>${brandName ? `<em>${brandName}</em> — ` : ""}Font Pairings</h1>
	<p class="subtitle">${recommendation}</p>

	<div class="type-hero" style="font-family: '${primaryHeading}', serif">Aa Bb Cc</div>

	<section class="artwork-section">
		<img src="${nft.imageUrl}" alt="Typography artwork">
	</section>

	${renderDownloadSection(nft.imageUrl, `https://web3.okx.com/explorer/x-layer/evm/assets/${nft.contract.toLowerCase()}/${nft.tokenId}`, nft.tokenId)}

	<section>
		<div class="section-header"><h2>Pairings</h2><span class="section-desc">${pairings.length} combinations tested for readability and harmony.</span></div>
		${pairingCards}
	</section>

	${scaleSection}

	<section>
		<div class="section-header"><h2>Design Spec</h2><span class="section-desc">Copy as design.md into any project.</span></div>
		<div class="code-block"># ${brandName ? `${brandName} ` : ""}Typography\n\n${pairings.map((p, i) => `## Pairing ${i + 1}\n- Heading: **${p.heading.family}**\n- Body: **${p.body.family}**${p.heading.googleFontsUrl ? `\n- Import: ${p.heading.googleFontsUrl}` : ""}`).join("\n\n")}${
			typescale
				? `\n\n## Scale\n${Object.entries(typescale)
						.map(([k, v]) => `- ${k}: ${v}`)
						.join("\n")}`
				: ""
		}</div>
	</section>

	${renderNftReceipt(nft)}`;

	return pageShell(
		`BrandCanvas #${nft.tokenId}${brandName ? ` — ${brandName}` : ""} — Fonts`,
		content,
		`
${fontLinks}
<style>
.type-hero {
	font-size: clamp(3rem, 10vw, 5rem);
	color: var(--text-primary);
	text-align: center;
	margin-bottom: 48px;
	opacity: 0.15;
	letter-spacing: -0.02em;
}
.pairing-card { margin-bottom: 16px; }
.pairing-num {
	font-family: var(--font-mono);
	font-size: 0.65rem;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--text-muted);
	margin-bottom: 20px;
	padding-bottom: 12px;
	border-bottom: 1px solid var(--border);
}
.specimen-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px; }
.specimen-col { display: flex; flex-direction: column; gap: 6px; }
.specimen-label {
	font-family: var(--font-mono);
	font-size: 0.6rem;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--text-muted);
}
.specimen-display { font-size: 1.6rem; color: var(--text-primary); }
.specimen-preview { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }
.pairing-rationale {
	font-family: var(--font-body);
	font-style: normal;
	font-size: 0.85rem;
	color: var(--text-secondary);
	margin-bottom: 16px;
	padding-top: 12px;
	border-top: 1px solid var(--border);
}
.scale-row {
	display: flex;
	align-items: baseline;
	padding: 10px 0;
	border-bottom: 1px solid var(--border);
}
.scale-row:last-child { border-bottom: none; }
.scale-label { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); min-width: 80px; }
.scale-sample { flex: 1; color: var(--text-primary); }
.scale-value { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); }
@media (max-width: 640px) {
	.specimen-row { grid-template-columns: 1fr; }
}
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
				personality?: string | string[];
				voice?: string;
				doSay?: string[];
				dontSay?: string[];
		  }
		| undefined;
	const colorSystem = data.colorSystem as
		| Record<string, string | { hex?: string; name?: string }>
		| undefined;
	const typography = data.typography as
		| {
				headingFont?: string | { family?: string };
				bodyFont?: string | { family?: string };
				scale?: string;
				css?: string;
		  }
		| undefined;
	const usageRules = (data.usageRules as string[]) || [];
	const doNot = (data.doNot as string[]) || [];

	const colorChips = colorSystem
		? Object.entries(colorSystem)
				.map(([role, val]) => {
					const hex = typeof val === "string" ? val : val?.hex || "#888";
					return `<div class="color-chip"><div class="chip-swatch" style="background: ${hex}"></div><span class="chip-label">${role}</span><span class="chip-hex">${hex}</span></div>`;
				})
				.join("")
		: "";

	const personalityPills = voiceAndTone?.personality
		? (Array.isArray(voiceAndTone.personality)
				? voiceAndTone.personality
				: voiceAndTone.personality.split(",").map((s) => s.trim())
			)
				.map((trait) => `<span class="trait-pill">${trait}</span>`)
				.join("")
		: "";

	const voiceSection = voiceAndTone
		? `<section>
		<div class="section-header"><h2>Voice &amp; Tone</h2><span class="section-desc">How the brand sounds in every communication.</span></div>
		<div class="glass-card">
			${personalityPills ? `<div class="traits-row">${personalityPills}</div>` : ""}
			${voiceAndTone.voice ? `<p class="voice-desc">${voiceAndTone.voice}</p>` : ""}
			<div class="do-dont-grid">
				${
					voiceAndTone.doSay?.length
						? `<div class="do-col"><div class="col-header do-header">Do Say</div><ul>${voiceAndTone.doSay.map((s) => `<li>${s}</li>`).join("")}</ul></div>`
						: ""
				}
				${
					voiceAndTone.dontSay?.length
						? `<div class="dont-col"><div class="col-header dont-header">Don't Say</div><ul>${voiceAndTone.dontSay.map((s) => `<li>${s}</li>`).join("")}</ul></div>`
						: ""
				}
			</div>
		</div>
	</section>`
		: "";

	const content = `
	<header>
		<span class="brand-mark"><span class="brand-logo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="18" height="20" stroke="white" stroke-width="2.2"/><rect x="9" y="8" width="12" height="14" stroke="white" stroke-width="2.2"/><rect x="14" y="13" width="7" height="9" stroke="white" stroke-width="2.2"/></svg></span>BrandCanvas</span>
		<div class="header-right">
			<span class="token-badge">Delivery #${nft.tokenId}</span>
			<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
				<svg class="moon" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 8.5A6 6 0 017.5 2a6 6 0 106.5 6.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
				<svg class="sun" width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
			</button>
		</div>
	</header>

	<h1><em>${brandName}</em> — Brand Guidelines</h1>

	<section class="artwork-section">
		<img src="${nft.imageUrl}" alt="Brand guidelines artwork">
	</section>

	${renderDownloadSection(nft.imageUrl, `https://web3.okx.com/explorer/x-layer/evm/assets/${nft.contract.toLowerCase()}/${nft.tokenId}`, nft.tokenId)}

	${
		mission || vision
			? `<section>
		<div class="section-header"><h2>Mission &amp; Vision</h2><span class="section-desc">The brand's purpose and aspiration.</span></div>
		<div class="glass-card">
			${mission ? `<p class="guidelines-text"><strong>Mission</strong> ${mission}</p>` : ""}
			${vision ? `<p class="guidelines-text"><strong>Vision</strong> ${vision}</p>` : ""}
			${positioning ? `<p class="guidelines-text"><strong>Positioning</strong> ${positioning}</p>` : ""}
		</div>
	</section>`
			: ""
	}

	${voiceSection}

	${
		colorChips
			? `<section>
		<div class="section-header"><h2>Color System</h2><span class="section-desc">Core palette for all brand touchpoints.</span></div>
		<div class="chips-row">${colorChips}</div>
	</section>`
			: ""
	}

	${
		typography
			? `<section>
		<div class="section-header"><h2>Typography</h2><span class="section-desc">Fonts and scale for hierarchy and readability.</span></div>
		<div class="glass-card typo-card">
			${typography.headingFont ? `<div class="typo-item"><span class="typo-label">Heading</span><span class="typo-value" style="font-size: 1.4rem">${typeof typography.headingFont === "string" ? typography.headingFont : typography.headingFont?.family || ""}</span></div>` : ""}
			${typography.bodyFont ? `<div class="typo-item"><span class="typo-label">Body</span><span class="typo-value">${typeof typography.bodyFont === "string" ? typography.bodyFont : typography.bodyFont?.family || ""}</span></div>` : ""}
			${typography.scale ? `<div class="typo-item"><span class="typo-label">Scale</span><span class="typo-value">${typography.scale}</span></div>` : ""}
		</div>
		${typography.css ? `<div class="code-block" style="margin-top: 12px">${typography.css}</div>` : ""}
	</section>`
			: ""
	}

	${
		usageRules.length
			? `<section>
		<div class="section-header"><h2>Usage Rules</h2><span class="section-desc">Follow these to maintain brand consistency.</span></div>
		<div class="rules-list">${usageRules.map((r, i) => `<div class="rule-item"><span class="rule-num">${i + 1}</span><span class="rule-text">${r}</span></div>`).join("")}</div>
	</section>`
			: ""
	}

	${
		doNot.length
			? `<section>
		<div class="section-header"><h2>Do Not</h2><span class="section-desc">Avoid these to protect brand integrity.</span></div>
		<div class="rules-list dont">${doNot.map((r) => `<div class="rule-item"><span class="rule-num">✕</span><span class="rule-text">${r}</span></div>`).join("")}</div>
	</section>`
			: ""
	}

	<section>
		<div class="section-header"><h2>Design Spec</h2><span class="section-desc">Copy as design.md into any project.</span></div>
		<div class="code-block"># ${brandName} — Brand Guidelines\n${mission ? `\n**Mission:** ${mission}` : ""}${vision ? `\n**Vision:** ${vision}` : ""}${voiceAndTone?.personality ? `\n\n## Voice\n${Array.isArray(voiceAndTone.personality) ? voiceAndTone.personality.join(", ") : voiceAndTone.personality}` : ""}${
			colorSystem
				? `\n\n## Colors\n${Object.entries(colorSystem)
						.map(
							([role, val]) =>
								`- ${role}: \`${typeof val === "string" ? val : val?.hex || ""}\``,
						)
						.join("\n")}`
				: ""
		}${typography?.headingFont ? `\n\n## Type\n- Heading: **${typeof typography.headingFont === "string" ? typography.headingFont : typography.headingFont?.family || ""}**\n- Body: **${typeof typography.bodyFont === "string" ? typography.bodyFont : (typography.bodyFont as { family?: string })?.family || ""}**` : ""}</div>
	</section>

	${renderNftReceipt(nft)}`;

	return pageShell(
		`BrandCanvas #${nft.tokenId} — ${brandName} Guidelines`,
		content,
		`<style>
.guidelines-text { font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.7; }
.guidelines-text:last-child { margin-bottom: 0; }
.guidelines-text strong {
	display: block;
	font-family: var(--font-mono);
	font-size: 0.65rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--text-muted);
	margin-bottom: 4px;
}
.traits-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.trait-pill {
	font-family: var(--font-mono);
	font-size: 0.72rem;
	padding: 5px 12px;
	border-radius: 100px;
	background: var(--accent-soft);
	color: var(--accent);
	border: 1px solid rgba(74, 111, 165, 0.2);
}
.voice-desc {
	font-family: var(--font-display);
	font-style: italic;
	font-size: 0.95rem;
	color: var(--text-secondary);
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 1px solid var(--border);
}
.do-dont-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.do-col, .dont-col { display: flex; flex-direction: column; }
.col-header {
	font-family: var(--font-mono);
	font-size: 0.65rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	margin-bottom: 10px;
	padding-left: 12px;
}
.do-header { color: var(--success); border-left: 2px solid var(--success); }
.dont-header { color: var(--danger); border-left: 2px solid var(--danger); }
.do-col ul, .dont-col ul { list-style: none; }
.do-col li, .dont-col li {
	font-size: 0.82rem;
	color: var(--text-secondary);
	padding: 5px 0 5px 12px;
	border-left: 2px solid var(--border);
}
.do-col li { border-left-color: rgba(123, 204, 123, 0.3); }
.dont-col li { border-left-color: rgba(204, 123, 123, 0.3); }
.chips-row { display: flex; flex-wrap: wrap; gap: 16px; }
.color-chip { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.chip-swatch { width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--surface-border); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.chip-label { font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
.chip-hex { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); }
.typo-card { display: flex; flex-direction: column; gap: 16px; }
.typo-item { display: flex; flex-direction: column; gap: 4px; }
.typo-label { font-family: var(--font-mono); font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); }
.typo-value { font-size: 1rem; color: var(--text-primary); }
.rules-list {
	border-left: 2px solid var(--accent);
	padding-left: 0;
}
.rules-list.dont { border-left-color: var(--danger); }
.rule-item { display: flex; align-items: baseline; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--border); }
.rule-item:last-child { border-bottom: none; }
.rule-num { font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); min-width: 20px; }
.rules-list.dont .rule-num { color: var(--danger); }
.rule-text { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
@media (max-width: 640px) {
	.do-dont-grid { grid-template-columns: 1fr; }
	.chips-row { justify-content: center; }
}
</style>`,
	);
}

export function renderFallbackDelivery(
	tokenId: number,
	kitType: string,
	imageUrl: string,
	owner: string,
): string {
	const NFT_CONTRACT = "0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B";
	const nftInfo: NftInfo = {
		tokenId,
		chain: "X Layer (eip155:196)",
		owner,
		txHash: "",
		explorerUrl: `https://www.okx.com/explorer/xlayer/address/${NFT_CONTRACT}`,
		imageUrl,
		contract: NFT_CONTRACT,
	};

	const content = `
	<header>
		<span class="brand-mark"><span class="brand-logo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="18" height="20" stroke="white" stroke-width="2.2"/><rect x="9" y="8" width="12" height="14" stroke="white" stroke-width="2.2"/><rect x="14" y="13" width="7" height="9" stroke="white" stroke-width="2.2"/></svg></span>BrandCanvas</span>
		<div class="header-right">
			<span class="token-badge">Delivery #${tokenId}</span>
			<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
				<svg class="moon" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 8.5A6 6 0 017.5 2a6 6 0 106.5 6.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
				<svg class="sun" width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
			</button>
		</div>
	</header>

	<h1>${kitType.charAt(0).toUpperCase() + kitType.slice(1)} <em>Kit</em></h1>
	<p class="subtitle">Brand asset with on-chain IP provenance</p>

	<section class="artwork-section">
		<img src="${imageUrl}" alt="Brand artwork">
	</section>

	${renderDownloadSection(imageUrl)}

	${renderNftReceipt(nftInfo)}`;

	return pageShell(`BrandCanvas #${tokenId}`, content);
}
