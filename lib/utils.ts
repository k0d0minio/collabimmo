import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isValidEmailFormat, isValidPhoneFormat } from './validations';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/\s/g, '');
}

// Re-export validation functions from validations.ts to maintain backward compatibility
export const isValidEmail = isValidEmailFormat;
export const isValidPhone = isValidPhoneFormat;

