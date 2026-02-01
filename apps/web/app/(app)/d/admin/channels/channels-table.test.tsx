import React from 'react';
import { render, screen } from '@testing-library/react';

import { ChannelsTable } from '@iconicedu/web/app/(app)/d/admin/channels/channels-table';
import type { AdminChannelRow } from '@iconicedu/web/lib/admin/channels';

const baseRow: AdminChannelRow = {
  id: 'channel-1',
  org_id: 'org-1',
  kind: 'channel',
  topic: 'General',
  icon_key: null,
  description: null,
  visibility: 'private',
  purpose: 'general',
  status: 'active',
  dm_key: null,
  posting_policy_kind: 'members-only',
  allow_threads: true,
  allow_reactions: true,
  primary_entity_kind: null,
  primary_entity_id: null,
  created_by_profile_id: null,
  created_at: '2025-01-01T00:00:00.000Z',
  archived_at: null,
  created_by: null,
  updated_at: '2025-01-01T00:00:00.000Z',
  updated_by: null,
  deleted_at: null,
  deleted_by: null,
  participantCount: 3,
};

describe('ChannelsTable', () => {
  it('renders channel rows', () => {
    render(<ChannelsTable rows={[baseRow]} />);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('general')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('links learning space channels to learning space pages', () => {
    const learningSpaceRow: AdminChannelRow = {
      ...baseRow,
      id: 'channel-2',
      topic: 'Algebra',
      purpose: 'learning-space',
      primary_entity_kind: 'learning_space',
    };

    render(<ChannelsTable rows={[baseRow, learningSpaceRow]} />);

    const generalLink = screen.getByRole('link', { name: 'General' });
    expect(generalLink).toHaveAttribute('href', '/d/c/channel-1');

    const learningSpaceLink = screen.getByRole('link', { name: 'Algebra' });
    expect(learningSpaceLink).toHaveAttribute('href', '/d/spaces/channel-2');
  });
});
