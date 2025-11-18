'use client';

import { useState, useCallback } from 'react';
import { submitContactForm } from '@/lib/api';
import { validateContactForm, hasFormErrors, validateField } from '@/lib/validations';
import type { ContactFormData, ContactFormErrors } from '@/types';
import { FORM_MESSAGES } from '@/lib/constants';

const initialFormData: ContactFormData = {
  firstname: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  vatNumber: '',
  message: '',
  propertyType: '',
  consent: false,
};

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const updateField = useCallback((name: keyof ContactFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // For email field, validate on change for immediate feedback
    if (name === 'email' && typeof value === 'string' && value.length > 0) {
      const error = validateField(name, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);
    return !hasFormErrors(validationErrors);
  }, [formData]);

  const handleBlur = useCallback((name: keyof ContactFormData) => {
    const value = formData[name];
    // Provide default values for undefined optional fields
    const valueToValidate = value ?? (name === 'consent' ? false : '');
    const error = validateField(name, valueToValidate);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      // Clear error if field is valid
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitStatus('idle');
    setSubmitMessage('');
  }, []);

  const submit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const { firstname, name, email, phone, company, vatNumber, message, propertyType } = formData;
      const response = await submitContactForm({
        firstname,
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        vatNumber: vatNumber || undefined,
        message,
        propertyType: propertyType || undefined,
      });

      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage(FORM_MESSAGES.success);
        // Reset form data but keep success status/message visible
        setFormData(initialFormData);
        setErrors({});
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.error || FORM_MESSAGES.error);
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage(FORM_MESSAGES.error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, reset]);

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    submitMessage,
    updateField,
    validate,
    handleBlur,
    submit,
    reset,
  };
}

