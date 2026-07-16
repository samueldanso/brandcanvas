"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AGENTS = [
  { id: "codex", label: "Codex" },
  { id: "opencode", label: "OpenCode" },
  { id: "pi", label: "Pi" },
  { id: "claude", label: "Claude" },
  { id: "amp", label: "Amp" },
];

const ICONS: Record<string, string> = {
  claude: `<svg width="13" height="13" preserveAspectRatio="xMidYMid" viewBox="0 0 256 257"><path fill="#D97757" d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"/></svg>`,
  codex: `<svg width="13" height="13" fill="currentColor" fill-rule="evenodd" viewBox="0 0 24 24"><path clip-rule="evenodd" d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"/></svg>`,
  pi: `<svg width="13" height="13" viewBox="0 0 800 800"><path fill="currentColor" fill-rule="evenodd" d="M165.29 165.29 H517.36 V400 H400 V517.36 H282.65 V634.72 H165.29 Z M282.65 282.65 V400 H400 V282.65 Z"/><path fill="currentColor" d="M517.36 400 H634.72 V634.72 H517.36 Z"/></svg>`,
  opencode: `<svg width="13" height="13" viewBox="0 0 512 512" fill="none"><rect width="512" height="512" rx="64" fill="#131010"/><path d="M320 224V352H192V224H320Z" fill="#5A5858"/><path fill-rule="evenodd" clip-rule="evenodd" d="M384 416H128V96H384V416ZM320 160H192V352H320V160Z" fill="white"/></svg>`,
  amp: `<svg width="25" height="13" viewBox="0 0 281 144" fill="none"><path fill="currentColor" d="M236.014 20C260.431 20.0001 280.602 37.4115 280.603 64.7432C280.602 93.5337 260.065 114.166 233.52 114.166C224.158 114.166 215.639 112.422 208.63 108.49C202.886 105.27 198.203 100.605 194.919 94.3379L188.115 141.822L187.946 143.016H174.214L174.448 141.423L191.772 22.4941H205.372L203.937 31.3369C212.143 23.8608 223.2 20.0002 236.014 20ZM47.082 20.1543C56.4435 20.1543 65.0012 21.8991 72.0488 25.8486C77.8222 29.0831 82.5323 33.7713 85.8271 40.085L88.1201 23.6924L88.2861 22.4932H101.863L89.1611 110.633L88.9873 111.826H75.4092L76.7227 102.855C68.5854 110.456 57.3981 114.323 44.5889 114.323C20.1709 114.323 0.000167223 96.9087 0 69.5771C0.000149745 40.7854 20.54 20.1549 47.082 20.1543ZM116.234 110.636L116.061 111.827H102.485L115.351 23.6855L115.521 22.4941H129.083L116.234 110.636ZM140.673 110.636L140.499 111.827H126.924L139.789 23.6855L139.96 22.4941H153.521L140.673 110.636ZM177.958 22.4941L165.108 110.636L164.935 111.827H151.36L164.225 23.6855L164.396 22.4941H177.958ZM48.4854 31.9844C27.8638 31.985 14.0133 48.3799 14.0127 68.9521C14.0127 77.7907 16.8094 86.1771 22.3145 92.334C27.7973 98.4657 36.0631 102.493 47.2402 102.493C67.8534 102.493 81.7122 85.9487 81.7129 65.3682C81.7129 55.4076 78.2493 47.0792 72.4131 41.2441C66.5794 35.4088 58.2871 31.9844 48.4854 31.9844ZM233.362 31.8291C212.749 31.8297 198.89 48.3716 198.89 68.9521C198.89 78.9123 202.356 87.2403 208.189 93.0742C214.023 98.9107 222.315 102.336 232.116 102.336C252.738 102.335 266.589 85.9407 266.59 65.3682C266.59 56.5296 263.795 48.1424 258.29 41.9863C252.807 35.8551 244.542 31.8291 233.362 31.8291Z"/></svg>`,
};

const SERVICES = [
  {
    id: "palette",
    label: "Palette Generate",
    endpoint: "https://brandcanvas.onrender.com/palette/generate",
  },
  {
    id: "fonts",
    label: "Font Pairing",
    endpoint: "https://brandcanvas.onrender.com/fonts/pair",
  },
  {
    id: "guidelines",
    label: "Brand Guidelines",
    endpoint: "https://brandcanvas.onrender.com/brand/guidelines",
  },
  {
    id: "extract",
    label: "Brand Study",
    endpoint: "https://brandcanvas.onrender.com/brand/extract",
  },
  {
    id: "colors",
    label: "Color System",
    endpoint: "https://brandcanvas.onrender.com/brand/colors",
  },
  {
    id: "typography",
    label: "Typography Stack",
    endpoint: "https://brandcanvas.onrender.com/brand/typography",
  },
  {
    id: "assets",
    label: "Brand Assets",
    endpoint: "https://brandcanvas.onrender.com/brand/assets",
  },
];

function getPrompt(service: (typeof SERVICES)[number]) {
  return `I'd like to use the service provided by Agent 5331:

Service title: ${service.label}
Service type: A2MCP
Endpoint: ${service.endpoint}
Please use OKX Agent Payments Protocol to send a request to this endpoint`;
}

export function AgentFrame() {
  const [activeAgent, setActiveAgent] = useState(AGENTS[0].id);
  const [activeService, setActiveService] = useState(SERVICES[0].id);
  const [copied, setCopied] = useState(false);
  const agentTabsRef = useRef<HTMLDivElement>(null);
  const agentPillRef = useRef<HTMLSpanElement>(null);
  const serviceTabsRef = useRef<HTMLDivElement>(null);
  const servicePillRef = useRef<HTMLSpanElement>(null);

  const service = SERVICES.find((s) => s.id === activeService)!;

  function movePill(
    tabsEl: HTMLDivElement | null,
    pillEl: HTMLSpanElement | null,
    selector: string,
  ) {
    if (!tabsEl || !pillEl) return;
    const active = tabsEl.querySelector<HTMLButtonElement>(selector);
    if (!active) return;
    pillEl.style.width = `${active.offsetWidth}px`;
    pillEl.style.height = `${active.offsetHeight}px`;
    pillEl.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
  }

  useEffect(() => {
    const pill = agentPillRef.current;
    if (pill) pill.style.transition = "none";
    requestAnimationFrame(() => {
      movePill(
        agentTabsRef.current,
        agentPillRef.current,
        "[role=tab].active",
      );
      requestAnimationFrame(() => {
        if (agentPillRef.current) agentPillRef.current.style.transition = "";
      });
    });
  }, []);

  useEffect(() => {
    movePill(
      agentTabsRef.current,
      agentPillRef.current,
      "[role=tab].active",
    );
  }, [activeAgent]);

  useEffect(() => {
    const pill = servicePillRef.current;
    if (pill) pill.style.transition = "none";
    requestAnimationFrame(() => {
      movePill(
        serviceTabsRef.current,
        servicePillRef.current,
        "[role=tab].active",
      );
      requestAnimationFrame(() => {
        if (servicePillRef.current)
          servicePillRef.current.style.transition = "";
      });
    });
  }, []);

  useEffect(() => {
    movePill(
      serviceTabsRef.current,
      servicePillRef.current,
      "[role=tab].active",
    );
  }, [activeService]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getPrompt(service));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div className="agent-frame">
      <div
        className="agent-tabs"
        ref={agentTabsRef}
        role="tablist"
        aria-label="Harness"
      >
        <span className="agent-pill" ref={agentPillRef} aria-hidden="true" />
        {AGENTS.map((a) => (
          <button
            key={a.id}
            className={`agent-tab${a.id === activeAgent ? " active" : ""}`}
            role="tab"
            aria-selected={a.id === activeAgent}
            onClick={() => setActiveAgent(a.id)}
          >
            <span
              className="agent-icon"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static SVG icons
              dangerouslySetInnerHTML={{ __html: ICONS[a.id] }}
            />
            {a.label}
          </button>
        ))}
      </div>

      <div
        className="service-tabs"
        ref={serviceTabsRef}
        role="tablist"
        aria-label="Service"
      >
        <span
          className="service-pill"
          ref={servicePillRef}
          aria-hidden="true"
        />
        {SERVICES.map((s) => (
          <button
            key={s.id}
            className={`service-tab${s.id === activeService ? " active" : ""}`}
            role="tab"
            aria-selected={s.id === activeService}
            onClick={() => setActiveService(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="agent-body" role="tabpanel">
        <pre>
          <code>{getPrompt(service)}</code>
        </pre>
        <button
          className="copy-btn"
          onClick={handleCopy}
          title={copied ? "Copied" : "Copy prompt"}
          aria-label={copied ? "Copied" : "Copy service prompt"}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}
