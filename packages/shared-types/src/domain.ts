export type AppRole = 'parent' | 'teacher' | 'student' | 'advisor' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string | null;
  appRole: AppRole;
  createdAt: string;
}

export type ChannelType = 'class' | 'dm' | 'staff' | 'advisor';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  classId?: string | null;
  createdAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  createdAt: string;
}
