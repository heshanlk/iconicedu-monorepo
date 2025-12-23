'use client';

import { useState } from 'react';
import {
  ListXIcon,
  MoreHorizontal,
  StarOff,
  type LucideIcon,
} from 'lucide-react';

import { Collapsible } from '../../ui/collapsible';
import {
  SidebarGroup,
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
import { cn, getStudentInitials } from '../../lib/utils';

export function NavClassrooms({
  classrooms,
  title,
  student,
}: {
  classrooms: {
    name: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
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
}) {
  const { isMobile } = useSidebar();
  const [showAllClassrooms, setShowAllClassrooms] = useState(false);
  const maxVisibleClassrooms = 5;
  const visibleClassrooms = showAllClassrooms
    ? classrooms
    : classrooms.slice(0, maxVisibleClassrooms);
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
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">{title}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleClassrooms.map((item, index) => (
          <Collapsible key={`${item.name}-${index}`} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.name}>
                <a href={item.url}>
                  {renderClassroomAvatar()}
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
