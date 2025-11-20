'use client';

import { Section } from '@/components/ui/Section';
import { CTA } from '@/components/ui/CTA';
import { BackgroundGallery } from '@/components/ui/BackgroundGallery';
import { sectionIds } from '@/config/navigation';
import { heroMediaItems } from '@/config/heroMedia';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, useShouldReduceMotion, isMobileDevice, getAnimationDuration } from '@/lib/animations';

export function HeroSection() {
  const reduceMotion = useShouldReduceMotion();
  const mobile = isMobileDevice();
  const duration = getAnimationDuration(reduceMotion, mobile);

  return (
    <Section id={sectionIds.hero} className="relative min-h-[600px] flex items-center text-white">
      <BackgroundGallery items={heroMediaItems} interval={8000} />
      <div className="absolute inset-0 bg-black/50 z-0" />
      <motion.div
        className="relative z-10 w-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        custom={{ staggerDelay: 0.1 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          variants={fadeInUp}
          custom={{ duration: duration / 1000 }}
        >
          Aucun bien, aucun secteur, aucun défi ne nous limite.
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl"
          variants={fadeInUp}
          custom={{ duration: duration / 1000 }}
        >
Bureaux, commerces, entrepôts, terrains à bâtir, agricoles, bois & forêts, projets off-market… dites-nous ce que vous cherchez, nous le trouvons.
        </motion.p>
        <motion.div variants={fadeInUp} custom={{ duration: duration / 1000 }}>
          <CTA size="lg" />
        </motion.div>
      </motion.div>
    </Section>
  );
}

