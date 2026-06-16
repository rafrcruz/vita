import * as React from 'react';
import { useFormContext, Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { Label } from './label';
import { Input } from './input';

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  type?: string;
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  placeholder?: string;
  className?: string;
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  type = 'text',
  inputMode,
  placeholder,
  className,
}: FormFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            type={type}
            inputMode={inputMode}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={cn(error && 'border-destructive focus-visible:ring-destructive')}
            {...field}
          />
          {error && (
            <p id={`${name}-error`} className="text-sm text-destructive" role="alert">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
