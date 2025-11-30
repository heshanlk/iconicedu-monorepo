import * as React from 'react';
import { cn } from '../../lib/utils';

export function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />;
}

export function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('text-sm font-medium text-foreground', className)} {...props} />
  );
}

export function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function FieldError({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-destructive', className)} {...props} />;
}

export function FieldSeparator({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 text-sm text-muted-foreground',
        '[&>[data-slot=field-separator-content]]:flex [&>[data-slot=field-separator-content]]:flex-1 [&>[data-slot=field-separator-content]]:h-px [&>[data-slot=field-separator-content]]:bg-border',
        className,
      )}
      {...props}
    >
      <span data-slot="field-separator-content" />
      <span>{children}</span>
      <span data-slot="field-separator-content" />
    </div>
  );
}

export function FieldSet({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function FieldLegend({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-base font-semibold text-foreground leading-tight', className)}
      {...props}
    />
  );
}
