import type { ISODateTime, UUID } from './shared';
import type { ChannelVM } from './channel';
import type { ClassScheduleVM } from './class-schedule';
import type { UserProfileVM } from './profile';



export type LearningSpaceKindVM = 'one_on_one' | 'small_group' | 'large_class';

export type LearningSpaceStatusVM = 'active' | 'archived' | 'completed' | 'paused';
export interface LearningSpaceLink {
  label: string;
  iconKey: string | null;
  url?: string | null;
  status?: 'active' | 'inactive' | null;
  hidden?: boolean | null;
}

export interface LearningSpaceVM {
  id: UUID;
  orgId: UUID;

  kind: LearningSpaceKindVM;
  status: LearningSpaceStatusVM;

  title: string; // e.g. "Senya • Math • Ms. Marina"
  iconKey: string | null;
  subject?: string | null;
  description?: string | null;

  
  primaryChannel: ChannelVM; // main class chat channel
  relatedChannels?: ChannelVM[]; // optional (parents-only, announcements, etc.)

  
  scheduleSeries?: ClassScheduleVM | null;

  
  links?: LearningSpaceLink[] | null;

  createdAt: ISODateTime;
  createdBy: UUID;
  archivedAt?: ISODateTime | null;

  participants: UserProfileVM[];
}
