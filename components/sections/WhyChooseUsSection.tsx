'use client';

import { Section } from '@/components/ui/Section';
import { CTA } from '@/components/ui/CTA';
import { sectionIds } from '@/config/navigation';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, useShouldReduceMotion, isMobileDevice, getAnimationDuration } from '@/lib/animations';

export function WhyChooseUsSection() {
  const reduceMotion = useShouldReduceMotion();
  const mobile = isMobileDevice();
  const duration = getAnimationDuration(reduceMotion, mobile);

  const steps = [
    {
      number: '1',
      title: 'Analyse de vos besoins',
      description: 'Écoute et compréhension',
    },
    {
      number: '2',
      title: 'Recherche ciblée de solutions',
      description: 'Ciblées et sur mesure',
    },
    {
      number: '3',
      title: 'Suivi administratif & financier',
      description: 'Jusqu\'à la signature',
    },
  ];

  const specializations = [
    'Opportunités hors marché (non diffusées au grand public)',
    'Discrétion & confidentialité',
    'Réseau réactif de partenaires qualifiés',
  ];

  return (
    <Section id={sectionIds.whyChooseUs}>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            L'immobilier professionnel, sans perte de temps.
          </h2>
          <p className="text-xl text-gray-600">
            Un accompagnement en 3 étapes simples :
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 mb-16 items-center"
          variants={staggerContainer}
          custom={{ staggerDelay: 0.1 }}
        >
          {steps.flatMap((step, index) => {
            const items = [
              <motion.div
                key={`step-${index}`}
                className="flex flex-col items-center text-center"
                variants={fadeInUp}
                custom={{ duration: duration / 1000 }}
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ];
            
            if (index < steps.length - 1) {
              items.push(
                <motion.div
                  key={`arrow-${index}`}
                  className="flex items-center justify-center"
                  variants={fadeInUp}
                  custom={{ duration: duration / 1000 }}
                >
                  {/* Horizontal arrow for desktop */}
                  <svg
                    className="hidden md:block w-full max-w-[60px] h-4 text-gray-300"
                    viewBox="0 0 60 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="0"
                      y1="8"
                      x2="50"
                      y2="8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M50 8 L60 8 L55 4 M60 8 L55 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* Vertical arrow for mobile */}
                  <svg
                    className="md:hidden w-4 h-12 text-gray-300"
                    viewBox="0 0 16 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="8"
                      y1="0"
                      x2="8"
                      y2="50"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 50 L8 60 L4 55 M8 60 L12 55"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              );
            }
            
            return items;
          })}
        </motion.div>

        <motion.div
          className="bg-gray-50 rounded-lg p-8"
          variants={fadeInUp}
          custom={{ duration: duration / 1000, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Notre spécialité</h3>
          <motion.ul
            className="space-y-4 max-w-2xl mx-auto"
            variants={staggerContainer}
            custom={{ staggerDelay: 0.08 }}
          >
            {specializations.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start md:justify-center"
                variants={fadeInUp}
                custom={{ duration: duration / 1000 }}
              >
                <svg className="w-6 h-6 text-primary mr-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
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

