'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { Navigation } from './Navigation';
import { CTA } from '@/components/ui/CTA';
import { Button } from '@/components/ui/Button';
import { navigationConfig } from '@/config/navigation';
import { useScrollTo } from '@/hooks/useScrollTo';
import { cn } from '@/lib/utils';
import { fadeInDown, useShouldReduceMotion } from '@/lib/animations';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollTo } = useScrollTo();
  const reduceMotion = useShouldReduceMotion();

  const handleMobileNavClick = (href: string, id?: string) => {
    if (href.startsWith('#')) {
      const targetId = id || href.slice(1);
      scrollTo(targetId, 80);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          <Navigation className="hidden md:flex" />
          
          <div className="hidden md:flex items-center gap-4">
            <CTA size="sm" />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t overflow-hidden"
              variants={reduceMotion ? undefined : fadeInDown}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ willChange: reduceMotion ? 'auto' : 'transform, opacity' }}
            >
              <nav className="flex flex-col space-y-4">
                {navigationConfig.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMobileNavClick(item.href, item.id);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4">
                  <CTA className="w-full" />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

