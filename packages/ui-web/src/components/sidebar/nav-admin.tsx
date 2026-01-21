'use client';

import * as React from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../../ui/sidebar';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export type AdminMenuLink = {
  title: string;
  url: string;
};

export type AdminMenuSection = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  links: AdminMenuLink[];
};

type NavAdminProps = {
  label?: string;
  sections: AdminMenuSection[];
  activePath?: string | null;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>;

export function NavAdmin({
  label = 'Administration',
  sections,
  activePath,
  ...props
}: NavAdminProps) {
  const getIsActive = React.useCallback(
    (url: string) =>
      activePath ? activePath === url || activePath.startsWith(url) : false,
    [activePath],
  );
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((section) => [section.title, false])),
  );
  const toggleSection = React.useCallback((title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  React.useEffect(() => {
    setOpenSections((prev) => {
      let changed = false;
      const next = { ...prev };
      sections.forEach((section) => {
        const shouldBeOpen = section.links.some((link) => getIsActive(link.url));
        if (shouldBeOpen && !next[section.title]) {
          next[section.title] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [getIsActive, sections]);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel asChild className="uppercase tracking-[0.35em] text-[11px]">
        <span>{label}</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sections.map((section) => {
            const sectionIsActive = section.links.some((link) => getIsActive(link.url));
            const sectionIsOpen = openSections[section.title] ?? false;
            return (
              <SidebarMenuItem key={section.title}>
                <SidebarMenuButton
                  type="button"
                  isActive={sectionIsActive}
                  data-open={sectionIsOpen ? 'true' : 'false'}
                  aria-expanded={sectionIsOpen}
                  onClick={() => toggleSection(section.title)}
                >
                  <section.icon className="size-4" />
                  <span>{section.title}</span>
                  <ChevronDown
                    className={cn(
                      'ml-auto transition-transform duration-200 ease-in',
                      sectionIsOpen ? 'rotate-180' : 'rotate-0',
                    )}
                  />
                </SidebarMenuButton>
                {sectionIsOpen && (
                  <SidebarMenuSub>
                    {section.links.map((link) => (
                      <SidebarMenuSubItem key={link.title}>
                        <SidebarMenuSubButton
                          asChild
                          size="md"
                          isActive={getIsActive(link.url)}
                        >
                          <a href={link.url}>{link.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
