'use client';

import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../ui/sidebar';
import { cn } from '../../lib/utils';

export function NavMain({
  items,
}: {
  items: {
    count?: number;
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    color?: string;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}>
              <a href={item.url}>
                <item.icon className={cn(item.color)} />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            {item.count && (
              <SidebarMenuBadge className="bg-destructive/20 text-destructive peer-hover/menu-button:text-destructive peer-data-active/menu-button:text-destructive">
                {item.count}
              </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
