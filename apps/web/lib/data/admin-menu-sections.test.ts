import { describe, expect, it } from 'vitest';

import { ADMIN_MENU_SECTIONS } from '@iconicedu/web/lib/data/admin-menu-sections';

describe('ADMIN_MENU_SECTIONS', () => {
  it('does not include announcements or support in channels menu', () => {
    const channelsSection = ADMIN_MENU_SECTIONS.find(
      (section) => section.title === 'Channels',
    );
    expect(channelsSection).toBeDefined();
    const titles = (channelsSection?.links ?? []).map((link) => link.title);
    expect(titles).not.toContain('Announcements');
    expect(titles).not.toContain('Support');
  });
});
