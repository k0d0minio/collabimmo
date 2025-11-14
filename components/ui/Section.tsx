'use client';

import { HTMLAttributes, ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp, useShouldReduceMotion, isMobileDevice, getAnimationDuration } from '@/lib/animations';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({ id, children, className, containerClassName, ...props }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reduceMotion = useShouldReduceMotion();
  const mobile = isMobileDevice();
  const duration = getAnimationDuration(reduceMotion, mobile);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={cn('py-16 md:py-24', className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      custom={{ duration: duration / 1000 }}
      style={{ willChange: reduceMotion ? 'auto' : 'transform, opacity' }}
      {...props}
    >
      <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </motion.section>
  );
}

