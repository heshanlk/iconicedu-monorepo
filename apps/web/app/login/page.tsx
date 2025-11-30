'use client';

import { LoginForm } from '@iconicedu/ui-web';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleEmailLogin = (email: string) => {
    // Replace with real auth flow (e.g., call API or router action)
    console.info('Email login requested', { email });
    router.push('/code');
  };

  const handleApple = () => {
    console.info('Continue with Apple');
    router.push('/complete-profile');
  };

  const handleGoogle = () => {
    console.info('Continue with Google');
    router.push('/complete-profile');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
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
