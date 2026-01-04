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
}: {
  children: ReactNode;
  data: SidebarLeftDataVM;
  forceProfileCompletion?: boolean;
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
        onProfileSave={handleProfileSave}
        onAvatarUpload={handleAvatarUpload}
      />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
