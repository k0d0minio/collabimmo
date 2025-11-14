import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Collabimmo',
  description: 'Votre partenaire privilégié pour des transactions immobilières sur mesure. Nous mettons en relation investisseurs, entreprises et propriétaires avec un accompagnement personnalisé.',
  url: 'https://www.collabimmo.be',
  ogImage: '/og-image.jpg',
  company: {
    name: 'Collabimmo',
    address: 'Rue de Namur 503 C, 6200 Châtelet',
    email: 'info@collabimmo.be',
    phone: '+32 71 300 081',
    vat: 'BE 0801.347.286',
    ipi: '519569',
    website: 'www.collabimmo.be',
  },
  contact: {
    email: 'info@collabimmo.be',
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

