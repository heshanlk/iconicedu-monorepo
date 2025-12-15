'use client';

import { Mail, Phone, School, Calendar, UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Badge } from '../../../ui/badge';
import { Separator } from '../../../ui/separator';
import type { User } from '../../../types/types';

interface ProfilePanelProps {
  user: User & {
    role?: string;
    email?: string;
    phone?: string;
    school?: string;
    grade?: string;
    studentName?: string;
    joinedDate?: Date;
  };
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-3 p-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-card bg-online" />
            )}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
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
            {user.studentName && (
              <div className="flex items-start gap-3">
                <UserIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="text-sm text-foreground">{user.studentName}</p>
                </div>
              </div>
            )}
            {user.grade && (
              <div className="flex items-start gap-3">
                <School className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Grade</p>
                  <p className="text-sm text-foreground">{user.grade}</p>
                </div>
              </div>
            )}
            {user.school && (
              <div className="flex items-start gap-3">
                <School className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">School</p>
                  <p className="text-sm text-foreground">{user.school}</p>
                </div>
              </div>
            )}
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
