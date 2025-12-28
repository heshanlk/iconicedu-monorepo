'use client';

import * as React from 'react';
import { MessageSquarePlus, MoreHorizontal, Settings, UserPlus } from 'lucide-react';
import {
  Calendar,
  ChefHat,
  Earth,
  Home,
  Inbox,
  Languages,
  LifeBuoy,
  Send,
  SquarePi,
} from 'lucide-react';

import { NavLearningSpaces } from './nav-learning-spaces';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '../../ui/sidebar';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { NavMain } from './nav-main';
import { NavDirectMessages } from './nav-direct-messages';
import { SiteLogoWithName } from '../site-logo-wt-name';
import { Empty } from '../../ui/empty';
import { EmptyContent } from '../../ui/empty';
import type {
  SidebarClassroomItem,
  SidebarIconKey,
  SidebarLeftData,
  SidebarNavItem,
  SidebarSecondaryItem,
} from '@iconicedu/shared-types';

const ICONS = {
  home: Home,
  calendar: Calendar,
  inbox: Inbox,
  languages: Languages,
  'chef-hat': ChefHat,
  earth: Earth,
  'square-pi': SquarePi,
  'life-buoy': LifeBuoy,
  send: Send,
} as const;

export function SidebarLeft({
  data,
  ...props
}: React.ComponentProps<typeof Sidebar> & { data: SidebarLeftData }) {
  const navMain: SidebarNavItem[] = data.navMain.map((item) => ({
    ...item,
    icon: ICONS[item.icon],
  }));
  const classrooms: SidebarClassroomItem[] = data.CLASSROOMS.map((item) => ({
    ...item,
    icon: ICONS[item.icon],
  }));
  const navSecondary: SidebarSecondaryItem[] = data.navSecondary.map((item) => ({
    ...item,
    icon: ICONS[item.icon],
  }));

  const children =
    'children' in data.user ? data.user.children?.items ?? [] : [];
  const classroomsByChild = children.map((child) => ({
    child,
    classrooms: classrooms.filter((classroom) =>
      classroom.participants.includes(child.accountId),
    ),
  }));

  const { isMobile } = useSidebar();
  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <SiteLogoWithName />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <SidebarSeparator className="mx-2 group-data-[collapsible=icon]:hidden" />
        {'children' in data.user ? (
          <>
            <SidebarGroup className="pb-0">
              <SidebarGroupLabel asChild className="uppercase">
                <span>Learning spaces</span>
              </SidebarGroupLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarGroupAction title="Learning space actions">
                    <MoreHorizontal />
                    <span className="sr-only">Learning space actions</span>
                  </SidebarGroupAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <UserPlus className="text-muted-foreground" />
                    <span>Add a child</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquarePlus className="text-muted-foreground" />
                    <span>Request a learning space</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="text-muted-foreground" />
                    <span>Manage learning spaces</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <SidebarGroupContent />
            </SidebarGroup>
            {classroomsByChild.length === 0 ? (
              <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupContent>
                  <Empty>
                    <EmptyContent>
                      <div className="flex">
                        <Button size="lg">
                          <UserPlus /> Add a Child
                        </Button>
                      </div>
                    </EmptyContent>
                  </Empty>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : (
              classroomsByChild.map(({ child, classrooms }, index) => (
                <NavLearningSpaces
                  key={child.accountId}
                  title={child.displayName}
                  child={child}
                  classrooms={classrooms}
                  defaultOpen={index === 0}
                />
              ))
            )}
          </>
        ) : null}
        <SidebarSeparator className="mx-2" />
        <NavDirectMessages dms={data.DIRECT_MESSAGES} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
