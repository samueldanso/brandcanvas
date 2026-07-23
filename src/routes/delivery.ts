import type { Context } from "hono";
import {
	type NftInfo,
	renderFallbackDelivery,
	renderFontsDelivery,
	renderGuidelinesDelivery,
	renderPaletteDelivery,
} from "../lib/delivery-templates";
import { getDeliveryMeta } from "../lib/metadata-registry";
import { findPinByName } from "../lib/pinata";

export async function handleDelivery(c: Context) {
	const tokenId = Number(c.req.param("tokenId"));
	if (!tokenId || Number.isNaN(tokenId)) {
		return c.json({ error: "Invalid tokenId" }, 400);
	}

	const { createPublicClient, http, parseAbi } = await import("viem");

	const xlayer = {
		id: 196,
		name: "X Layer",
		nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
		rpcUrls: { default: { http: ["https://rpc.xlayer.tech"] } },
	} as const;

	const NFT_CONTRACT =
		"0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B" as `0x${string}`;

	const abi = parseAbi([
		"function getBrandKit(uint256 tokenId) view returns ((bytes32 contentHash, string kitType, string imageUri, uint256 timestamp))",
		"function ownerOf(uint256 tokenId) view returns (address)",
	]);

	try {
		const client = createPublicClient({
			chain: xlayer,
			transport: http("https://rpc.xlayer.tech"),
		});

		const [kitRaw, owner] = await Promise.all([
			client.readContract({
				address: NFT_CONTRACT,
				abi,
				functionName: "getBrandKit",
				args: [BigInt(tokenId)],
			}),
			client.readContract({
				address: NFT_CONTRACT,
				abi,
				functionName: "ownerOf",
				args: [BigInt(tokenId)],
			}),
		]);

		const kit = kitRaw as unknown as {
			contentHash: string;
			kitType: string;
			imageUri: string;
			timestamp: bigint;
		};
		const kitType = kit.kitType;
		const imageUri = kit.imageUri;

		const meta = getDeliveryMeta(tokenId);

		let imageUrl = "";
		if (meta?.imageUrl) {
			imageUrl = meta.imageUrl;
		} else if (imageUri.startsWith("https://")) {
			imageUrl = imageUri;
		} else if (imageUri.startsWith("ipfs://")) {
			const cid = imageUri.replace("ipfs://", "");
			const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";
			imageUrl = `https://${gateway}/ipfs/${cid}`;
		} else {
			imageUrl = `https://brandcanvas.onrender.com/assets/${tokenId}/image`;
		}

		let metadataUrl = meta?.metadataUrl || null;
		if (!metadataUrl) {
			metadataUrl = await findPinByName(`brandcanvas-${tokenId}`);
		}

		if (!metadataUrl) {
			const html = renderFallbackDelivery(
				tokenId,
				kitType,
				imageUrl,
				owner as string,
			);
			return c.html(html);
		}

		let data: Record<string, unknown> = {};
		try {
			const res = await fetch(metadataUrl, {
				signal: AbortSignal.timeout(5000),
			});
			if (res.ok) {
				data = (await res.json()) as Record<string, unknown>;
			}
		} catch {
			const html = renderFallbackDelivery(
				tokenId,
				kitType,
				imageUrl,
				owner as string,
			);
			return c.html(html);
		}

		const txHash = meta?.txHash || (data._txHash as string) || "";
		const nftInfo: NftInfo = {
			tokenId,
			chain: "X Layer (eip155:196)",
			owner: owner as string,
			txHash,
			explorerUrl: txHash
				? `https://www.okx.com/explorer/xlayer/tx/${txHash}`
				: `https://www.okx.com/explorer/xlayer/address/${NFT_CONTRACT}`,
			imageUrl,
			contract: NFT_CONTRACT,
		};

		let html: string;
		switch (kitType) {
			case "palette":
				html = renderPaletteDelivery(data, nftInfo);
				break;
			case "fonts":
				html = renderFontsDelivery(data, nftInfo);
				break;
			case "guidelines":
				html = renderGuidelinesDelivery(data, nftInfo);
				break;
			default:
				html = renderFallbackDelivery(
					tokenId,
					kitType,
					imageUrl,
					owner as string,
				);
		}

		return c.html(html);
	} catch (err) {
		console.error("[delivery] Error:", err);
		return c.json({ error: "Token not found" }, 404);
	}
}
