import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { Grain } from "@/components/grain";
import "./globals.css";

const garamond = EB_Garamond({
	variable: "--font-garamond",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	style: ["normal", "italic"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "BrandCanvas — Create brand identities. Own them on-chain.",
	description:
		"Verifiable generative brand assets with on-chain provenance. Extract or generate color systems, typography, palettes, and brand guidelines. Every asset mints an NFT to your wallet.",
	openGraph: {
		title: "BrandCanvas — Brand Identity Agent",
		description:
			"Extract or generate brand assets. Own them on-chain as NFTs on X Layer.",
		siteName: "BrandCanvas",
	},
	twitter: {
		card: "summary_large_image",
		title: "BrandCanvas — Brand Identity Agent",
		description: "Create brand identities. Own them on-chain.",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
			</head>
			<body className={garamond.variable}>
				<Grain />
				{children}
			</body>
		</html>
	);
}
