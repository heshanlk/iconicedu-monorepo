'use client';

import { LoginForm } from '@iconicedu/ui-web';

export default function LoginPage() {
  const handleEmailLogin = (email: string, password: string) => {
    // Replace with real auth flow (e.g., call API or router action)
    console.info('Email login requested', { email, password });
  };

  const handleForgotPassword = () => {
    console.info('Forgot password flow requested');
  };

  const handleSignUp = () => {
    console.info('Sign up flow requested');
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
            onForgotPassword={handleForgotPassword}
            onSignUp={handleSignUp}
            onContinueWithApple={handleApple}
            onContinueWithGoogle={handleGoogle}
          />
        </div>
      </div>
    </div>
  );
}
