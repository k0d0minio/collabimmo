'use client';

import { Section } from '@/components/ui/Section';
import { CTA } from '@/components/ui/CTA';
import { sectionIds } from '@/config/navigation';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, useShouldReduceMotion, isMobileDevice, getAnimationDuration } from '@/lib/animations';

export function TargetAudienceSection() {
  const reduceMotion = useShouldReduceMotion();
  const mobile = isMobileDevice();
  const duration = getAnimationDuration(reduceMotion, mobile);

  const targetGroups = [
    {
      title: 'Investisseurs',
      description: 'Biens rentables / valorisation',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Entreprises',
      description: 'Locaux, commerces, bureaux',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Entrepreneurs',
      description: 'Nouvelle implantation',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Professionnels de l\'immobilier',
      description: 'Sourcing d\'opportunités qualifiées',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <Section id={sectionIds.targetAudience} className="bg-gray-50">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        custom={{ staggerDelay: 0.1 }}
      >
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          custom={{ duration: duration / 1000 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos services s'adressent à…</h2>
        </motion.div>
        
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          custom={{ staggerDelay: 0.1 }}
        >
          {targetGroups.map((group, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
              custom={{ duration: duration / 1000 }}
            >
              <div className="flex justify-center mb-4">
                {group.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{group.title}</h3>
              <p className="text-gray-600 text-center">{group.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          variants={fadeInUp}
          custom={{ duration: duration / 1000, delay: 0.3 }}
        >
          <CTA />
        </motion.div>
      </motion.div>
    </Section>
  );
}

