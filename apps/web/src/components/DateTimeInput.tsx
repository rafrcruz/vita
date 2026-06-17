import * as React from 'react';
import { Input } from './ui/input';
import { formatDateTimeMask, validateDateTimeString } from '../lib/date';

interface DateTimeInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value: string; // format: DD/MM/AAAA HH:MM
  onChange: (value: string, isValid: boolean) => void;
}

export function DateTimeInput({ value, onChange, className, ...props }: DateTimeInputProps) {
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Handle backspace when cursor is right after a separator
    if (val.length < internalValue.length) {
      const lastCharDeleted = internalValue[val.length];
      if (lastCharDeleted === '/' || lastCharDeleted === ' ' || lastCharDeleted === ':') {
        val = val.slice(0, -1);
      }
    }

    const formatted = formatDateTimeMask(val);
    setInternalValue(formatted);

    const isValid = validateDateTimeString(formatted);
    onChange(formatted, isValid);
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="DD/MM/AAAA HH:MM"
      value={internalValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}
