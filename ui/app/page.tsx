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
            guidelines — permanently hosted on IPFS and minted as NFTs on X
            Layer. You pay, you own the art. Every call settles in USDT via x402.
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
