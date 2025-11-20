import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { FormFieldProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function FormField({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  error,
  value,
  onChange,
  onBlur,
  options,
  ...props
}: FormFieldProps & (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>)) {
  const fieldId = `field-${name}`;
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';

  // Handle Select's onValueChange to work with existing onChange handler
  const handleSelectChange = (newValue: string) => {
    if (onChange) {
      // Create a synthetic event-like object for compatibility
      const syntheticEvent = {
        target: { value: newValue, name },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  // Handle Select's onBlur to work with existing onBlur handler
  const handleSelectBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (onBlur) {
      // Create a synthetic event-like object for compatibility
      const syntheticEvent = {
        target: { name },
        currentTarget: { name },
      } as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
      onBlur(syntheticEvent);
    }
  };

  // Convert empty string to undefined for Select (Radix shows placeholder when value is undefined)
  const selectValue = isSelect && (!value || value === '') ? undefined : value;

  return (
    <div className="w-full">
      <Label htmlFor={fieldId} className="block mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {isTextarea ? (
        <Textarea
          id={fieldId}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            'px-4',
            error && 'border-red-500 focus-visible:ring-red-500',
            'resize-none'
          )}
          rows={4}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : isSelect ? (
        <Select
          value={selectValue}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger
            id={fieldId}
            name={name}
            className={cn(
              'px-4',
              error && 'border-red-500 focus:ring-red-500'
            )}
            onBlur={handleSelectBlur}
          >
            <SelectValue placeholder={placeholder || 'Sélectionnez une option'} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={fieldId}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            'px-4',
            error && 'border-red-500 focus-visible:ring-red-500'
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

