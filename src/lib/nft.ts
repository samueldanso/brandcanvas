import {
	createPublicClient,
	createWalletClient,
	defineChain,
	http,
	keccak256,
	parseAbi,
	toHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const xlayer = defineChain({
	id: 196,
	name: "X Layer",
	nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
	rpcUrls: {
		default: { http: ["https://rpc.xlayer.tech"] },
	},
	blockExplorers: {
		default: {
			name: "OKX Explorer",
			url: "https://www.okx.com/explorer/xlayer",
		},
	},
});

const NFT_ABI = parseAbi([
	"function mint(address to, bytes32 contentHash, string calldata kitType, string calldata imageUri) external returns (uint256)",
	"function totalSupply() external view returns (uint256)",
]);

const NFT_CONTRACT =
	"0xF83957F96ca9b4c6B1c36EC43a748f9924eA8c7B" as `0x${string}`;

export interface MintResult {
	tokenId: number;
	contract: string;
	owner: string;
	contentHash: string;
	txHash: string;
	chain: string;
	explorerUrl: string;
	imageUrl: string;
	metadataUrl: string;
}

/**
 * Mint a BrandCanvas IP NFT to the payer's wallet on X Layer.
 * Pins SVG to IPFS via Pinata, then mints with IPFS image URI.
 * Non-fatal: returns null if minting is unavailable or fails.
 */
export async function mintBrandKitNFT(
	output: object,
	kitType: string,
	payerAddress: string,
	imageUri: string,
	ipfsImageUrl?: string,
): Promise<MintResult | null> {
	const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;

	if (!privateKey) {
		console.warn("[nft] DEPLOYER_PRIVATE_KEY not set — skipping mint");
		return null;
	}

	try {
		const contentHash = keccak256(toHex(JSON.stringify(output)));
		const account = privateKeyToAccount(privateKey);

		const publicClient = createPublicClient({
			chain: xlayer,
			transport: http("https://rpc.xlayer.tech"),
		});

		const totalSupply = await publicClient.readContract({
			address: NFT_CONTRACT,
			abi: NFT_ABI,
			functionName: "totalSupply",
		});
		const tokenId = Number(totalSupply) + 1;

		const client = createWalletClient({
			account,
			chain: xlayer,
			transport: http("https://rpc.xlayer.tech"),
		});

		const finalImageUri = ipfsImageUrl || imageUri;

		const txHash = await client.writeContract({
			address: NFT_CONTRACT,
			abi: NFT_ABI,
			functionName: "mint",
			args: [payerAddress as `0x${string}`, contentHash, kitType, finalImageUri],
		});

		return {
			tokenId,
			contract: NFT_CONTRACT,
			owner: payerAddress,
			contentHash,
			txHash,
			chain: "X Layer (eip155:196)",
			explorerUrl: `https://www.okx.com/explorer/xlayer/tx/${txHash}`,
			imageUrl: ipfsImageUrl || `https://brandcanvas.onrender.com/assets/${tokenId}/image`,
			metadataUrl: `https://brandcanvas.onrender.com/assets/${tokenId}/metadata`,
		};
	} catch (error) {
		console.error(
			"[nft] mint failed:",
			error instanceof Error ? error.message : error,
		);
		return null;
	}
}

/**
 * Extract payer address from the decoded PAYMENT-SIGNATURE header.
 */
export function extractPayerAddress(
	paymentSignature: string | null,
): string | null {
	if (!paymentSignature) return null;
	try {
		const decoded = JSON.parse(
			Buffer.from(paymentSignature, "base64").toString("utf-8"),
		);
		return decoded?.payload?.authorization?.from || null;
	} catch {
		return null;
	}
}
