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

import { NavClassrooms } from './nav-classrooms';
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

  const classroomsByStudent = data.STUDENTS.map((student) => ({
    student,
    classrooms: classrooms.filter((classroom) =>
      classroom.participants.includes(student.id),
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
        <SidebarGroup className="pb-0">
          <SidebarGroupLabel asChild className="uppercase">
            <span>Classrooms</span>
          </SidebarGroupLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarGroupAction title="Classroom actions">
                <MoreHorizontal />
                <span className="sr-only">Classroom actions</span>
              </SidebarGroupAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              side={isMobile ? 'bottom' : 'right'}
              align={isMobile ? 'end' : 'start'}
            >
              <DropdownMenuItem>
                <UserPlus className="text-muted-foreground" />
                <span>Add a student</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquarePlus className="text-muted-foreground" />
                <span>Request a class</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="text-muted-foreground" />
                <span>Manage classes</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SidebarGroupContent />
        </SidebarGroup>
        {classroomsByStudent.length === 0 ? (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
              <Empty>
                <EmptyContent>
                  <div className="flex">
                    <Button size={'lg'}>
                      <UserPlus /> Add a Student
                    </Button>
                  </div>
                </EmptyContent>
              </Empty>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          classroomsByStudent.map(({ student, classrooms }, index) => (
            <NavClassrooms
              key={student.id}
              title={student.name}
              student={student}
              classrooms={classrooms}
              defaultOpen={index === 0}
            />
          ))
        )}
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
