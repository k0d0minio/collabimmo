import Link from 'next/link';
import { COMPANY_INFO } from '@/lib/constants';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-gray-600">
              {COMPANY_INFO.name}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
            <address className="text-sm text-gray-600 not-italic">
              <p>{COMPANY_INFO.address}</p>
              <p className="mt-2">
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-primary">
                  {COMPANY_INFO.email}
                </a>
              </p>
              <p className="mt-2">
                <a href={`tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`} className="hover:text-primary">
                  {COMPANY_INFO.phone}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Informations légales</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>VAT: {COMPANY_INFO.vat}</p>
              <p>IPI: {COMPANY_INFO.ipi}</p>
              <p className="mt-4">
                <Link href="/privacy" className="hover:text-primary">
                  Politique de confidentialité
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

