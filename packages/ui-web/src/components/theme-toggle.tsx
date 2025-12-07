'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@iconicedu/ui-web/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@iconicedu/ui-web/ui/dropdown-menu';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const current = resolvedTheme ?? 'light';
  const Icon = current === 'dark' ? Sun : Moon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="relative h-10 w-10 p-0"
          aria-label="Toggle theme"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
