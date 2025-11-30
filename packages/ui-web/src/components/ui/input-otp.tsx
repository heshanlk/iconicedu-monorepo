'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

type OtpContextValue = {
  value: string;
  setValue: (next: string) => void;
  maxLength: number;
  rootRef: React.RefObject<HTMLDivElement>;
};

const OtpContext = React.createContext<OtpContextValue | null>(null);

export interface InputOTPProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any; // For additional props if needed
}

export function InputOTP({
  value,
  onChange,
  maxLength = 6,
  required,
  children,
  className,
  ...props
}: React.PropsWithChildren<InputOTPProps>) {
  const rootRef = React.useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  return (
    <OtpContext.Provider value={{ value, setValue: onChange, maxLength, rootRef }}>
      <div ref={rootRef} className={cn('flex', className)} {...props}>
        {children}
        {required ? (
          <input
            tabIndex={-1}
            aria-hidden
            className="hidden"
            value={value}
            readOnly
            required
          />
        ) : null}
      </div>
    </OtpContext.Provider>
  );
}

export function InputOTPGroup({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('flex', className)}>{children}</div>;
}

export function InputOTPSlot({ index }: { index: number }) {
  const ctx = React.useContext(OtpContext);
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (!ctx) return null;

  const { value, setValue, maxLength, rootRef } = ctx;
  const char = value[index] ?? '';

  const focusInputAt = (idx: number) => {
    const container = rootRef.current;
    if (!container) return;
    const inputs = container.querySelectorAll<HTMLInputElement>('input[data-otp-slot]');
    inputs[idx]?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextChar = e.target.value.slice(-1);
    const chars = value.split('');
    chars[index] = nextChar;
    const next = chars.join('').slice(0, maxLength);
    setValue(next);

    if (nextChar && index < maxLength - 1) {
      focusInputAt(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !char && index > 0) {
      focusInputAt(index - 1);
    }
  };

  return (
    <div className="flex">
      <input
        ref={inputRef}
        data-otp-slot
        data-otp-index={index}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        className="h-12 w-10 flex-shrink-0 rounded-md border border-input bg-card text-center text-lg font-semibold shadow-sm transition-colors focus:border-ring focus:outline-none sm:w-12"
        value={char}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label={`Digit ${index + 1}`}
      />
    </div>
  );
}

export function InputOTPSeparator({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('flex items-center px-1 text-muted-foreground', className)}>
      {children ?? '-'}
    </div>
  );
}
