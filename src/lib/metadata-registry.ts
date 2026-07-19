interface DeliveryMeta {
	kitType: string;
	metadataUrl: string;
	imageUrl: string;
}

const registry = new Map<number, DeliveryMeta>();

export function registerDelivery(
	tokenId: number,
	kitType: string,
	metadataUrl: string,
	imageUrl: string,
): void {
	registry.set(tokenId, { kitType, metadataUrl, imageUrl });
}

export function getDeliveryMeta(tokenId: number): DeliveryMeta | null {
	return registry.get(tokenId) || null;
}
