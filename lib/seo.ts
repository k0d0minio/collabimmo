import type { Metadata } from 'next';
import { siteConfig, defaultMetadata } from '@/config/site';

export function generateMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
  };
}

export function generatePageMetadata(
  title: string,
  description?: string,
  path?: string
): Metadata {
  return generateMetadata({
    title,
    description: description || siteConfig.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description: description || siteConfig.description,
      url: path ? `${siteConfig.url}${path}` : siteConfig.url,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description: description || siteConfig.description,
    },
  });
}

