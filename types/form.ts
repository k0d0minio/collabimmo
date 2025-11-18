export interface ContactFormData {
  firstname: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  vatNumber?: string;
  message: string;
  propertyType?: string;
  consent: boolean;
  turnstileToken?: string;
}

export interface ContactFormErrors {
  firstname?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  vatNumber?: string;
  message?: string;
  propertyType?: string;
  consent?: string;
  turnstileToken?: string;
  general?: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: readonly { value: string; label: string }[];
}

