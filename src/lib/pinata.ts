import { Resvg } from "@resvg/resvg-js";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT || "",
	pinataGateway: process.env.PINATA_GATEWAY || "",
});

export interface PinResult {
	cid: string;
	gatewayUrl: string;
}

export async function pinSVG(
	svg: string,
	name: string,
): Promise<PinResult | null> {
	if (!process.env.PINATA_JWT) {
		console.warn("[pinata] PINATA_JWT not set — skipping pin");
		return null;
	}

	try {
		const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 500 } });
		const pngBuffer = resvg.render().asPng();
		const file = new File([new Uint8Array(pngBuffer)], `${name}.png`, { type: "image/png" });
		const result = await pinata.upload.public.file(file);
		const gateway = process.env.PINATA_GATEWAY;
		return {
			cid: result.cid,
			gatewayUrl: `https://${gateway}/ipfs/${result.cid}`,
		};
	} catch (error) {
		console.error("[pinata] PNG pin failed:", error instanceof Error ? error.message : error);
		return null;
	}
}

export async function pinMetadata(
	metadata: object,
	name: string,
): Promise<PinResult | null> {
	if (!process.env.PINATA_JWT) {
		console.warn("[pinata] PINATA_JWT not set — skipping pin");
		return null;
	}

	try {
		const file = new File(
			[JSON.stringify(metadata)],
			`${name}.json`,
			{ type: "application/json" },
		);
		const result = await pinata.upload.public.file(file);
		const gateway = process.env.PINATA_GATEWAY;
		return {
			cid: result.cid,
			gatewayUrl: `https://${gateway}/ipfs/${result.cid}`,
		};
	} catch (error) {
		console.error("[pinata] metadata pin failed:", error instanceof Error ? error.message : error);
		return null;
	}
}
