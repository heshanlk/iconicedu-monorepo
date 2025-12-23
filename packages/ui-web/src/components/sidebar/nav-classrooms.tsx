'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ListXIcon,
  MessageSquareDot,
  MessageSquarePlus,
  MoreHorizontal,
  StarOff,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible';
import { Button } from '../../ui/button';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
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
import { cn, getInitials } from '../../lib/utils';
import { Empty, EmptyContent } from '../../ui/empty';

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
    hasUnread?: boolean;
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
      {getInitials(student.name, 1)}
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
          {classrooms.length === 0 ? (
            <Empty>
              <EmptyContent>
                <div className="flex">
                  <Button size={'lg'}>
                    <MessageSquarePlus /> Request a Class
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          ) : (
            <SidebarMenu>
              {classrooms.map((item, index) => (
                <SidebarMenuItem key={`${item.name}-${index}`}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <a href={item.url}>
                      {item.hasUnread ? (
                        <>
                          <item.icon />
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                          </span>
                        </>
                      ) : (
                        <item.icon />
                      )}
                      <span className={cn(item.hasUnread && 'font-semibold')}>
                        {item.name}
                      </span>
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
              ))}
            </SidebarMenu>
          )}
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}
