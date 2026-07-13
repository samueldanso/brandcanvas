import type { Context } from "hono";

/**
 * Serve generated SVG art by token ID.
 * Agents can reference this URL directly: GET /assets/{tokenId}.svg
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
		"function tokenURI(uint256 tokenId) view returns (string)",
	]);

	try {
		const client = createPublicClient({
			chain: xlayer,
			transport: http("https://rpc.xlayer.tech"),
		});

		const tokenURI = (await client.readContract({
			address: NFT_CONTRACT,
			abi,
			functionName: "tokenURI",
			args: [BigInt(tokenId)],
		})) as string;

		// Decode base64 JSON from tokenURI
		const jsonBase64 = tokenURI.replace(
			"data:application/json;base64,",
			"",
		);
		const metadata = JSON.parse(Buffer.from(jsonBase64, "base64").toString());
		const imageUri = metadata.image;

		if (!imageUri || !imageUri.startsWith("data:image/svg+xml;base64,")) {
			return c.json({ error: "No SVG image for this token" }, 404);
		}

		// Decode the SVG
		const svgBase64 = imageUri.replace("data:image/svg+xml;base64,", "");
		const svg = Buffer.from(svgBase64, "base64").toString();

		return c.body(svg, 200, {
			"Content-Type": "image/svg+xml",
			"Cache-Control": "public, max-age=31536000, immutable",
		});
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

		const [tokenURI, owner] = await Promise.all([
			client.readContract({
				address: NFT_CONTRACT,
				abi,
				functionName: "tokenURI",
				args: [BigInt(tokenId)],
			}) as Promise<string>,
			client.readContract({
				address: NFT_CONTRACT,
				abi,
				functionName: "ownerOf",
				args: [BigInt(tokenId)],
			}) as Promise<string>,
		]);

		const jsonBase64 = tokenURI.replace(
			"data:application/json;base64,",
			"",
		);
		const metadata = JSON.parse(Buffer.from(jsonBase64, "base64").toString());

		return c.json({
			...metadata,
			tokenId: Number(tokenId),
			owner,
			contract: NFT_CONTRACT,
			chain: "X Layer (eip155:196)",
			svgUrl: `https://brandcanvas.onrender.com/assets/${tokenId}.svg`,
		});
	} catch {
		return c.json({ error: "Token not found" }, 404);
	}
}
