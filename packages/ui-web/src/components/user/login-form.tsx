'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '../ui/field';
import { Input } from '../ui/input';
import { Logo } from '../icons/logo';
import { Lead } from '../ui/typography';

export interface LoginFormProps extends React.ComponentProps<'div'> {
  defaultEmail?: string;
  defaultPassword?: string;
  onEmailLogin?: (email: string) => void;
  onSignUp?: () => void;
  onContinueWithApple?: () => void;
  onContinueWithGoogle?: () => void;
}

export function LoginForm({
  className,
  defaultEmail = '',
  onEmailLogin,
  onContinueWithApple,
  onContinueWithGoogle,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = React.useState(defaultEmail);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onEmailLogin?.(email);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex items-center justify-center rounded-full p-1">
            <Logo aria-hidden="true" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-4xl font-extrabold">Welcome to Iconic</CardTitle>
          <CardDescription className="text-xl">
            Affordable private tutoring focused on real progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FieldDescription>
                  Enter your email and we&apos;ll send a secure one-time code to continue.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" className="w-full justify-center">
                  Continue
                </Button>
              </Field>
              <FieldSeparator>Or</FieldSeparator>
              <Field className="flex flex-col gap-3 py-2">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-center gap-2"
                  onClick={() => onContinueWithApple?.()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Apple
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-center gap-2"
                  onClick={() => onContinueWithGoogle?.()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{' '}
        <a
          href="#"
          className="font-medium text-primary underline-offset-4 hover:text-primary/80 hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="#"
          className="font-medium text-primary underline-offset-4 hover:text-primary/80 hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
