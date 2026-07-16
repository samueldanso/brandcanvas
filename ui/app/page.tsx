import { AgentFrame } from "@/components/agent-frame";
import Image from "next/image";

export default function Home() {
  return (
    <div className="page">
      <main>
        <section className="hero">
          <div className="logo-wrap">
            <Image
              src="/logo.jpg"
              alt="BrandCanvas"
              width={42}
              height={42}
              className="logo-img"
              priority
            />
            <span className="logo-name">BrandCanvas</span>
          </div>

          <h1>
            Brand kits from any URL.
            <br />
            <em>Paid per call.</em>
          </h1>

          <p className="sub">
            Extract colors, typography, and assets from live sites — or generate
            palettes, pairings, and guidelines from scratch. Every call settles
            in USDT on X Layer via the x402 protocol.
          </p>

          <AgentFrame />
        </section>
      </main>

      <footer>
        <span>BrandCanvas</span>
        <span>·</span>
        <a
          href="https://www.okx.ai/agents/5331"
          target="_blank"
          rel="noopener noreferrer"
        >
          Available on OKX.AI
        </a>
      </footer>
    </div>
  );
}
