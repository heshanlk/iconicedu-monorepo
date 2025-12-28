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
} from 'lucide-react';
import type { SidebarClassroomItem, SidebarChild } from '@iconicedu/shared-types';

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
import { cn } from '../../lib/utils';
import { Empty, EmptyContent } from '../../ui/empty';
import { AvatarWithStatus } from '../shared/avatar-with-status';

export function NavLearningSpaces({
  classrooms,
  title,
  child,
  defaultOpen = false,
}: {
  classrooms: SidebarClassroomItem[];
  title: string;
  child: SidebarChild;
  defaultOpen?: boolean;
}) {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="flex cursor-pointer items-center gap-2 rounded-md rounded-b-none px-2 py-1 uppercase">
            <AvatarWithStatus
              name={child.displayName}
              showStatus={false}
              sizeClassName="size-5"
              fallbackClassName={cn(
                'text-[10px] font-semibold leading-none uppercase',
                child.color,
              )}
              initialsLength={1}
            />
            <span className="flex-1">{title}</span>
            {isOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-md rounded-t-none">
          {classrooms.length === 0 ? (
            <Empty>
              <EmptyContent>
                <div className="flex">
                  <Button size={'lg'}>
                    <MessageSquarePlus /> Request a learning space
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
                          {/* <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                          </span> */}
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
