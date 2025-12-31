export type UUID = string;
export type ISODateTime = string;
export type IANATimezone = string;

export type AvatarSource = 'seed' | 'upload' | 'external';
export type AccountStatus = 'active' | 'invited' | 'suspended' | 'deleted';
export type GradeLevelOption = {
  id: string | number;
  label: string;
} | null;
export interface ConnectionVM<T> {
  items: T[];
  nextCursor?: string | null;
  total?: number | null;
}

export type EntityRefVM =
  | { kind: 'learning_space'; id: UUID }
  | { kind: 'session'; id: UUID }
  | { kind: 'homework'; id: UUID }
  | { kind: 'summary'; id: UUID }
  | { kind: 'message'; id: UUID }
  | { kind: 'file'; id: UUID }
  | { kind: 'user'; id: UUID }
  | { kind: 'educator'; id: UUID }
  | { kind: 'guardian'; id: UUID }
  | { kind: 'child'; id: UUID }
  | { kind: 'staff'; id: UUID };
