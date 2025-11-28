import * as React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const base =
  'inline-flex items-center justify-center rounded-2xl px-3.5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition';
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-500 focus-visible:ring-brand-500',
  secondary:
    'bg-slate-800 text-slate-50 hover:bg-slate-700 focus-visible:ring-slate-500',
  ghost: 'bg-transparent text-slate-100 hover:bg-slate-800/60',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => (
    <button ref={ref} className={clsx(base, variants[variant], className)} {...props} />
  ),
);

Button.displayName = 'Button';
