import type { Context } from "hono";

/**
 * Serve generated art by token ID.
 * For SVG data URI tokens: decodes and returns SVG directly.
 * For IPFS/HTTP tokens: redirects to the image URL.
 */
export async function handleAssetSVG(c: Context) {
	const tokenId = c.req.param("tokenId");
	if (!tokenId) return c.json({ error: "Missing tokenId" }, 400);

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
	]);

	try {
		const client = createPublicClient({
			chain: xlayer,
			transport: http("https://rpc.xlayer.tech"),
		});

		const kit = (await client.readContract({
			address: NFT_CONTRACT,
			abi,
			functionName: "getBrandKit",
			args: [BigInt(tokenId)],
		})) as unknown as [string, string, string, bigint];

		const imageUri = kit[2];

		if (!imageUri) {
			return c.json({ error: "No image for this token" }, 404);
		}

		if (imageUri.startsWith("data:image/svg+xml;base64,")) {
			const svgBase64 = imageUri.replace("data:image/svg+xml;base64,", "");
			const svg = Buffer.from(svgBase64, "base64").toString();
			return c.body(svg, 200, {
				"Content-Type": "image/svg+xml",
				"Cache-Control": "public, max-age=31536000, immutable",
			});
		}

		if (imageUri.startsWith("https://")) {
			return c.redirect(imageUri, 302);
		}

		if (imageUri.startsWith("ipfs://")) {
			const cid = imageUri.replace("ipfs://", "");
			const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";
			return c.redirect(`https://${gateway}/ipfs/${cid}`, 302);
		}

		return c.json({ error: "Unsupported image format" }, 404);
	} catch {
		return c.json({ error: "Token not found" }, 404);
	}
}

/**
 * Serve token metadata as JSON.
 * GET /assets/{tokenId}.json
 */
export async function handleAssetMetadata(c: Context) {
	const tokenId = c.req.param("tokenId");
	if (!tokenId) return c.json({ error: "Missing tokenId" }, 400);

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
		"function tokenURI(uint256 tokenId) view returns (string)",
		"function getBrandKit(uint256 tokenId) view returns ((bytes32 contentHash, string kitType, string imageUri, uint256 timestamp))",
		"function ownerOf(uint256 tokenId) view returns (address)",
	]);

	try {
		const client = createPublicClient({
			chain: xlayer,
			transport: http("https://rpc.xlayer.tech"),
		});

		const owner = (await client.readContract({
			address: NFT_CONTRACT,
			abi,
			functionName: "ownerOf",
			args: [BigInt(tokenId)],
		})) as string;

		let metadata: Record<string, unknown>;

		try {
			const tokenURIResult = (await client.readContract({
				address: NFT_CONTRACT,
				abi,
				functionName: "tokenURI",
				args: [BigInt(tokenId)],
			})) as string;

			const jsonBase64 = tokenURIResult.replace(
				"data:application/json;base64,",
				"",
			);
			metadata = JSON.parse(Buffer.from(jsonBase64, "base64").toString());
		} catch {
			const kit = (await client.readContract({
				address: NFT_CONTRACT,
				abi,
				functionName: "getBrandKit",
				args: [BigInt(tokenId)],
			})) as unknown as [string, string, string, bigint];

			metadata = {
				name: `BrandCanvas #${tokenId} - ${kit[1]}`,
				description:
					"AI-generated brand asset with on-chain IP provenance. Created by BrandCanvas on X Layer.",
				image: kit[2],
				attributes: [
					{ trait_type: "Kit Type", value: kit[1] },
					{ trait_type: "Content Hash", value: kit[0] },
					{
						trait_type: "Created",
						display_type: "date",
						value: Number(kit[3]),
					},
				],
				external_url: "https://brandcanvas.onrender.com",
			};
		}

		return c.json({
			...metadata,
			tokenId: Number(tokenId),
			owner,
			contract: NFT_CONTRACT,
			chain: "X Layer (eip155:196)",
			imageUrl: `https://brandcanvas.onrender.com/assets/${tokenId}/image`,
		});
	} catch {
		return c.json({ error: "Token not found" }, 404);
	}
}
