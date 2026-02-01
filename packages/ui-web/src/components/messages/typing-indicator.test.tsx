import React from 'react';
import { render, screen } from '@testing-library/react';

import { TypingIndicator } from './typing-indicator';
import type { UserProfileVM } from '@iconicedu/shared-types';

const makeProfile = (id: string, name: string): UserProfileVM =>
  ({
    ids: { id, orgId: 'org-1', accountId: `account-${id}` },
    kind: 'guardian',
    profile: {
      displayName: name,
      avatar: { url: null, source: 'seed' },
    },
    prefs: {},
    meta: {},
    ui: { themeKey: null },
    joinedDate: new Date().toISOString(),
  } as unknown as UserProfileVM);

describe('TypingIndicator', () => {
  it('renders nothing when no profiles', () => {
    const { container } = render(<TypingIndicator profiles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a single name', () => {
    render(<TypingIndicator profiles={[makeProfile('p1', 'Ava')]} />);
    expect(screen.getByText('Ava')).toBeInTheDocument();
    expect(screen.getAllByText(/Ava is typing/i).length).toBeGreaterThan(0);
  });

  it('renders multiple names summary', () => {
    render(
      <TypingIndicator
        profiles={[
          makeProfile('p1', 'Ava'),
          makeProfile('p2', 'Kai'),
          makeProfile('p3', 'Mia'),
        ]}
      />,
    );
    expect(screen.getByText('Ava and 2 others')).toBeInTheDocument();
    expect(
      screen.getAllByText(/Ava, Kai, and 1 others are typing/i).length,
    ).toBeGreaterThan(0);
  });
});
