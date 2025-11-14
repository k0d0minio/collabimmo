'use client';

import { Section } from '@/components/ui/Section';
import { sectionIds } from '@/config/navigation';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, useShouldReduceMotion, isMobileDevice, getAnimationDuration } from '@/lib/animations';

export function AboutSection() {
  const reduceMotion = useShouldReduceMotion();
  const mobile = isMobileDevice();
  const duration = getAnimationDuration(reduceMotion, mobile);

  return (
    <Section id={sectionIds.about}>
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        custom={{ staggerDelay: 0.1 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          variants={fadeInUp}
          custom={{ duration: duration / 1000 }}
        >
          Qui sommes-nous ?
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-8"
          variants={fadeInUp}
          custom={{ duration: duration / 1000 }}
        >
          Votre partenaire privilégié pour des transactions immobilières sur mesure. Nous mettons en relation investisseurs, entreprises et propriétaires avec un accompagnement personnalisé.
        </motion.p>
        
        <motion.div
          className="grid md:grid-cols-3 gap-8 mt-12"
          variants={staggerContainer}
          custom={{ staggerDelay: 0.1 }}
        >
          <motion.div
            className="text-center"
            variants={fadeInUp}
            custom={{ duration: duration / 1000 }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Service rapide, efficace et personnalisé</h3>
          </motion.div>
          
          <motion.div
            className="text-center"
            variants={fadeInUp}
            custom={{ duration: duration / 1000 }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Transactions gagnant-gagnant</h3>
          </motion.div>
          
          <motion.div
            className="text-center"
            variants={fadeInUp}
            custom={{ duration: duration / 1000 }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Accompagnement en dehors des circuits traditionnels</h3>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 pt-8 border-t"
          variants={fadeInUp}
          custom={{ duration: duration / 1000, delay: 0.3 }}
        >
          <p className="text-lg font-semibold text-gray-700">
            Proactivité | Compétence | Proximité
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}

