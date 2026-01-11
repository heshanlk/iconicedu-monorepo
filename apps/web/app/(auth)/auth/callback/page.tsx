'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { createSupabaseBrowserClient } from '../../../../lib/supabase/client';

export default function CallbackPage() {
  const router = useRouter();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const token = searchParams.get('token');
    const type = (searchParams.get('type') ?? undefined) as
      | 'magiclink'
      | 'invitation'
      | 'signup'
      | undefined;

    const hashParams = new URLSearchParams(
      window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash,
    );
const accessToken = hashParams.get('access_token');
const refreshToken = hashParams.get('refresh_token');

    const finish = async () => {
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        router.replace('/d');
        return;
      }

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        router.replace('/d');
        return;
      }

      if (token) {
        await supabase.auth.verifyOtp({
          token,
          type: type ?? 'invite',
        });

        router.replace('/d');
      }
    };

    void finish();
  }, [router, supabase]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-sm text-muted-foreground">Logging you in…</p>
    </div>
  );
}
