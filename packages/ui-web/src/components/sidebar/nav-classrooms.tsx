'use client';
import { useState } from 'react';
import {
  CircleCheck,
  ListFilterPlus,
  ListXIcon,
  MoreHorizontal,
  StarOff,
  type LucideIcon,
} from 'lucide-react';

import { Collapsible } from '../../ui/collapsible';
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
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

export function NavClassrooms({
  classrooms,
}: {
  classrooms: {
    name: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { isMobile } = useSidebar();
  const [showAllClassrooms, setShowAllClassrooms] = useState(false);
  const maxVisibleClassrooms = 5;
  const visibleClassrooms = showAllClassrooms
    ? classrooms
    : classrooms.slice(0, maxVisibleClassrooms);
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">Classrooms</SidebarGroupLabel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarGroupAction title="Filter by student">
            <ListFilterPlus />
            <span className="sr-only">Filter by student</span>
          </SidebarGroupAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
        >
          <DropdownMenuItem>
            <CircleCheck className="text-primary" />
            <span>View All</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <CircleCheck className="text-muted-foreground" />
            <span>Shameesha Ahmed</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CircleCheck className="text-muted-foreground" />
            <span>Shanum Ahmed</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SidebarMenu>
        {visibleClassrooms.map((item) => (
          <Collapsible key={item.name} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.name}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
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
                  <DropdownMenuItem className="text-red-400">
                    <ListXIcon className="text-red-500" />
                    <span>Hide</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        {classrooms.length > maxVisibleClassrooms && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setShowAllClassrooms((prev) => !prev)}>
              <MoreHorizontal />
              <span>{showAllClassrooms ? 'Hide' : 'More'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
