import {
  Calendar,
  BookOpen,
  GraduationCap,
  Award,
  Clock,
  Users,
  FileText,
  Megaphone,
} from 'lucide-react';
import { AvatarWithStatus } from '../shared/avatar-with-status';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { ProfileActions } from './profile-actions';
import type {
  ChannelFileItemVM,
  ChannelMediaItemVM,
  GradeLevelOption,
  UserProfileVM,
} from '@iconicedu/shared-types';
import { MediaFilesPanel } from './shared/media-files-panel';

export type ProfileDetailsUser = UserProfileVM & {
  role?: string;
  email?: string;
  phone?: string;
  joinedDate?: string;
  headline?: string | null;
  bio?: string | null;
  subjects?: string[] | null;
  gradesSupported?: GradeLevelOption[] | null;
  experienceYears?: number | null;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }> | null;
  childrenNames?: string[];
};

interface ProfileSheetProps {
  user: ProfileDetailsUser;
  media?: ChannelMediaItemVM[];
  files?: ChannelFileItemVM[];
  onCallClick?: () => void;
  onDmClick?: () => void;
  onScheduleClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
}

export function ProfileContent({
  user,
  media = [],
  files = [],
  onCallClick,
  onDmClick,
  onScheduleClick,
  onShareClick,
  onReportClick,
}: {
  user: ProfileDetailsUser;
  media?: ChannelMediaItemVM[];
  files?: ChannelFileItemVM[];
  onCallClick?: () => void;
  onDmClick?: () => void;
  onScheduleClick?: () => void;
  onShareClick?: () => void;
  onReportClick?: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col items-center gap-3 p-6 min-w-0">
        <AvatarWithStatus
          name={user.displayName}
          avatar={user.avatar}
          sizeClassName="h-20 w-20"
          statusClassName="bottom-1 right-1 h-4 w-4"
          fallbackClassName="text-2xl"
          initialsLength={1}
        />
        <div className="text-center min-w-0">
          <h2 className="text-lg font-semibold text-foreground break-words">
            {user.displayName}
          </h2>
          {user.status && (
            <p className="text-sm text-muted-foreground">{user.status}</p>
          )}
        </div>
        {user.role && (
          <Badge variant="secondary" className="text-xs">
            {user.role}
          </Badge>
        )}
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">Quick actions</h3>
        <ProfileActions
          onCallClick={onCallClick}
          onDmClick={onDmClick}
          onScheduleClick={onScheduleClick}
          onShareClick={onShareClick}
          onReportClick={onReportClick}
        />
      </div>

      <Separator />

      <div className="space-y-4 p-4 min-w-0">
        <MediaFilesPanel media={media} files={files} filterUserId={user.id} />
      </div>

      <div className="space-y-4 p-4 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">About</h3>
        <div className="space-y-3 min-w-0">
          {user.headline && (
            <div className="flex items-start gap-3">
              <Megaphone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Headline</p>
                <p className="text-sm text-foreground break-words">{user.headline}</p>
              </div>
            </div>
          )}
          {user.bio && (
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Bio</p>
                <p className="text-sm text-foreground break-words">{user.bio}</p>
              </div>
            </div>
          )}
          {user.subjects?.length ? (
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Subjects</p>
                <p className="text-sm text-foreground break-words">
                  {user.subjects.join(', ')}
                </p>
              </div>
            </div>
          ) : null}
          {user.gradesSupported?.length ? (
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Grades supported</p>
                <p className="text-sm text-foreground break-words">
                  {user.gradesSupported
                    .map((grade) => grade?.label)
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
          ) : null}
          {typeof user.experienceYears === 'number' ? (
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm text-foreground">{user.experienceYears} years</p>
              </div>
            </div>
          ) : null}
          {user.certifications?.length ? (
            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Certifications</p>
                <p className="text-sm text-foreground break-words">
                  {user.certifications
                    .map((cert) => {
                      if (cert.issuer && cert.year) {
                        return `${cert.name} (${cert.issuer}, ${cert.year})`;
                      }
                      if (cert.issuer) return `${cert.name} (${cert.issuer})`;
                      if (cert.year) return `${cert.name} (${cert.year})`;
                      return cert.name;
                    })
                    .join(', ')}
                </p>
              </div>
            </div>
          ) : null}
          {user.childrenNames?.length ? (
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Children</p>
                <p className="text-sm text-foreground break-words">
                  {user.childrenNames.join(', ')}
                </p>
              </div>
            </div>
          ) : null}
          {user.joinedDate && (
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm text-foreground">
                  {new Date(user.joinedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfileSheet({
  user,
  media,
  files,
  onCallClick,
  onDmClick,
  onScheduleClick,
  onShareClick,
  onReportClick,
}: ProfileSheetProps) {
  return (
    <ProfileContent
      user={user}
      media={media}
      files={files}
      onCallClick={onCallClick}
      onDmClick={onDmClick}
      onScheduleClick={onScheduleClick}
      onShareClick={onShareClick}
      onReportClick={onReportClick}
    />
  );
}
