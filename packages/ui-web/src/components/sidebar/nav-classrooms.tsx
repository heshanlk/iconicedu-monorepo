'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ListXIcon,
  MoreHorizontal,
  StarOff,
  type LucideIcon,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '../../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { cn, getStudentInitials } from '../../lib/utils';

export function NavClassrooms({
  classrooms,
  title,
  student,
  defaultOpen = false,
}: {
  classrooms: {
    name: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    unreadCount?: number;
    showMenuOnUnread?: boolean;
    participants: number[];
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  title: string;
  student: {
    id: number;
    name: string;
    color: string;
  };
  defaultOpen?: boolean;
}) {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const renderClassroomAvatar = () => (
    <span
      className={cn(
        'flex size-5 items-center justify-center rounded-full text-[10px] font-semibold leading-none uppercase',
        student.color,
      )}
    >
      {getStudentInitials(student.name)}
    </span>
  );

  return (
    <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="flex cursor-pointer items-center gap-2 rounded-md rounded-b-none px-2 py-1 uppercase data-[state=open]:bg-chart-1/10">
            {renderClassroomAvatar()}
            <span className="flex-1">{title}</span>
            {isOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:bg-chart-1/10 rounded-md rounded-t-none">
          <SidebarMenu>
            {classrooms.map((item, index) => (
              <SidebarMenuItem key={`${item.name}-${index}`}>
                <SidebarMenuButton asChild tooltip={item.name}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
                {item.unreadCount && item.unreadCount > 0 && !item.showMenuOnUnread ? (
                  <SidebarMenuBadge>{item.unreadCount}</SidebarMenuBadge>
                ) : (
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
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}
