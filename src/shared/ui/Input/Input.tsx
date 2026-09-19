import { type ComponentPropsWithoutRef, type Ref, useId } from 'react';
import { cn } from '@/shared/lib';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  error?: string;
}

export const Input = ({
  label,
  error,
  id,
  className,
  ref,
  ...props
}: InputProps & { ref?: Ref<HTMLInputElement> }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="text-text mb-1 block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'rounded-input border-border bg-surface focus-visible:ring-primary h-10 w-full border px-3 py-2 text-sm file:border-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error focus-visible:ring-error',
          className,
        )}
        {...props}
      />
      {error && <p className="text-error mt-1 text-sm">{error}</p>}
    </div>
  );
};
