import type { Metadata } from 'next';
import { publicEnv } from '@/lib/env';

export const siteConfig = {
  name: publicEnv.site.name,
  description: 'Votre partenaire privilégié pour des transactions immobilières sur mesure. Nous mettons en relation investisseurs, entreprises et propriétaires avec un accompagnement personnalisé.',
  url: publicEnv.site.url,
  ogImage: '/og-image.jpg',
  company: {
    name: publicEnv.site.name,
    address: publicEnv.company.address,
    email: publicEnv.company.email,
    phone: publicEnv.company.phone,
    vat: publicEnv.company.vat,
    ipi: publicEnv.company.ipi,
    website: publicEnv.site.url.replace(/^https?:\/\//, '').replace(/^www\./, ''),
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
    type: 'website',
    locale: 'fr_BE',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

