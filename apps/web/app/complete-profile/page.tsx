'use client';

import { CompleteProfileForm } from '@iconicedu/ui-web';

export default function CompleteProfilePage() {
  const handleSubmit = (data: Record<string, FormDataEntryValue>) => {
    console.info('Complete profile submitted', data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <CompleteProfileForm onSubmitProfile={handleSubmit} />
      </div>
    </div>
  );
}
