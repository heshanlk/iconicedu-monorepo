import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
import { cn } from '../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
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
  <Pressable className={cn(base, variants[variant], className)} {...rest}>
    <Text className="text-sm font-medium text-white">{label}</Text>
  </Pressable>
);
