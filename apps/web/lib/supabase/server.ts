import { createServerClient } from '@supabase/ssr';
import { cookies, type RequestCookies } from 'next/headers';

type CreateSupabaseServerClientOptions = {
  cookieStore?: RequestCookies;
  allowCookieModification?: boolean;
};

export const createSupabaseServerClient = async ({
  cookieStore,
  allowCookieModification = false,
}: CreateSupabaseServerClientOptions = {}) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables.');
  }

  const resolvedCookieStore = cookieStore ?? (await cookies());

  return createServerClient(url, anonKey, {
    cookies: {
      get(name) {
        return resolvedCookieStore.get(name)?.value;
      },
      set(name, value, options) {
        if (!allowCookieModification) {
          return;
        }
        resolvedCookieStore.set({ name, value, ...options });
      },
      remove(name, options) {
        if (!allowCookieModification) {
          return;
        }
        resolvedCookieStore.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });
};
