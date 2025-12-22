'use client';

import { useState } from 'react';
import {
  CircleCheck,
  ListFilterPlus,
  ListXIcon,
  MoreHorizontal,
  StarOff,
  type LucideIcon,
} from 'lucide-react';

import { Collapsible } from '../../ui/collapsible';
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
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { useStudentFilter } from './student-filter-context';

export function NavClassrooms({
  classrooms,
}: {
  classrooms: {
    name: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    participants: number[];
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { isMobile } = useSidebar();
  const { students, selectedStudentBySection, setSelectedStudent } =
    useStudentFilter();
  const selectedStudentId = selectedStudentBySection.classrooms;
  const [showAllClassrooms, setShowAllClassrooms] = useState(false);
  const maxVisibleClassrooms = 5;
  const filteredClassrooms =
    selectedStudentId === null
      ? classrooms
      : classrooms.filter((classroom) =>
          classroom.participants.includes(selectedStudentId),
        );
  const visibleClassrooms = showAllClassrooms
    ? filteredClassrooms
    : filteredClassrooms.slice(0, maxVisibleClassrooms);
  const maxVisibleStudents = 4;
  const visibleStudents = students.slice(0, maxVisibleStudents);
  const overflowStudents = students.slice(maxVisibleStudents);
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">Classrooms</SidebarGroupLabel>
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
          <DropdownMenuItem
            onSelect={() => setSelectedStudent('classrooms', null)}
          >
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
              onSelect={() => setSelectedStudent('classrooms', student.id)}
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
                    onSelect={() =>
                      setSelectedStudent('classrooms', student.id)
                    }
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
        {visibleClassrooms.map((item, index) => (
          <Collapsible
            key={`${item.name}-${index}`}
            asChild
            defaultOpen={item.isActive}
          >
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.name}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
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
          </Collapsible>
        ))}
        {filteredClassrooms.length > maxVisibleClassrooms && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setShowAllClassrooms((prev) => !prev)}>
              <MoreHorizontal />
              <span>{showAllClassrooms ? 'Hide' : 'More'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
