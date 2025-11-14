import { cn } from '@/lib/utils';

export interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={cn('p-4 rounded-md bg-red-50 border border-red-200', className)}>
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}

