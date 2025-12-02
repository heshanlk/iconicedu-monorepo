'use client';

import { CompleteProfileForm } from '@iconicedu/ui-web';
import { useRouter } from 'next/navigation';

export default function CompleteProfilePage() {
  const router = useRouter();

  const handleSubmit = (data: Record<string, FormDataEntryValue>) => {
    console.info('Complete profile submitted', data);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <CompleteProfileForm onSubmitProfile={handleSubmit} />
      </div>
    </div>
  );
}
