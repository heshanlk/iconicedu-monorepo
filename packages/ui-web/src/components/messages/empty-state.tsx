'use client';

import * as React from 'react';
import {
  Search,
  Trophy,
  BookOpen,
  GraduationCap,
  Pencil,
  Medal,
  BookOpenCheck,
} from 'lucide-react';
import { Button } from '@iconicedu/ui-web/ui/button';

type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type EmptyMessagesStateProps = {
  title?: string;
  description?: React.ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryText?: React.ReactNode;
  showClearButton?: boolean;
  clearButtonLabel?: string;
};

interface FloatingIconProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function FloatingIcon({ children, style }: FloatingIconProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2 flex size-10 items-center justify-center rounded-full border border-border/30 bg-background shadow-sm"
      style={style}
    >
      {children}
    </div>
  );
}

export function EmptyMessagesState({
  title = 'Sorry, no results!',
  description = (
    <>
      We could not find any messages yet.
      <br />
      Please try again or browse all apps.
    </>
  ),
  primaryAction,
  secondaryText,
  showClearButton = false,
  clearButtonLabel = 'Clear search',
}: EmptyMessagesStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative flex h-52 w-full max-w-lg items-center justify-center">
        <div className="absolute size-32 rounded-full border border-muted-foreground/15" />
        <div className="absolute size-52 rounded-full border border-muted-foreground/15" />
        <div className="absolute size-72 rounded-full border border-muted-foreground/15" />
        <div className="absolute size-92 rounded-full border border-muted-foreground/15" />

        <FloatingIcon
          style={{ transform: 'translate(calc(-50% - 95px), calc(-50% - 70px))' }}
        >
          <Trophy className="size-5 text-indigo-300" />
        </FloatingIcon>

        <FloatingIcon
          style={{ transform: 'translate(calc(-50% + 75px), calc(-50% - 80px))' }}
        >
          <BookOpen className="size-5 text-blue-300" />
        </FloatingIcon>

        <FloatingIcon
          style={{ transform: 'translate(calc(-50% + 170px), calc(-50% - 30px))' }}
        >
          <GraduationCap className="size-5 text-orange-300" />
        </FloatingIcon>

        <FloatingIcon
          style={{ transform: 'translate(calc(-50% - 160px), calc(-50% + 10px))' }}
        >
          <Pencil className="size-5 text-rose-300" />
        </FloatingIcon>

        <FloatingIcon
          style={{ transform: 'translate(calc(-50% - 60px), calc(-50% - 15px))' }}
        >
          <Medal className="size-5 text-blue-300" />
        </FloatingIcon>

        <FloatingIcon
          style={{ transform: 'translate(calc(-50% + 80px), calc(-50% + 55px))' }}
        >
          <BookOpenCheck className="size-5 text-fuchsia-300" />
        </FloatingIcon>

        <div className="relative z-10 flex size-14 items-center justify-center rounded-full border border-border/30 bg-background shadow-sm">
          <Search className="size-7 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {showClearButton ? (
        <Button variant="outline" className="mt-6 px-6 bg-transparent">
          {clearButtonLabel}
        </Button>
      ) : null}

      {primaryAction ? (
        <Button
          variant="outline"
          className="mt-6 px-6 bg-transparent"
          onClick={primaryAction.onClick}
          asChild={Boolean(primaryAction.href)}
        >
          {primaryAction.href ? (
            <a href={primaryAction.href}>{primaryAction.label}</a>
          ) : (
            primaryAction.label
          )}
        </Button>
      ) : null}

      {secondaryText ? (
        <p className="mt-8 text-sm text-muted-foreground">{secondaryText}</p>
      ) : null}
    </div>
  );
}
