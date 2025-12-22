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
  Send,
  SquarePi,
  Star,
} from 'lucide-react';

import { NavClassrooms } from './nav-classrooms';
import { NavFavorites } from './nav-favorites';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../ui/sidebar';
import { NavMain } from './nav-main';
import { NavDirectMessages } from './nav-direct-messages';
import { SiteLogoWithName } from '../site-logo-wt-name';
import { StudentFilterProvider } from './student-filter-context';

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
      name: 'ELA with Ms Norah',
      participants: [1, 2, 3],
      url: '#',
      icon: Languages,
      isFavorite: true,
    },
    {
      id: 2,
      name: 'ELA with Ms Norah',
      participants: [1, 2, 4],
      url: '#',
      icon: Languages,
      isFavorite: true,
    },
    {
      id: 3,
      name: 'ELA with Ms Norah',
      participants: [1, 2, 5],
      url: '#',
      icon: Languages,
      isFavorite: true,
    },
    {
      id: 4,
      name: 'Chess with Mr Rivi',
      participants: [1, 2, 3],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
    },
    {
      id: 5,
      name: 'Chess with Mr Rivi',
      participants: [1, 2, 4],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
    },
    {
      id: 6,
      name: 'Chess with Mr Rivi',
      participants: [1, 2, 5],
      url: '#',
      icon: ChefHat,
      isFavorite: true,
    },
    {
      id: 7,
      name: 'Maths with Mr Abhishek',
      participants: [1, 2, 3],
      url: '#',
      icon: Earth,
      isFavorite: true,
    },
    {
      id: 8,
      name: 'Maths with Ms Shenaly',
      participants: [1, 2, 4],
      url: '#',
      icon: SquarePi,
      isFavorite: false,
    },
    {
      id: 9,
      name: 'Maths with Ms Shenaly',
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
      name: 'Elias Smith',
    },
    {
      id: 4,
      name: 'Nailah Smith',
    },
    {
      id: 5,
      name: 'Zayne Smith',
    },
  ],
};

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <StudentFilterProvider students={data.STUDENTS}>
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
          <NavFavorites
            favorites={data.CLASSROOMS.filter((classroom) => classroom.isFavorite)}
          />
          <NavClassrooms classrooms={data.CLASSROOMS} />
          <NavDirectMessages dms={data.DIRECT_MESSAGES} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </StudentFilterProvider>
    </Sidebar>
  );
}
