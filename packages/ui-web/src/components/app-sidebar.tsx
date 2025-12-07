'use client';

import * as React from 'react';
import {
  BookOpen,
  Bot,
  Calendar,
  Command,
  Frame,
  Home,
  Inbox,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
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
} from '../ui/sidebar';
import { NavMain } from './nav-main';
import { NavDirectMessages } from './nav-direct-messages';

const data = {
  user: {
    name: 'Heshan Wanigasooriya',
    email: 'heshanmw@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '#',
      icon: Home,
      isActive: true,
    },
    {
      title: 'Calendar',
      url: '#',
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
      icon: SquareTerminal,
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
      icon: Bot,
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
      icon: BookOpen,
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
      icon: Settings2,
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
      icon: Frame,
    },
    {
      name: 'Chess with Ms Perera (Heshan)',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Social Studies with Mr Silva (Nisitha)',
      url: '#',
      icon: Map,
    },
  ],
  dms: [
    {
      name: 'Ms Marina (ELA)',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Ms Wikramasinghe (Maths)',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Ms Fernando (Science)',
      url: '#',
      icon: Map,
    },
  ],
  DIRECT_MESSAGES: [
    {
      id: 1,
      name: 'Ms Wikramasinghe - Maths',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-alex-UoI6qSVh9rZS9DvLOmhIY8pabZfAOq.png',
      status: 'online' as const,
    },
    {
      id: 2,
      name: 'Ms Shenaly - Maths',
      avatar: '',
      status: 'away' as const,
    },
    {
      id: 3,
      name: 'Ms Marina Perera',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-jordan-ACflnHBYNP7M9crd5MtKL7WSpk3GiQ.jpg',
      status: 'online' as const,
    },
    {
      id: 4,
      name: 'Ms Mike Silva',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-mike-T2UMe9BlbWWIxlq7z99cJWqwEagAuc.jpg',
      status: 'offline' as const,
    },
    {
      id: 5,
      name: 'Mr Sarah Johnson',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/avatar-sarah-Vsp1gZWstExMvD0Qce0ogsgN6nv2pC.png',
      status: 'idle' as const,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ICONIC Academy</span>
                  <span className="truncate text-xs">Education first</span>
                </div>
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
