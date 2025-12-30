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
//# sourceMappingURL=shared.d.ts.map