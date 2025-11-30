'use client';

import { CodeForm } from '@iconicedu/ui-web';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleVerifyCode = (code: string) => {
    // Replace with real auth flow (e.g., call API or router action)
    console.info('Code verification requested', { code });
    router.push('/complete-profile');
  };

  const handleResend = () => {
    console.info('Resend code requested');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          <CodeForm onVerifyCode={handleVerifyCode} onResendCode={handleResend} />
        </div>
      </div>
    </div>
  );
}
