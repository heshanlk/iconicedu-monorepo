'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { SidebarLeftDataVM } from '@iconicedu/shared-types';
import { SidebarLeft, SidebarInset } from '@iconicedu/ui-web';
import { createSupabaseBrowserClient } from '../../../lib/supabase/client';

const AVATAR_BUCKET = 'public-avatars';
const AVATAR_SIGNED_URL_TTL = 60 * 60;

export function SidebarShell({
  children,
  data,
  forceProfileCompletion,
  forceAccountCompletion,
}: {
  children: ReactNode;
  data: SidebarLeftDataVM;
  forceProfileCompletion?: boolean;
  forceAccountCompletion?: boolean;
}) {
  const pathname = usePathname();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);
  const [sidebarData, setSidebarData] = React.useState(data);

  React.useEffect(() => {
    setSidebarData(data);
  }, [data]);

  const handleLogout = React.useCallback(async () => {
    await supabase.auth.signOut();
    window.location.assign('/login');
  }, [supabase]);

  const handleProfileSave = React.useCallback(
    async (input: {
      profileId: string;
      orgId: string;
      displayName: string;
      firstName: string;
      lastName: string;
      bio?: string | null;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: input.displayName,
          first_name: input.firstName,
          last_name: input.lastName,
          bio: input.bio ?? null,
        })
        .eq('id', input.profileId)
        .eq('org_id', input.orgId);

      if (error) {
        throw error;
      }

      setSidebarData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          profile: {
            ...prev.user.profile,
            profile: {
              ...prev.user.profile.profile,
              displayName: input.displayName,
              firstName: input.firstName,
              lastName: input.lastName,
              bio: input.bio ?? null,
            },
          },
        },
      }));
    },
    [supabase],
  );

  const handleAccountUpdate = React.useCallback(
    async (input: {
      accountId: string;
      orgId: string;
      phoneE164?: string | null;
      whatsappE164?: string | null;
      phoneVerified?: boolean;
      whatsappVerified?: boolean;
      preferredContactChannels?: string[] | null;
    }) => {
      const updates: Record<string, string | boolean | string[] | null | undefined> = {};
      const now = new Date().toISOString();

      if (input.phoneE164 !== undefined) {
        updates.phone_e164 = input.phoneE164;
      }
      if (input.whatsappE164 !== undefined) {
        updates.whatsapp_e164 = input.whatsappE164;
      }
      if (input.phoneVerified !== undefined) {
        updates.phone_verified = input.phoneVerified;
        updates.phone_verified_at = input.phoneVerified ? now : null;
      }
      if (input.whatsappVerified !== undefined) {
        updates.whatsapp_verified = input.whatsappVerified;
        updates.whatsapp_verified_at = input.whatsappVerified ? now : null;
      }
      if (input.preferredContactChannels !== undefined) {
        updates.preferred_contact_channels = input.preferredContactChannels;
      }

      const { error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', input.accountId)
        .eq('org_id', input.orgId);

      if (error) {
        throw error;
      }

      setSidebarData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          account: prev.user.account
            ? {
                ...prev.user.account,
                contacts: {
                  ...prev.user.account.contacts,
                  phoneE164:
                    input.phoneE164 !== undefined
                      ? input.phoneE164
                      : prev.user.account.contacts.phoneE164,
                  whatsappE164:
                    input.whatsappE164 !== undefined
                      ? input.whatsappE164
                      : prev.user.account.contacts.whatsappE164,
                  phoneVerified:
                    input.phoneVerified !== undefined
                      ? input.phoneVerified
                      : prev.user.account.contacts.phoneVerified,
                  phoneVerifiedAt:
                    input.phoneVerified !== undefined
                      ? input.phoneVerified
                        ? now
                        : null
                      : prev.user.account.contacts.phoneVerifiedAt,
                  whatsappVerified:
                    input.whatsappVerified !== undefined
                      ? input.whatsappVerified
                      : prev.user.account.contacts.whatsappVerified,
                  whatsappVerifiedAt:
                    input.whatsappVerified !== undefined
                      ? input.whatsappVerified
                        ? now
                        : null
                      : prev.user.account.contacts.whatsappVerifiedAt,
                  preferredContactChannels:
                    input.preferredContactChannels !== undefined
                      ? input.preferredContactChannels
                      : prev.user.account.contacts.preferredContactChannels,
                },
              }
            : prev.user.account,
        },
      }));
    },
    [supabase],
  );

  const handlePrefsUpdate = React.useCallback(
    async (input: {
      profileId: string;
      orgId: string;
      timezone?: string;
      locale?: string | null;
      languagesSpoken?: string[] | null;
      themeKey?: string | null;
    }) => {
      const updates: Record<string, string | string[] | null | undefined> = {};

      if (input.timezone !== undefined) {
        updates.timezone = input.timezone;
      }
      if (input.locale !== undefined) {
        updates.locale = input.locale;
      }
      if (input.languagesSpoken !== undefined) {
        updates.languages_spoken = input.languagesSpoken;
      }
      if (input.themeKey !== undefined) {
        updates.ui_theme_key = input.themeKey;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', input.profileId)
        .eq('org_id', input.orgId);

      if (error) {
        throw error;
      }

      setSidebarData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          profile: {
            ...prev.user.profile,
            prefs: {
              ...prev.user.profile.prefs,
              timezone:
                input.timezone !== undefined
                  ? input.timezone
                  : prev.user.profile.prefs.timezone,
              locale:
                input.locale !== undefined
                  ? input.locale
                  : prev.user.profile.prefs.locale,
              languagesSpoken:
                input.languagesSpoken !== undefined
                  ? input.languagesSpoken
                  : prev.user.profile.prefs.languagesSpoken,
            },
            ui: {
              ...prev.user.profile.ui,
              themeKey:
                input.themeKey !== undefined
                  ? input.themeKey
                  : prev.user.profile.ui?.themeKey,
            },
          },
        },
      }));
    },
    [supabase],
  );

  const handleLocationUpdate = React.useCallback(
    async (input: {
      profileId: string;
      orgId: string;
      city: string;
      region: string;
      postalCode: string;
      countryCode?: string | null;
      countryName?: string | null;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          city: input.city,
          region: input.region,
          postal_code: input.postalCode,
          country_code: input.countryCode ?? null,
          country_name: input.countryName ?? null,
        })
        .eq('id', input.profileId)
        .eq('org_id', input.orgId);

      if (error) {
        throw error;
      }

      setSidebarData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          profile: {
            ...prev.user.profile,
            location: {
              ...prev.user.profile.location,
              city: input.city,
              region: input.region,
              postalCode: input.postalCode,
              countryCode: input.countryCode ?? null,
              countryName: input.countryName ?? null,
            },
          },
        },
      }));
    },
    [supabase],
  );

  const handleAvatarUpload = React.useCallback(
    async (input: { profileId: string; orgId: string; file: File }) => {
      const { file, profileId, orgId } = input;

      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be 5MB or less.');
      }

      const rawExt = file.name.split('.').pop()?.toLowerCase();
      const extension = rawExt && rawExt !== file.name ? rawExt : 'jpg';
      const baseName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-z0-9-_]/gi, '-')
        .toLowerCase();
      const fileName = `${baseName || 'avatar'}-${Date.now()}.${extension}`;
      const path = `${orgId}/${profileId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: signedData, error: signedError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .createSignedUrl(path, AVATAR_SIGNED_URL_TTL);

      if (signedError || !signedData?.signedUrl) {
        throw new Error('Unable to create a signed photo URL.');
      }

      const updatedAt = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_source: 'upload',
          avatar_url: path,
          avatar_updated_at: updatedAt,
        })
        .eq('id', profileId)
        .eq('org_id', orgId);

      if (updateError) {
        throw updateError;
      }

      setSidebarData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          profile: {
            ...prev.user.profile,
            profile: {
              ...prev.user.profile.profile,
              avatar: {
                ...prev.user.profile.profile.avatar,
                source: 'upload',
                url: signedData.signedUrl,
                updatedAt,
              },
            },
          },
        },
      }));
    },
    [supabase],
  );

  return (
    <>
      <SidebarLeft
        data={sidebarData}
        activePath={pathname}
        onLogout={handleLogout}
        forceProfileCompletion={forceProfileCompletion}
        forceAccountCompletion={forceAccountCompletion}
        onProfileSave={handleProfileSave}
        onAccountUpdate={handleAccountUpdate}
        onPrefsSave={handlePrefsUpdate}
        onLocationSave={handleLocationUpdate}
        onAvatarUpload={handleAvatarUpload}
      />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
