'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@iconicedu/ui-web/ui/button';

export function ThemeToggle({ ...props }) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Default to system theme when nothing is set.
    if (!theme) {
      setTheme('system');
    }
  }, [setTheme, theme]);

  const current = resolvedTheme ?? 'system';
  const Icon = current === 'dark' ? Sun : Moon;

  const handleToggle = () => {
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <Button
      variant="ghost"
      className="relative p-0 size-9"
      aria-label="Toggle theme"
      onClick={handleToggle}
      {...props}
    >
      {mounted ? <Icon className="h-4 w-4" /> : null}
    </Button>
  );
}
