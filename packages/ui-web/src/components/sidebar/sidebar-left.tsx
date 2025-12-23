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
  MoreHorizontal,
  Send,
  SquarePi,
  Star,
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '../../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
      name: 'ELA • Ms Norah (Fri 6:00 pm)',
      participants: [1, 2, 3],
      url: '#',
      icon: Languages,
      isFavorite: true,
    },
    {
      id: 2,
      name: 'ELA • Ms Norah (Fri 7:00 pm)',
      participants: [1, 2, 4],
      url: '#',
      icon: Languages,
      isFavorite: true,
    },
    {
      id: 3,
      name: 'ELA • Ms Norah (Fri 8:00 pm)',
      participants: [1, 2, 5],
      url: '#',
      icon: Languages,
      isFavorite: true,
    },
    {
      id: 4,
      name: 'Chess • Mr Rivi (Sat 9:00 am)',
      participants: [1, 2, 3],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
    },
    {
      id: 5,
      name: 'Chess • Mr Rivi (Sat 10:00 am)',
      participants: [1, 2, 4],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
    },
    {
      id: 6,
      name: 'Chess • Mr Rivi (Sat 11:30 am)',
      participants: [1, 2, 5],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
    },
    {
      id: 7,
      name: 'Maths • Mr Abhishek (Sun 11:30 am)',
      participants: [1, 2, 3],
      url: '#',
      icon: Earth,
      isFavorite: true,
    },
    {
      id: 8,
      name: 'Maths • Ms Shenaly (Sun 9:30 am)',
      participants: [1, 2, 4],
      url: '#',
      icon: SquarePi,
      isFavorite: false,
    },
    {
      id: 9,
      name: 'Maths • Ms Shenaly (Sun 9:30 am)',
      participants: [1, 2, 5],
      url: '#',
      icon: SquarePi,
      isFavorite: false,
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
      name: 'Elyas Smith',
      color: 'bg-blue-500 text-white',
    },
    {
      id: 4,
      name: 'Nailah Smith',
      color: 'bg-red-500 text-white',
    },
    {
      id: 5,
      name: 'Zayne Smith',
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
        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="uppercase">
            <span>Classrooms</span>
          </SidebarGroupLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarGroupAction title="Classroom actions">
                <MoreHorizontal />
                <span className="sr-only">Classroom actions</span>
              </SidebarGroupAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Request class</DropdownMenuItem>
              <DropdownMenuItem>Manage classrooms</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
