"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Endpoint {
  id: string;
  label: string;
  price: string;
  description: string;
  output: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: "colors",
    label: "/brand/colors",
    price: "$0.10",
    description: "URL → color system extracted from computed CSS",
    output: `{
  "url": "https://stripe.com",
  "brandName": "Stripe",
  "colors": {
    "primary": "#635BFF",
    "secondary": "#0A2540",
    "accent": "#00D4FF",
    "neutral": "#425466",
    "background": "#F6F9FC",
    "text": "#0A2540"
  },
  "palette": [
    { "hex": "#635BFF", "usage": "CTAs, links, brand identity" },
    { "hex": "#0A2540", "usage": "Headings, dark surfaces" },
    { "hex": "#00D4FF", "usage": "Highlights, gradients" }
  ]
}`,
  },
  {
    id: "typography",
    label: "/brand/typography",
    price: "$0.10",
    description: "URL → font families, weights, and size scale from computed styles",
    output: `{
  "url": "https://linear.app",
  "brandName": "Linear",
  "fonts": ["Inter", "SF Mono"],
  "typography": {
    "fontFamilies": { "heading": "Inter", "primary": "Inter" },
    "fontSizes": { "h1": "48px", "h2": "32px", "body": "16px" },
    "fontStacks": {
      "heading": ["Inter", "-apple-system", "sans-serif"],
      "body": ["Inter", "-apple-system", "sans-serif"]
    }
  }
}`,
  },
  {
    id: "palette",
    label: "/palette/generate",
    price: "$0.10",
    description: "Mood + industry → 5-color palette with WCAG contrast + NFT",
    output: `{
  "palette": [
    { "hex": "#2D5A4F", "name": "Sage Green",
      "role": "primary", "onWhite": "AAA" },
    { "hex": "#8B9D94", "name": "Stone Taupe",
      "role": "secondary", "onWhite": "AAA" },
    { "hex": "#D4A574", "name": "Warm Clay",
      "role": "accent", "onBlack": "AAA" },
    { "hex": "#6B7370", "name": "Graphite",
      "role": "neutral", "onWhite": "AAA" },
    { "hex": "#F9F7F4", "name": "Cream",
      "role": "background", "onBlack": "AAA" }
  ],
  "css": {
    "variables": ":root { --primary: #2D5A4F; ... }",
    "tailwind": "{ primary: '#2D5A4F', ... }"
  },
  "nft": { "chain": "X Layer", "status": "minting" }
}`,
  },
  {
    id: "fonts",
    label: "/fonts/pair",
    price: "$0.10",
    description: "Style + mood → 3 font pairings with Google Fonts CDN + NFT",
    output: `{
  "pairings": [
    {
      "heading": { "family": "Inter", "weights": ["600", "700"] },
      "body": { "family": "Inter", "weights": ["400", "500"] },
      "rationale": "Single-family monoline system.
Weight differentiation provides hierarchy.",
      "htmlImport": "<link href='...Inter...' rel='stylesheet'>"
    }
  ],
  "recommendation": "Use Inter only — single-family
systems scale best in production.",
  "nft": { "chain": "X Layer", "status": "minting" }
}`,
  },
  {
    id: "guidelines",
    label: "/brand/guidelines",
    price: "$0.15",
    description: "Brand name + values → structured guidelines + NFT",
    output: `{
  "brandName": "Acme",
  "mission": "Simplify complex workflows for modern teams.",
  "positioning": "For teams who ship fast, Acme is the
workspace that removes friction.",
  "voiceAndTone": {
    "personality": ["direct", "warm", "confident"],
    "doSay": ["Ship it.", "Here's what changed."],
    "dontSay": ["Please don't hesitate to...", "Oops!"]
  },
  "colorSystem": {
    "primary": { "hex": "#1A1A2E", "usage": "Headers, CTAs" },
    "accent": { "hex": "#E94560", "usage": "Highlights" }
  },
  "nft": { "chain": "X Layer", "status": "minting" }
}`,
  },
  {
    id: "extract",
    label: "/brand/extract",
    price: "$0.50",
    description: "URL → complete brand kit via headless Chromium",
    output: `{
  "url": "https://vercel.com",
  "brandName": "Vercel",
  "colors": { "primary": "#000000", "accent": "#0070F3" },
  "fonts": ["Inter", "Geist Mono"],
  "typography": { "headingFont": "Inter", "bodyFont": "Inter" },
  "assets": {
    "logo": { "url": "https://vercel.com/logo.svg",
              "format": "svg", "score": 0.95 },
    "favicon": "https://vercel.com/favicon.ico"
  },
  "spacing": { "base": "16px", "scale": "1.25" }
}`,
  },
  {
    id: "assets",
    label: "/brand/assets",
    price: "$0.10",
    description: "URL → logo, favicon, OG image — scored and ranked",
    output: `{
  "url": "https://github.com",
  "brandName": "GitHub",
  "assets": [
    { "type": "logo", "url": "https://github.githubassets.com/...",
      "format": "svg", "score": 0.92 },
    { "type": "favicon",
      "url": "https://github.com/favicon.ico",
      "format": "ico", "score": 0.88 },
    { "type": "og_image",
      "url": "https://github.githubassets.com/images/...",
      "format": "png", "score": 0.85 }
  ]
}`,
  },
];

export function EndpointFrame() {
  const [activeId, setActiveId] = useState(ENDPOINTS[0].id);
  const [copied, setCopied] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const active = ENDPOINTS.find((e) => e.id === activeId)!;

  useEffect(() => {
    const tabs = tabsRef.current;
    const pill = pillRef.current;
    if (!tabs || !pill) return;

    const idx = ENDPOINTS.findIndex((e) => e.id === activeId);
    const tabEls = tabs.querySelectorAll<HTMLButtonElement>("[role=tab]");
    const tab = tabEls[idx];
    if (!tab) return;

    Object.assign(pill.style, {
      left: tab.offsetLeft + "px",
      top: tab.offsetTop + "px",
      width: tab.offsetWidth + "px",
      height: tab.offsetHeight + "px",
    });
  }, [activeId]);

  useEffect(() => {
    const tabs = tabsRef.current;
    const pill = pillRef.current;
    if (!tabs || !pill) return;

    const tabEls = tabs.querySelectorAll<HTMLButtonElement>("[role=tab]");
    const first = tabEls[0];
    if (!first) return;

    pill.style.transition = "none";
    Object.assign(pill.style, {
      left: first.offsetLeft + "px",
      top: first.offsetTop + "px",
      width: first.offsetWidth + "px",
      height: first.offsetHeight + "px",
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (pillRef.current) {
          pillRef.current.style.transition = "";
        }
      });
    });
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(active.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div className="frame">
      <div
        className="frame-tabs"
        ref={tabsRef}
        role="tablist"
        aria-label="Endpoint"
      >
        <span className="tab-pill" ref={pillRef} aria-hidden="true" />

        {ENDPOINTS.map((ep) => (
          <button
            key={ep.id}
            className={`frame-tab${ep.id === activeId ? " active" : ""}`}
            role="tab"
            aria-selected={ep.id === activeId}
            onClick={() => setActiveId(ep.id)}
          >
            <span className="tab-price">{ep.price}</span>
            {ep.label}
          </button>
        ))}
      </div>

      <div className="frame-panel" role="tabpanel">
        <div className="panel-meta">
          <span className="meta-method">POST</span>
          <span className="meta-desc">{active.description}</span>
        </div>

        <div className="panel-output">
          <button
            className="copy-btn"
            onClick={handleCopy}
            title={copied ? "Copied" : "Copy response"}
            aria-label={copied ? "Copied" : "Copy sample response"}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <pre>
            <code>{active.output}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
