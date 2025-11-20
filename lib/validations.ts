import { FORM_MESSAGES } from './constants';
import type { ContactFormData, ContactFormErrors } from '@/types';

// Shared validation regex patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]+$/,
} as const;

// Shared validation utility functions
export function isValidEmailFormat(email: string): boolean {
  return VALIDATION_PATTERNS.email.test(email);
}

export function isValidPhoneFormat(phone: string): boolean {
  if (!phone || phone.trim().length === 0) {
    return false; // Phone is required
  }
  const digitsOnly = phone.replace(/\D/g, '');
  return VALIDATION_PATTERNS.phone.test(phone) && digitsOnly.length >= 9;
}

// Individual field validation functions
export function validateFirstname(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return FORM_MESSAGES.required;
  }
  return undefined;
}

export function validateName(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return FORM_MESSAGES.required;
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return FORM_MESSAGES.required;
  }
  if (!isValidEmailFormat(value)) {
    return FORM_MESSAGES.invalidEmail;
  }
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return FORM_MESSAGES.required;
  }
  if (!isValidPhoneFormat(value)) {
    return FORM_MESSAGES.invalidPhone;
  }
  return undefined;
}

export function validateMessage(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return FORM_MESSAGES.required;
  }
  return undefined;
}

export function validateConsent(value: boolean): string | undefined {
  if (!value) {
    return FORM_MESSAGES.consentRequired;
  }
  return undefined;
}

export function validateTurnstileToken(value: string | undefined): string | undefined {
  if (!value || value.trim().length === 0) {
    return 'Veuillez compléter la vérification CAPTCHA';
  }
  return undefined;
}

// Validate a single field by name
export function validateField(
  name: keyof ContactFormData,
  value: string | boolean
): string | undefined {
  switch (name) {
    case 'firstname':
      return validateFirstname(value as string);
    case 'name':
      return validateName(value as string);
    case 'email':
      return validateEmail(value as string);
    case 'phone':
      return validatePhone(value as string);
    case 'message':
      return validateMessage(value as string);
    case 'consent':
      return validateConsent(value as boolean);
    case 'turnstileToken':
      return validateTurnstileToken(value as string | undefined);
    case 'company':
    case 'vatNumber':
    case 'propertyType':
      // Optional fields, no validation needed
      return undefined;
    default:
      return undefined;
  }
}

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.firstname || data.firstname.trim().length === 0) {
    errors.firstname = FORM_MESSAGES.required;
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.name = FORM_MESSAGES.required;
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = FORM_MESSAGES.required;
  } else if (!isValidEmailFormat(data.email)) {
    errors.email = FORM_MESSAGES.invalidEmail;
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = FORM_MESSAGES.required;
  } else if (!isValidPhoneFormat(data.phone)) {
    errors.phone = FORM_MESSAGES.invalidPhone;
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = FORM_MESSAGES.required;
  }

  if (!data.consent) {
    errors.consent = FORM_MESSAGES.consentRequired;
  }

  if (!data.turnstileToken || data.turnstileToken.trim().length === 0) {
    errors.turnstileToken = 'Veuillez compléter la vérification CAPTCHA';
  }

  return errors;
}

export function hasFormErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

