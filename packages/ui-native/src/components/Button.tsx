import React from 'react';
import { Pressable, Text, PressableProps, TextProps } from 'react-native';
import { cn } from '@iconicedu/ui-native/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

type PressableWithClassName = PressableProps & { className?: string };
const StyledPressable =
  Pressable as React.ComponentType<PressableWithClassName>;
type TextWithClassName = TextProps & { className?: string };
const StyledText = Text as React.ComponentType<TextWithClassName>;

export type ButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  className?: string;
};

const base =
  'flex-row items-center justify-center rounded-2xl px-4 py-2.5 active:opacity-80';
const variants: Record<Variant, string> = {
  primary: 'bg-brand-600',
  secondary: 'bg-slate-800',
  ghost: 'bg-transparent',
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  className,
  ...rest
}) => (
  <StyledPressable
    className={cn(base, variants[variant], className)}
    {...rest}
  >
    <StyledText className="text-sm font-medium text-white">
      {label}
    </StyledText>
  </StyledPressable>
);
