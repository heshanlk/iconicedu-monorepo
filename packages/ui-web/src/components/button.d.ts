import * as React from 'react';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}
export declare const Button: any;
export {};
