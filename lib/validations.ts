import { FORM_MESSAGES } from './constants';
import type { ContactFormData, ContactFormErrors } from '@/types';

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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return FORM_MESSAGES.invalidEmail;
  }
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return undefined; // Phone is optional
  }
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitsOnly = value.replace(/\D/g, '');
  if (!phoneRegex.test(value) || digitsOnly.length < 9) {
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
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = FORM_MESSAGES.invalidEmail;
  }

  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = data.phone.replace(/\D/g, '');
    if (!phoneRegex.test(data.phone) || digitsOnly.length < 9) {
      errors.phone = FORM_MESSAGES.invalidPhone;
    }
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = FORM_MESSAGES.required;
  }

  if (!data.consent) {
    errors.consent = FORM_MESSAGES.consentRequired;
  }

  return errors;
}

export function hasFormErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

