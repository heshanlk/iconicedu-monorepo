import type { LearningSpaceLinkVM } from '@iconicedu/shared-types';

export const MATH_LEARNING_LINKS: LearningSpaceLinkVM[] = [
  {
    label: 'Join Zoom',
    iconKey: 'video',
    url: 'https://zoom.us/j/98643123456',
    status: 'active',
  },
  {
    label: 'Classroom',
    iconKey: 'graduation-cap',
    url: 'https://classroom.example.com/math-3',
    status: 'active',
  },
  {
    label: 'Homework',
    iconKey: 'folder',
    url: 'https://drive.example.com/math-homework',
    status: 'active',
  },
  {
    label: 'Progress Tracker',
    iconKey: 'folder',
    url: 'https://portal.example.com/math-progress',
    status: 'inactive',
    hidden: true,
  },
];

export const SCIENCE_LEARNING_LINKS: LearningSpaceLinkVM[] = [
  {
    label: 'Join Session',
    iconKey: 'video',
    url: 'https://zoom.us/j/98100555112',
    status: 'active',
  },
  {
    label: 'Lab Notebook',
    iconKey: 'folder',
    url: 'https://drive.example.com/science-labs',
    status: 'active',
  },
  {
    label: 'Science Hub',
    iconKey: 'graduation-cap',
    url: 'https://classroom.example.com/science-5',
    status: 'active',
  },
];

export const ELA_LEARNING_LINKS: LearningSpaceLinkVM[] = [
  {
    label: 'Join Meet',
    iconKey: 'video',
    url: 'https://meet.google.com/ela-class',
    status: 'active',
  },
  {
    label: 'Writing Room',
    iconKey: 'graduation-cap',
    url: 'https://classroom.example.com/ela-6',
    status: 'active',
  },
  {
    label: 'Story Archive',
    iconKey: 'folder',
    url: 'https://drive.example.com/ela-stories',
    status: 'active',
  },
];

export const CHESS_LEARNING_LINKS: LearningSpaceLinkVM[] = [
  {
    label: 'Join Board',
    iconKey: 'video',
    url: 'https://zoom.us/j/98007771234',
    status: 'active',
  },
  {
    label: 'Practice Rooms',
    iconKey: 'graduation-cap',
    url: 'https://classroom.example.com/chess',
    status: 'active',
  },
  {
    label: 'Game Library',
    iconKey: 'folder',
    url: 'https://drive.example.com/chess-library',
    status: 'active',
  },
];
