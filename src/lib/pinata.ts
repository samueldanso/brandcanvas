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
		const file = new File([svg], `${name}.svg`, { type: "image/svg+xml" });
		const result = await pinata.upload.public.file(file);
		const gateway = process.env.PINATA_GATEWAY;
		return {
			cid: result.cid,
			gatewayUrl: `https://${gateway}/ipfs/${result.cid}`,
		};
	} catch (error) {
		console.error("[pinata] SVG pin failed:", error instanceof Error ? error.message : error);
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
