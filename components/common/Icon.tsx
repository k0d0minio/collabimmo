import { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name?: string;
}

export function Icon({ name, className, children, ...props }: IconProps) {
  return (
    <svg
      className={cn('w-5 h-5', className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      {children}
    </svg>
  );
}

