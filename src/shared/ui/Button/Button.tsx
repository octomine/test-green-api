import { type ComponentPropsWithoutRef, type Ref } from 'react';
import { cn } from '@/shared/lib';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
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
  icon: 'h-10 w-10 p-0 rounded-full',
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
        'focus-visible:ring-primary inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
};
