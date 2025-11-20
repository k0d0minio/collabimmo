# Collabimmo Website

Site web professionnel pour Collabimmo - Votre partenaire privilégié pour des transactions immobilières sur mesure.

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Email**: Resend + React Email
- **Security**: Cloudflare Turnstile (CAPTCHA)
- **Deployment**: Optimisé pour Vercel

## Prérequis

- Node.js 20+ 
- npm, yarn, pnpm ou bun

## Installation

1. **Cloner le repository** (si applicable)
   ```bash
   git clone <repository-url>
   cd collabimmo
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configurer les variables d'environnement**
   
   Créer un fichier `.env.local` à la racine du projet avec les variables suivantes :
   
   ```bash
   # Server-side (privées)
   RESEND_API_KEY=votre_clé_api_resend
   RESEND_FROM_EMAIL=noreply@votre-domaine.com
   EMAIL_TO=contact@votre-domaine.com
   TURNSTILE_SECRET_KEY=votre_clé_secrète_turnstile
   
   # Client-side (publiques - intégrées au build)
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=votre_clé_publique_turnstile
   NEXT_PUBLIC_SITE_URL=https://www.collabimmo.be
   NEXT_PUBLIC_SITE_NAME=Collabimmo
   ```
   
   > **Note**: Voir `.env.example` pour la liste complète des variables disponibles.

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```
   
   Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run start` - Lance le serveur de production (après build)
- `npm run lint` - Vérifie le code avec ESLint
- `npm run clean` - Supprime les dossiers de build et node_modules

## Configuration des services externes

### Resend (Email)

1. Créer un compte sur [resend.com](https://resend.com)
2. Générer une clé API dans les paramètres
3. Vérifier votre domaine d'envoi
4. Configurer `RESEND_API_KEY` et `RESEND_FROM_EMAIL`

### Cloudflare Turnstile

1. Créer un compte sur [Cloudflare](https://dash.cloudflare.com)
2. Aller dans Turnstile et créer un site
3. Récupérer la clé publique (Site Key) et la clé secrète (Secret Key)
4. Configurer `NEXT_PUBLIC_TURNSTILE_SITE_KEY` et `TURNSTILE_SECRET_KEY`

## Déploiement

### Vercel (Recommandé)

1. **Connecter le projet à Vercel**
   - Via l'interface Vercel : importer le repository Git
   - Via CLI : `vercel`

2. **Configurer les variables d'environnement**
   - Dans le dashboard Vercel, aller dans Settings > Environment Variables
   - Ajouter toutes les variables nécessaires (voir `.env.example`)
   - **Important**: Les variables `NEXT_PUBLIC_*` doivent être définies avant le build

3. **Déployer**
   - Push sur la branche `main` déclenche un déploiement automatique
   - Ou utiliser `vercel --prod` pour déployer manuellement

### Autres plateformes

Le projet peut être déployé sur toute plateforme supportant Next.js :
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

**Important**: Assurez-vous que :
- Les variables d'environnement sont configurées
- Node.js 20+ est disponible
- Le build command est `npm run build`
- Le start command est `npm run start`

## Structure du projet

```
collabimmo/
├── app/                    # App Router (Next.js 16)
│   ├── api/               # Routes API
│   ├── privacy/           # Page politique de confidentialité
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── layout/           # Composants de layout (Header, Footer)
│   ├── sections/         # Sections de la page d'accueil
│   └── ui/               # Composants UI réutilisables
├── config/               # Configuration
├── hooks/                # Hooks React personnalisés
├── lib/                  # Utilitaires et helpers
├── public/               # Fichiers statiques
└── types/                # Types TypeScript
```

## Sécurité

Le site implémente plusieurs mesures de sécurité :

- **Rate limiting** : Limite les requêtes API (5 requêtes / 15 minutes par IP)
- **CAPTCHA** : Cloudflare Turnstile pour prévenir le spam
- **Sanitization** : Tous les inputs utilisateur sont sanitizés
- **Security headers** : Headers HTTP de sécurité configurés
- **Timeouts** : Timeouts sur toutes les requêtes externes

## Maintenance

### Mise à jour des dépendances

```bash
npm outdated
npm update
```

### Vérification de la configuration

En cas de problème, vérifier les variables d'environnement :

```typescript
import { debugEnv } from '@/lib/env';
console.log(debugEnv());
```

### Logs en production

Les erreurs sont loggées côté serveur et capturées automatiquement par les function logs de Vercel. Consulter le dashboard Vercel > Logs pour voir les erreurs en production.

## Assets requis

### Image Open Graph

Le site référence une image Open Graph (`/og-image.jpg`) pour le partage sur les réseaux sociaux. 

**Important**: Créer un fichier `public/og-image.jpg` avec :
- Dimensions recommandées : 1200x630px
- Format : JPG ou PNG
- Contenu : Logo ou image représentative de Collabimmo

Si l'image n'est pas présente, les réseaux sociaux utiliseront une image par défaut.

## Support

Pour toute question ou problème :
- Vérifier la documentation Next.js : https://nextjs.org/docs
- Consulter les logs d'erreur dans la console du navigateur (dev) ou les logs serveur (prod)

## Licence

Propriétaire - Collabimmo
