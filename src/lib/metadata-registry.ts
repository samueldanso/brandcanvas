interface DeliveryMeta {
	kitType: string;
	metadataUrl: string;
	imageUrl: string;
	txHash: string;
}

const registry = new Map<number, DeliveryMeta>();

export function registerDelivery(
	tokenId: number,
	kitType: string,
	metadataUrl: string,
	imageUrl: string,
	txHash: string,
): void {
	registry.set(tokenId, { kitType, metadataUrl, imageUrl, txHash });
}

export function getDeliveryMeta(tokenId: number): DeliveryMeta | null {
	return registry.get(tokenId) || null;
}
