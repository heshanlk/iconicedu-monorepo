import { useState, useCallback } from 'react';

export type SidebarContent = 'thread' | 'profile' | 'saved-messages' | null;

export function useDMSidebar() {
  const [sidebarContent, setSidebarContent] = useState<SidebarContent>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const openProfile = useCallback((userId: string) => {
    setProfileUserId(userId);
    setSidebarContent('profile');
  }, []);

  const openThread = useCallback(() => {
    setSidebarContent('thread');
  }, []);

  const openSavedMessages = useCallback(() => {
    setSidebarContent('saved-messages');
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarContent(null);
    setProfileUserId(null);
  }, []);

  return {
    sidebarContent,
    profileUserId,
    openProfile,
    openThread,
    openSavedMessages,
    closeSidebar,
  };
}
