export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  propertyType?: string;
  consent: boolean;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  propertyType?: string;
  consent?: string;
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
  options?: { value: string; label: string }[];
}

