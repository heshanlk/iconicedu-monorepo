'use client';

import * as React from 'react';
import {
  Calendar,
  ChefHat,
  Earth,
  Home,
  Inbox,
  Languages,
  LifeBuoy,
  MessageSquarePlus,
  MoreHorizontal,
  Send,
  Settings,
  SquarePi,
  Star,
  UserPlus,
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

const data = {
  user: {
    name: 'Heshan Wanigasooriya',
    email: 'heshanmw@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/dashboard',
      icon: Home,
      isActive: true,
    },
    {
      title: 'Calendar',
      url: '/dashboard/calendar',
      icon: Calendar,
    },
    {
      title: 'Inbox',
      url: '#',
      icon: Inbox,
      badge: '10',
      count: 8,
    },
  ],
  CLASSROOMS: [
    {
      id: 1,
      name: 'ELA • Ms Norah  • Fri 5 pm',
      participants: [1, 2, 3],
      url: '#',
      icon: Languages,
      isFavorite: true,
      hasUnread: true,
    },
    {
      id: 2,
      name: 'ELA • Ms Norah (Fri 4 pm)',
      participants: [1, 2, 4],
      url: '#',
      icon: Languages,
      isFavorite: true,
      hasUnread: false,
    },
    {
      id: 3,
      name: 'ELA • Ms Norah (Fri 6 pm)',
      participants: [1, 2, 5],
      url: '#',
      icon: Languages,
      isFavorite: true,
      hasUnread: true,
    },
    {
      id: 4,
      name: 'Chess • Mr Rivi • Sat 10 am',
      participants: [1, 2, 3],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
      hasUnread: false,
    },
    {
      id: 5,
      name: 'Chess • Mr Rivi (Fri 6 pm)',
      participants: [1, 2, 4],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
      hasUnread: true,
    },
    {
      id: 6,
      name: 'Chess • Mr Rivi (Fri 6 pm)',
      participants: [1, 2, 5],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
      hasUnread: false,
    },
    {
      id: 7,
      name: 'Math • Mr Abhishek (Fri 6 pm)',
      participants: [1, 2, 3],
      url: '#',
      icon: Earth,
      isFavorite: true,
      hasUnread: false,
    },
    {
      id: 8,
      name: 'Math • Ms Wikramasingha (Fri 6 pm)',
      participants: [1, 2, 4],
      url: '#',
      icon: SquarePi,
      isFavorite: false,
      hasUnread: false,
    },
    {
      id: 9,
      name: 'Math • Ms Shenaly (Fri 6 pm)',
      participants: [1, 2, 5],
      url: '#',
      icon: SquarePi,
      isFavorite: false,
      hasUnread: true,
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  DIRECT_MESSAGES: [
    {
      id: 1,
      name: 'Ms Wikramasinghe',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-alex-UoI6qSVh9rZS9DvLOmhIY8pabZfAOq.png',
      status: 'online' as const,
      url: '/dashboard/dm',
    },
    {
      id: 2,
      name: 'Shenaly Prakash',
      avatar: '',
      status: 'away' as const,
      url: '/dashboard/dm',
    },
    {
      id: 3,
      name: 'Ms Marina Perera',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-jordan-ACflnHBYNP7M9crd5MtKL7WSpk3GiQ.jpg',
      status: 'online' as const,
      url: '/dashboard/dm',
    },
    {
      id: 4,
      name: 'Ms Mike Silva',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
      status: 'offline' as const,
      url: '/dashboard/dm',
    },
    {
      id: 5,
      name: 'Mr Sarah Johnson',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
      status: 'idle' as const,
      url: '/dashboard/dm',
    },
  ],
  STUDENTS: [
    {
      id: 3,
      name: 'Elyas',
      color: 'bg-blue-500 text-white',
    },
    {
      id: 4,
      name: 'Nailah',
      color: 'bg-red-500 text-white',
    },
    {
      id: 5,
      name: 'Zayne',
      color: 'bg-violet-500 text-white',
    },
  ],
};

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const classroomsByStudent = data.STUDENTS.map((student) => ({
    student,
    classrooms: data.CLASSROOMS.filter((classroom) =>
      classroom.participants.includes(student.id),
    ),
  })).filter((group) => group.classrooms.length > 0);

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
        <NavMain items={data.navMain} />
        <SidebarSeparator className="mx-2 group-data-[collapsible=icon]:hidden" />
        <SidebarGroup>
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
                <span>Add student</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquarePlus className="text-muted-foreground" />
                <span>Request classes</span>
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
        {classroomsByStudent.map(({ student, classrooms }, index) => (
          <NavClassrooms
            key={student.id}
            title={student.name}
            student={student}
            classrooms={classrooms}
            defaultOpen={index === 0}
          />
        ))}
        <SidebarSeparator className="mx-2" />
        <NavDirectMessages dms={data.DIRECT_MESSAGES} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
