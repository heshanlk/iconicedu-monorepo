'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { AvatarWithStatus } from '../../shared/avatar-with-status';
import type { UserProfileVM } from '@iconicedu/shared-types';

interface ProfilePanelProps {
  user?: UserProfileVM | null;
}

export const ProfilePanel = memo(function ProfilePanel({ user }: ProfilePanelProps) {
  if (!user) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Select a profile to view details.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center gap-3">
        <AvatarWithStatus
          name={user.displayName}
          avatar={user.avatar.url ?? ''}
          sizeClassName="h-10 w-10"
          initialsLength={1}
        />
        <div>
          <CardTitle className="text-sm">{user.displayName}</CardTitle>
          {user.status ? (
            <div className="text-xs text-muted-foreground">{user.status}</div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {user.bio ?? 'Profile details will appear here.'}
      </CardContent>
    </Card>
  );
});
