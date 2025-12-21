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
    },
  ],
  classRooms: [
    {
      title: 'ELA with Ms Marina',
      url: '#',
      icon: Languages,
      items: [
        {
          title: 'Chat',
          url: '#',
        },
        {
          title: 'Homework',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Chess with Ms Perera',
      url: '#',
      icon: ChefHat,
      items: [
        {
          title: 'Chat',
          url: '#',
        },
        {
          title: 'Homework',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Social Studies with Mr Silva',
      url: '#',
      icon: Earth,
      items: [
        {
          title: 'Chat',
          url: '#',
        },
        {
          title: 'Homework',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Maths with Ms Wikramasinghe',
      url: '#',
      icon: SquarePi,
      items: [
        {
          title: 'Chat',
          url: '#',
        },
        {
          title: 'Homework',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
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
  favorites: [
    {
      name: 'ELA with Ms Marina (Sameesha)',
      url: '#',
      icon: Star,
    },
    {
      name: 'Chess with Ms Perera (Heshan)',
      url: '#',
      icon: Star,
    },
    {
      name: 'Social Studies with Mr Silva (Nisitha)',
      url: '#',
      icon: Star,
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
};

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <SiteLogoWithName />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavFavorites favorites={data.favorites} />
        <NavClassrooms classrooms={data.classRooms} />
        <NavDirectMessages dms={data.DIRECT_MESSAGES} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
