import type { NavigationConfig } from '@/types';

export const navigationConfig: NavigationConfig = {
  items: [
    { label: 'Accueil', href: '/', id: 'accueil' },
    { label: 'Qui sommes-nous ?', href: '#qui-sommes-nous', id: 'qui-sommes-nous' },
    { label: 'Pour qui ?', href: '#pour-qui', id: 'pour-qui' },
    { label: 'Pourquoi nous choisir ?', href: '#pourquoi-nous-choisir', id: 'pourquoi-nous-choisir' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ],
};

export const sectionIds = {
  hero: 'accueil',
  about: 'qui-sommes-nous',
  targetAudience: 'pour-qui',
  whyChooseUs: 'pourquoi-nous-choisir',
  contact: 'contact',
} as const;

