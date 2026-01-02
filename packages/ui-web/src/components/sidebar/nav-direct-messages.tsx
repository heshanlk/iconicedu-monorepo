'use client';

import { MoreHorizontal, Plus, Share, StarOff, Trash2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../ui/sidebar';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { AvatarWithStatus } from '../shared/avatar-with-status';
import type { ChannelVM } from '@iconicedu/shared-types';

export function NavDirectMessages({
  dms,
  currentUserId,
  activeChannelId,
}: {
  dms: ChannelVM[];
  currentUserId: string;
  activeChannelId?: string | null;
}) {
  const { isMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">Direct Messages</SidebarGroupLabel>
      <SidebarGroupAction title="Add Project">
        <Plus /> <span className="sr-only">Add Project</span>
      </SidebarGroupAction>
      <SidebarMenu>
        {dms.map((item) => {
          const isActive = item.ids.id === activeChannelId;
          const otherParticipant =
            item.collections.participants.find(
              (participant) => participant.ids.accountId !== currentUserId,
            ) ?? item.collections.participants[0];
          const name = otherParticipant?.profile.displayName ?? item.basics.topic;
          const unreadCount = item.collections.readState?.unreadCount ?? 0;
          return (
            <SidebarMenuItem key={item.ids.id} className="py-1">
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="px-2.5 group-data-[collapsible=icon]:px-0"
              >
                <a href={`/d/dm/${item.ids.id}`}>
                  <AvatarWithStatus
                    name={name}
                    avatar={otherParticipant?.profile.avatar}
                    presence={otherParticipant?.presence}
                    themeKey={otherParticipant?.ui?.themeKey}
                    sizeClassName="size-7"
                    statusClassName="bottom-0 right-0 h-2 w-2 border border-background"
                    fallbackClassName="text-xs font-medium"
                    initialsLength={1}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{name}</div>
                    {(otherParticipant?.presence?.state?.emoji ||
                      otherParticipant?.presence?.state?.text) && (
                      <div className="truncate text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          {otherParticipant?.presence?.state?.emoji ? (
                            <span>{otherParticipant.presence.state.emoji}</span>
                          ) : null}
                          {otherParticipant?.presence?.state?.text ? (
                            <span className="truncate">
                              {otherParticipant.presence.state.text}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="ml-auto h-5 px-1.5 text-[10px] group-data-[collapsible=icon]:hidden">
                      {unreadCount}
                    </Badge>
                  )}
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <StarOff className="text-muted-foreground" />
                    <span>Add to Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Share className="text-muted-foreground" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
