export const MESSAGE_ACTIONS = {
  REPLY: 'reply',
  BOOKMARK: 'bookmark',
  FORWARD: 'forward',
  COPY: 'copy',
  DELETE: 'delete',
} as const;

export const PLAYBACK_SPEEDS = [1, 1.5, 2] as const;

export const TIME_FORMATS = {
  SHORT: { hour: 'numeric', minute: '2-digit', hour12: true } as const,
  LONG: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  } as const,
};

export const ANIMATION_DELAYS = {
  REACTION_STAGGER: 50,
  REACTION_DURATION: 200,
} as const;
