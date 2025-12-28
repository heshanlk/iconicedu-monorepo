export type UUID = string;
export type ISODateTime = string;

export type AvatarSource = 'seed' | 'upload' | 'external';
export type AccountStatus = 'active' | 'invited' | 'suspended' | 'deleted';

// Stable persisted keys you can safely store/query
export type GradeLevelKey = string | number;

// UI-friendly grade option (dropdown, chips, etc.)
export type GradeLevelOption = {
  id: GradeLevelKey;
  label: string;
} | null;

// Generic pagination/connection shape for FE VMs
export interface ConnectionVM<T> {
  items: T[];
  nextCursor?: string | null;
  total?: number | null;
}
