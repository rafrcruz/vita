import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { DateTimeInput } from './DateTimeInput';

describe('DateTimeInput component integration tests', () => {
  beforeEach(() => {
    // Freeze time to 17/06/2026 12:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 17, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly with initial values and mask placeholder', () => {
    render(<DateTimeInput value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('DD/MM/AAAA HH:MM') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  it('formats input text as user types continuously', () => {
    let currentVal = '';
    let currentValid = false;

    const { rerender } = render(
      <DateTimeInput
        value={currentVal}
        onChange={(val, valid) => {
          currentVal = val;
          currentValid = valid;
        }}
      />
    );

    const input = screen.getByPlaceholderText('DD/MM/AAAA HH:MM') as HTMLInputElement;

    // Type "1206"
    fireEvent.change(input, { target: { value: '1206' } });
    rerender(
      <DateTimeInput
        value={currentVal}
        onChange={(val, valid) => {
          currentVal = val;
          currentValid = valid;
        }}
      />
    );
    expect(currentVal).toBe('12/06');
    expect(currentValid).toBe(false);

    // Type remaining digits "20260130"
    fireEvent.change(input, { target: { value: '12/0620260130' } });
    rerender(
      <DateTimeInput
        value={currentVal}
        onChange={(val, valid) => {
          currentVal = val;
          currentValid = valid;
        }}
      />
    );
    expect(currentVal).toBe('12/06/2026 01:30');
    expect(currentValid).toBe(true); // Past date relative to fake time 17/06/2026 12:00
  });

  it('handles separator deletion (backspace) cleanly without sticking', () => {
    let currentVal = '12/06/';
    let currentValid = false;

    const { rerender } = render(
      <DateTimeInput
        value={currentVal}
        onChange={(val, valid) => {
          currentVal = val;
          currentValid = valid;
        }}
      />
    );

    const input = screen.getByPlaceholderText('DD/MM/AAAA HH:MM') as HTMLInputElement;

    // Press backspace on input ending with '/' (browser deletes '/' leaving '12/06')
    fireEvent.change(input, { target: { value: '12/06' } });
    rerender(
      <DateTimeInput
        value={currentVal}
        onChange={(val, valid) => {
          currentVal = val;
          currentValid = valid;
        }}
      />
    );

    // Should have deleted the separator '/' AND the preceding number '6', leaving '12/0'
    expect(currentVal).toBe('12/0');
    expect(currentValid).toBe(false);
  });
});
