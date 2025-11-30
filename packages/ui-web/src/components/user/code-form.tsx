'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldDescription, FieldGroup } from '../ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../ui/input-otp';
import { GalleryVerticalEnd } from '../icons/icons';
import { H1 } from '../ui/typography';
import { Logo } from '../icons/logo';

export interface CodeFormProps extends React.ComponentProps<'div'> {
  defaultCode?: string;
  onVerifyCode?: (code: string) => void;
  onResendCode?: () => void;
}

export function CodeForm({
  className,
  defaultCode = '',
  onVerifyCode,
  onResendCode,
  ...props
}: CodeFormProps) {
  const maxLength = 6;
  const [code, setCode] = React.useState(defaultCode.slice(0, maxLength));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onVerifyCode?.(code.trim());
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex items-center justify-center rounded-full p-1">
            <Logo aria-hidden="true" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-4xl font-extrabold">
            Enter verification code
          </CardTitle>
          <CardDescription>Enter the 6-digit code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-5">
              <Field>
                <InputOTP
                  maxLength={6}
                  id="otp"
                  required
                  className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
                  value={code}
                  onChange={setCode}
                >
                  <InputOTPGroup className="gap-2.5">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2.5">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </Field>
              <Field>
                <Button type="submit" className="w-full justify-center">
                  Verify
                </Button>
                <FieldDescription className="text-center">
                  Didn&apos;t receive the code?{' '}
                  <a
                    href="#"
                    className="font-medium text-primary underline-offset-4 hover:text-primary/80 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      onResendCode?.();
                    }}
                  >
                    Resend
                  </a>
                  .
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
