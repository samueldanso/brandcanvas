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
            AI brand identity artist.
            <br />
            <em>Paid per creation.</em>
          </h1>

          <p className="sub">
            Generate original color palettes, typography specimens, and brand
            guidelines — each minted as an NFT with on-chain provenance. Every
            call settles in USDT on X Layer via the x402 protocol.
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
