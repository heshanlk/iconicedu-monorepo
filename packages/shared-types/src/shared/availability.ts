'use strict';

export const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export type DayAvailability = Record<DayKey, number[]>;

export const EMPTY_DAY_AVAILABILITY: DayAvailability = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};
