import { cn } from '@/lib/utils';

export interface FormErrorProps {
  message?: string;
  className?: string;
  detailed?: boolean;
}

export function FormError({ message, className, detailed }: FormErrorProps) {
  if (!message) return null;

  const isDevelopment = process.env.NODE_ENV === 'development';
  const showDetailed = detailed !== false && isDevelopment;

  return (
    <div 
      className={cn('p-4 rounded-md bg-red-50 border border-red-200', className)}
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm text-red-800 font-medium">{message}</p>
      {showDetailed && message.includes('\n') && (
        <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap font-mono bg-red-100 p-2 rounded">
          {message}
        </pre>
      )}
    </div>
  );
}

