'use client';

import { LoginForm } from '@iconicedu/ui-web';

export default function LoginPage() {
  const handleEmailLogin = (email: string) => {
    // Replace with real auth flow (e.g., call API or router action)
    console.info('Email login requested', { email });
  };

  const handleApple = () => {
    console.info('Continue with Apple');
  };

  const handleGoogle = () => {
    console.info('Continue with Google');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <LoginForm
            onEmailLogin={handleEmailLogin}
            onContinueWithApple={handleApple}
            onContinueWithGoogle={handleGoogle}
          />
        </div>
      </div>
    </div>
  );
}
