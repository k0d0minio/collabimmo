import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = siteConfig.url;

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date("2025-01-01"),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];
}
