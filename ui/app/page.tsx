import { EndpointFrame } from "@/components/endpoint-frame";
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
            Create brand identities.
            <br />
            <em>Own them on-chain.</em>
          </h1>

          <p className="sub">
            Extract colors, fonts, and assets from any live URL — or generate
            palettes, pairings, and guidelines from scratch. Every asset mints
            an NFT to your wallet on X Layer.
          </p>

          <EndpointFrame />
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
        <span>·</span>
        <span>Brand Identity</span>
      </footer>
    </div>
  );
}
