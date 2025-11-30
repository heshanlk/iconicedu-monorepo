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
    <div className="login-screen">
      <div className="login-panel">
        <LoginForm
          onEmailLogin={handleEmailLogin}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSignUp}
          onContinueWithApple={handleApple}
          onContinueWithGoogle={handleGoogle}
        />
      </div>
    </div>
  );
}
