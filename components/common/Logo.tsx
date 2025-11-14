import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 150, height = 50 }: LogoProps) {
  return (
    <Link href="/" className={cn('inline-block', className)}>
      <div className="flex items-center">
        <span className="text-2xl font-bold text-primary">Collabimmo</span>
      </div>
    </Link>
  );
}

