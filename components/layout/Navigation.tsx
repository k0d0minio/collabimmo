'use client';

import Link from 'next/link';
import { useScrollTo } from '@/hooks/useScrollTo';
import { navigationConfig } from '@/config/navigation';
import { cn } from '@/lib/utils';

export function Navigation({ className }: { className?: string }) {
  const { scrollTo } = useScrollTo();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id?: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = id || href.slice(1);
      scrollTo(targetId, 80);
    }
  };

  return (
    <nav className={cn('hidden md:flex items-center space-x-8', className)}>
      {navigationConfig.items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={(e) => handleClick(e, item.href, item.id)}
          className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

