import { FORM_MESSAGES } from './constants';
import type { ContactFormData, ContactFormErrors } from '@/types';

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

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

