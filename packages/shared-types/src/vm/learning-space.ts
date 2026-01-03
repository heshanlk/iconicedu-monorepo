import type { IdsBaseVM, ISODateTime, UUID } from './shared';
import type { ChannelVM } from './channel';
import type { ClassScheduleVM } from './class-schedule';
import type { UserProfileVM } from './profile';

export type LearningSpaceKindVM = 'one_on_one' | 'small_group' | 'large_class';
export type LearningSpaceStatusVM = 'active' | 'archived' | 'completed' | 'paused';

export type LearningSpaceLinkStatusVM = 'active' | 'inactive';

export interface LearningSpaceLinkVM {
  label: string;
  iconKey: string | null;
  url?: string | null;

  status?: LearningSpaceLinkStatusVM | null;
  hidden?: boolean | null;
}

export interface LearningSpaceBasicsVM {
  kind: LearningSpaceKindVM;
  status: LearningSpaceStatusVM;

  title: string;
  iconKey: string | null;

  subject?: string | null;
  description?: string | null;
}

export interface LearningSpaceChannelsVM {
  primaryChannel: ChannelVM;
  relatedChannels?: ChannelVM[];
}

export interface LearningSpaceScheduleVM {
  scheduleSeries?: ClassScheduleVM | null;
}

export interface LearningSpaceResourcesVM {
  links?: LearningSpaceLinkVM[] | null;
}

export interface LearningSpaceLifecycleVM {
  createdAt: ISODateTime;
  createdBy: UUID;
  archivedAt?: ISODateTime | null;
}

export interface LearningSpaceVM {
  ids: IdsBaseVM;
  basics: LearningSpaceBasicsVM;

  channels: LearningSpaceChannelsVM;

  schedule?: LearningSpaceScheduleVM;

  resources?: LearningSpaceResourcesVM;

  lifecycle: LearningSpaceLifecycleVM;

  participants: UserProfileVM[];
}
