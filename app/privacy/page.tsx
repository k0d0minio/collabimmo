import { Section } from '@/components/ui/Section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Collabimmo',
  description: 'Politique de confidentialité de Collabimmo - Découvrez comment nous collectons, utilisons et protégeons vos données personnelles.',
};

export default function PrivacyPage() {
  return (
    <Section className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Politique de Confidentialité</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              La présente politique de confidentialité décrit la manière dont Collabimmo collecte, 
              utilise et protège vos informations personnelles lorsque vous utilisez notre site web 
              et nos services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Collecte des Données</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous collectons les informations que vous nous fournissez directement, notamment 
              lorsque vous remplissez notre formulaire de contact. Ces informations peuvent inclure 
              votre nom, adresse email, numéro de téléphone, nom de votre entreprise et tout autre 
              message que vous choisissez de partager.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Utilisation des Données</h2>
            <p className="text-gray-700 leading-relaxed">
              Les informations collectées sont utilisées pour :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Répondre à vos demandes et questions</li>
              <li>Vous contacter concernant nos services</li>
              <li>Améliorer nos services et votre expérience</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Protection des Données</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos 
              informations personnelles contre tout accès non autorisé, altération, divulgation 
              ou destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Partage des Données</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des 
              tiers. Nous pouvons partager vos informations uniquement dans les cas suivants :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Avec votre consentement explicite</li>
              <li>Pour respecter une obligation légale</li>
              <li>Pour protéger nos droits et notre sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Vos Droits</h2>
            <p className="text-gray-700 leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous avez 
              le droit de :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données personnelles</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander la portabilité de vos données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Notre site web peut utiliser des cookies pour améliorer votre expérience de 
              navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, 
              mais cela peut affecter certaines fonctionnalités du site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de confidentialité à 
              tout moment. Les modifications seront publiées sur cette page avec une date de 
              mise à jour révisée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant cette politique de confidentialité ou pour exercer 
              vos droits, veuillez nous contacter via le formulaire de contact disponible sur 
              notre site web.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

