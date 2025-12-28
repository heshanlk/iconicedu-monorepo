import {
  Mail,
  Phone,
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
import type { GradeLevel, UserProfile } from '@iconicedu/shared-types';

interface ProfileSheetProps {
  user: UserProfile & {
    role?: string;
    email?: string;
    phone?: string;
    joinedDate?: Date;
    headline?: string | null;
    bio?: string | null;
    subjects?: string[] | null;
    gradesSupported?: GradeLevel[] | null;
    experienceYears?: number | null;
    certifications?: Array<{
      name: string;
      issuer?: string;
      year?: number;
    }> | null;
    childrenNames?: string[];
  };
}

export function ProfileSheet({ user }: ProfileSheetProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-3 p-6">
          <AvatarWithStatus
            name={user.displayName}
            avatar={user.avatar.url ?? ''}
            showStatus={false}
            sizeClassName="h-20 w-20"
            statusClassName="bottom-1 right-1 h-4 w-4"
            fallbackClassName="text-2xl"
            initialsLength={1}
          />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
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

        <div className="space-y-4 p-4">
          <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
          <div className="space-y-3">
            {user.email && (
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{user.email}</p>
                </div>
              </div>
            )}
            {user.phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4 p-4">
          <h3 className="text-sm font-semibold text-foreground">About</h3>
          <div className="space-y-3">
            {user.headline && (
              <div className="flex items-start gap-3">
                <Megaphone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Headline</p>
                  <p className="text-sm text-foreground">{user.headline}</p>
                </div>
              </div>
            )}
            {user.bio && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Bio</p>
                  <p className="text-sm text-foreground">{user.bio}</p>
                </div>
              </div>
            )}
            {user.subjects?.length ? (
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Subjects</p>
                  <p className="text-sm text-foreground">{user.subjects.join(', ')}</p>
                </div>
              </div>
            ) : null}
            {user.gradesSupported?.length ? (
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Grades supported</p>
                  <p className="text-sm text-foreground">
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
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm text-foreground">
                    {user.experienceYears} years
                  </p>
                </div>
              </div>
            ) : null}
            {user.certifications?.length ? (
              <div className="flex items-start gap-3">
                <Award className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Certifications</p>
                  <p className="text-sm text-foreground">
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
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Children</p>
                  <p className="text-sm text-foreground">
                    {user.childrenNames.join(', ')}
                  </p>
                </div>
              </div>
            ) : null}
            {user.joinedDate && (
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Member since</p>
                  <p className="text-sm text-foreground">
                    {user.joinedDate.toLocaleDateString('en-US', {
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
    </>
  );
}
