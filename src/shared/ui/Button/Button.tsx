import {
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react';
import { cn } from '@/shared/lib';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-primary hover:bg-primary-hover text-white',
  secondary: 'bg-bg-chat hover:bg-bg-chat/80 text-text border border-border',
  ghost: 'bg-transparent hover:bg-bg-chat text-text',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-sm rounded-input',
  md: 'h-10 px-4 text-base rounded-input',
  lg: 'h-12 px-6 text-lg rounded-input',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ref,
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
};
