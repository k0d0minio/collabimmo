import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { FormFieldProps } from '@/types';

export function FormField({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  error,
  value,
  onChange,
  options,
  ...props
}: FormFieldProps & (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement> | SelectHTMLAttributes<HTMLSelectElement>)) {
  const fieldId = `field-${name}`;
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';

  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={fieldId}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
            error ? 'border-red-500' : 'border-gray-300',
            'resize-none'
          )}
          rows={4}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : isSelect ? (
        <select
          id={fieldId}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
            error ? 'border-red-500' : 'border-gray-300'
          )}
          {...(props as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          <option value="">Sélectionnez une option</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
            error ? 'border-red-500' : 'border-gray-300'
          )}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

