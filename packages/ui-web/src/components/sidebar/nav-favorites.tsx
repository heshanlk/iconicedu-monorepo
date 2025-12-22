'use client';

import { useState } from 'react';
import {
  CircleCheck,
  ListFilterPlus,
  MoreHorizontal,
  StarOff,
  type LucideIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../ui/sidebar';
import { useStudentFilter } from './student-filter-context';

export function NavFavorites({
  favorites,
}: {
  favorites: {
    name: string;
    url: string;
    icon: LucideIcon;
    participants: number[];
  }[];
}) {
  const { isMobile } = useSidebar();
  const { students, selectedStudentBySection, setSelectedStudent } =
    useStudentFilter();
  const selectedStudentId = selectedStudentBySection.favorites;
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const maxVisibleFavorites = 3;
  const filteredFavorites =
    selectedStudentId === null
      ? favorites
      : favorites.filter((favorite) =>
          favorite.participants.includes(selectedStudentId),
        );
  const visibleFavorites = showAllFavorites
    ? filteredFavorites
    : filteredFavorites.slice(0, maxVisibleFavorites);
  const maxVisibleStudents = 4;
  const visibleStudents = students.slice(0, maxVisibleStudents);
  const overflowStudents = students.slice(maxVisibleStudents);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="uppercase">Favorites</SidebarGroupLabel>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarGroupAction title="Filter by student">
            <ListFilterPlus />
            <span className="sr-only">Filter by student</span>
          </SidebarGroupAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
        >
          <DropdownMenuItem onSelect={() => setSelectedStudent('favorites', null)}>
            <CircleCheck
              className={
                selectedStudentId === null
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }
            />
            <span>View All</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {visibleStudents.map((student) => (
            <DropdownMenuItem
              key={student.id}
              onSelect={() => setSelectedStudent('favorites', student.id)}
            >
              <CircleCheck
                className={
                  selectedStudentId === student.id
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }
              />
              <span>{student.name}</span>
            </DropdownMenuItem>
          ))}
          {overflowStudents.length > 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {overflowStudents.map((student) => (
                  <DropdownMenuItem
                    key={student.id}
                    onSelect={() => setSelectedStudent('favorites', student.id)}
                  >
                    <CircleCheck
                      className={
                        selectedStudentId === student.id
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }
                    />
                    <span>{student.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <SidebarMenu>
        {visibleFavorites.map((item, index) => (
          <SidebarMenuItem key={`${item.name}-${index}`}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
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
                  <span>Remove from Favorites</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {filteredFavorites.length > maxVisibleFavorites && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setShowAllFavorites((prev) => !prev)}>
              <MoreHorizontal />
              <span>{showAllFavorites ? 'Hide' : 'More'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
