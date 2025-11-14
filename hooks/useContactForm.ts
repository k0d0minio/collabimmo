'use client';

import { useState, useCallback } from 'react';
import { submitContactForm } from '@/lib/api';
import { validateContactForm, hasFormErrors } from '@/lib/validations';
import type { ContactFormData, ContactFormErrors } from '@/types';
import { FORM_MESSAGES } from '@/lib/constants';

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
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
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);
    return !hasFormErrors(validationErrors);
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
      const { name, email, phone, company, message, propertyType } = formData;
      const response = await submitContactForm({
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        message,
        propertyType: propertyType || undefined,
      });

      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage(FORM_MESSAGES.success);
        reset();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.error || FORM_MESSAGES.error);
      }
    } catch (error) {
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
    submit,
    reset,
  };
}

