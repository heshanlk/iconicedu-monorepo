'use client';

import {
  Folder,
  MoreHorizontal,
  Share,
  StarOff,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    idle: 'bg-gray-400',
    offline: 'bg-gray-600',
  };
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
      <SidebarMenu>
        {dms.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <div className="relative">
                  <Avatar className="size-6">
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback className="text-xs font-medium">
                      {getInitials(item.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${statusColors[item.status as keyof typeof statusColors]}`}
                    aria-label={`Status: ${item.status}`}
                  />
                </div>
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
