// class-space.ts
import type { ISODateTime, UUID } from './shared';
import type { ChannelVM } from './channel';
import type { ClassScheduleVM } from './class-schedule';
import type { UserProfileVM } from './profile';

/**
 * A "Class Space" is the aggregate users think of as "the class".
 * It references channel(s) + schedule series by ID only (no heavy coupling).
 */

export type ClassSpaceKindVM = 'one_on_one' | 'small_group' | 'large_class';

export type ClassSpaceStatusVM = 'active' | 'archived' | 'completed' | 'paused';

// Zoom / Meet link,  Google Classroom link, Drive folder, etc.
export interface ClassSpaceLink {
  label: string;
  iconKey: string | null;
  url?: string | null;
  status?: 'active' | 'inactive' | null;
  hidden?: boolean | null;
}

export interface ClassSpaceVM {
  id: UUID;
  orgId: UUID;

  kind: ClassSpaceKindVM;
  status: ClassSpaceStatusVM;

  title: string; // e.g. "Senya • Math • Ms. Marina"
  iconKey: string | null;
  subject?: string | null;
  description?: string | null;

  /**
   * Glue references
   */
  primaryChannel: ChannelVM; // main class chat channel
  relatedChannels?: ChannelVM[]; // optional (parents-only, announcements, etc.)

  /**
   * Optional pointer to the main recurring schedule series (if class has sessions).
   * This keeps schedule decoupled from channels and reusable for teacher calendars.
   */
  scheduleSeries?: ClassScheduleVM | null;

  /**
   * Quick links shown in the Info panel.
   */
  links?: ClassSpaceLink[] | null;

  createdAt: ISODateTime;
  createdBy: UUID;
  archivedAt?: ISODateTime | null;

  participants: UserProfileVM[];
}
