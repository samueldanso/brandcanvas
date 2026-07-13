import {
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
	"function mint(address to, bytes32 contentHash, string calldata kitType) external returns (uint256)",
]);

const NFT_CONTRACT =
	"0x5D74842220B4a68D0012C59A871bD47285C6a0cb" as `0x${string}`;

export interface MintResult {
	tokenId: number;
	contract: string;
	owner: string;
	contentHash: string;
	txHash: string;
	chain: string;
	explorerUrl: string;
}

/**
 * Mint a BrandCanvas IP NFT to the payer's wallet on X Layer.
 * Non-fatal: returns null if minting is unavailable or fails.
 */
export async function mintBrandKitNFT(
	output: object,
	kitType: string,
	payerAddress: string,
): Promise<MintResult | null> {
	const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;

	if (!privateKey) {
		console.warn("[nft] DEPLOYER_PRIVATE_KEY not set — skipping mint");
		return null;
	}

	try {
		const contentHash = keccak256(toHex(JSON.stringify(output)));
		const account = privateKeyToAccount(privateKey);
		const client = createWalletClient({
			account,
			chain: xlayer,
			transport: http("https://rpc.xlayer.tech"),
		});

		const txHash = await client.writeContract({
			address: NFT_CONTRACT,
			abi: NFT_ABI,
			functionName: "mint",
			args: [payerAddress as `0x${string}`, contentHash, kitType],
		});

		// Parse tokenId from tx receipt logs (Transfer event topic[3])
		const { createPublicClient } = await import("viem");
		const publicClient = createPublicClient({
			chain: xlayer,
			transport: http("https://rpc.xlayer.tech"),
		});
		const receipt = await publicClient.waitForTransactionReceipt({
			hash: txHash,
		});
		const transferLog = receipt.logs.find(
			(log) =>
				log.topics[0] ===
				"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
		);
		const tokenId = transferLog?.topics[3]
			? Number(BigInt(transferLog.topics[3]))
			: 0;

		return {
			tokenId,
			contract: NFT_CONTRACT,
			owner: payerAddress,
			contentHash,
			txHash,
			chain: "X Layer (eip155:196)",
			explorerUrl: `https://www.okx.com/explorer/xlayer/tx/${txHash}`,
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
