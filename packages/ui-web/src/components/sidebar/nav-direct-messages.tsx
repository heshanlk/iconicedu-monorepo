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
import { AvatarWithStatus } from '../shared/avatar-with-status';

export function NavDirectMessages({
  dms,
}: {
  dms: {
    name: string;
    avatar: string;
    status: string;
    url?: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">Direct Messages</SidebarGroupLabel>
      <SidebarGroupAction title="Add Project">
        <Plus /> <span className="sr-only">Add Project</span>
      </SidebarGroupAction>
      <SidebarMenu>
        {dms.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <AvatarWithStatus
                  name={item.name}
                  avatar={item.avatar}
                  status={item.status as 'online' | 'away' | 'idle' | 'offline'}
                  sizeClassName="size-6"
                  statusClassName="h-2 w-2 border border-background"
                  fallbackClassName="text-xs font-medium"
                />
                <span>{item.name}</span>
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
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
