'use client';

import { Section } from '@/components/ui/Section';
import { ContactForm } from '@/components/ui/Form/ContactForm';
import { sectionIds } from '@/config/navigation';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, useShouldReduceMotion, isMobileDevice, getAnimationDuration } from '@/lib/animations';

export function ContactSection() {
  const reduceMotion = useShouldReduceMotion();
  const mobile = isMobileDevice();
  const duration = getAnimationDuration(reduceMotion, mobile);

  return (
    <Section id={sectionIds.contact} className="bg-gray-50">
      <motion.div
        className="max-w-3xl mx-auto"
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Démarrons votre recherche ensemble
          </h2>
          <p className="text-lg text-gray-600">
            Remplissez simplement notre formulaire, nous vous recontactons rapidement avec des propositions adaptées.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-8"
          variants={fadeInUp}
          custom={{ duration: duration / 1000, delay: 0.2 }}
        >
          <ContactForm />
        </motion.div>
      </motion.div>
    </Section>
  );
}

