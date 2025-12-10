import type { Metadata } from "next";
import { publicEnv } from "@/lib/env";

export const siteConfig = {
	name: publicEnv.site.name,
	description:
		"Spécialiste en investissement immobilier en Wallonie et Belgique. Terrains agricoles à développer, bureaux, commerces, entrepôts et opportunités off-market. Accompagnement personnalisé pour investisseurs et entreprises.",
	url: publicEnv.site.url,
	ogImage: "/og-image.jpg",
	company: {
		name: publicEnv.site.name,
		address: publicEnv.company.address,
		email: publicEnv.company.email,
		phone: publicEnv.company.phone,
		vat: publicEnv.company.vat,
		ipi: publicEnv.company.ipi,
		website: publicEnv.site.url
			.replace(/^https?:\/\//, "")
			.replace(/^www\./, ""),
	},
	contact: {
		email: publicEnv.company.email,
	},
} as const;

export const defaultMetadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	metadataBase: new URL(siteConfig.url),
	openGraph: {
		type: "website",
		locale: "fr_BE",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
	},
	robots: {
		index: true,
		follow: true,
	},
};
