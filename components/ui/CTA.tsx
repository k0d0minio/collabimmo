'use client';

import { Button, type ButtonProps } from './Button';
import { useScrollTo } from '@/hooks/useScrollTo';
import { sectionIds } from '@/config/navigation';

export interface CTAProps extends Omit<ButtonProps, 'onClick'> {
  href?: string;
  targetId?: string;
  onClick?: () => void;
}

export function CTA({ href, targetId = sectionIds.contact, onClick, children, ...props }: CTAProps) {
  const { scrollTo } = useScrollTo();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      if (href.startsWith('#')) {
        scrollTo(href.slice(1), 80);
      } else {
        window.location.href = href;
      }
    } else {
      scrollTo(targetId, 80);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children || 'Nous contacter'}
    </Button>
  );
}

