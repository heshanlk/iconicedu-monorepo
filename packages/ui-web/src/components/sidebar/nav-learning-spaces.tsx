'use client';
import {
  ChefHat,
  ChevronDown,
  ChevronUp,
  Earth,
  Languages,
  ListXIcon,
  MessageSquarePlus,
  MoreHorizontal,
  SquarePi,
  StarOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LearningSpaceVM, SidebarChildVM } from '@iconicedu/shared-types';

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
import { ThemedIconBadge } from '../shared/themed-icon';

export function NavLearningSpaces({
  learningSpaces,
  title,
  child,
  isOpen,
  onOpenChange,
  activeChannelId,
}: {
  learningSpaces: LearningSpaceVM[];
  title: string;
  child: SidebarChildVM;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeChannelId?: string | null;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="flex cursor-pointer items-center gap-2 rounded-md rounded-b-none px-2 py-1 uppercase">
            <AvatarWithStatus
              name={child.profile.displayName}
              showStatus={false}
              themeKey={child.ui?.themeKey}
              sizeClassName="size-5"
              fallbackClassName={cn(
                'text-[10px] font-semibold leading-none uppercase',
              )}
              initialsLength={1}
            />
            <span className="flex-1">{title.split(' ')[0]}</span>
            {isOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-md rounded-t-none">
          {learningSpaces.length === 0 ? (
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
              {learningSpaces.map((space) => {
                const channel = space.channels.primaryChannel;
                const iconKey = space.basics.iconKey ?? channel.basics.iconKey ?? null;
                const Icon: LucideIcon = iconKey
                  ? (LEARNING_SPACE_ICONS[iconKey] ?? Languages)
                  : Languages;
                const isActive = activeChannelId === channel.ids.id;

                return (
                  <SidebarMenuItem key={space.ids.id} className="py-0.5">
                    <SidebarMenuButton
                      asChild
                      tooltip={space.basics.title}
                      isActive={isActive}
                      className="px-2.5"
                    >
                      <a href={`/spaces/${channel.ids.id}`}>
                        <ThemedIconBadge
                          icon={Icon}
                          themeKey={channel.ui?.themeKey ?? null}
                          size="md"
                          className="shrink-0 rounded-full"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {space.basics.title}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {space.basics.subject ?? 'General'}
                          </div>
                        </div>
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
                );
              })}
            </SidebarMenu>
          )}
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

const LEARNING_SPACE_ICONS: Record<string, LucideIcon> = {
  languages: Languages,
  'chef-hat': ChefHat,
  earth: Earth,
  'square-pi': SquarePi,
};
