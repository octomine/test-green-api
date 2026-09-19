import {
  type ComponentPropsWithoutRef,
  type Ref,
  useId,
  useRef,
  useCallback,
  useEffect,
  type ChangeEventHandler,
} from 'react';
import { cn } from '@/shared/lib';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  error?: string;
  autoResize?: boolean;
}

export const Textarea = ({
  label,
  error,
  id,
  autoResize = false,
  className,
  onChange,
  ref,
  ...props
}: TextareaProps & { ref?: Ref<HTMLTextAreaElement> }) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAutoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (autoResize) {
      handleAutoResize();
    }

    // Вызываем внешний onChange всегда
    onChange?.(e);
  };

  // Применяем autoResize при первом рендере и при изменении значения
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      handleAutoResize();
    }
  }, [autoResize, props.value]);

  // Объединяем ref'ы
  const combinedRefCallback = useCallback(
    (node: HTMLTextAreaElement) => {
      textareaRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="text-text mb-1 block text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        ref={combinedRefCallback}
        id={textareaId}
        className={cn(
          'rounded-input border-border bg-surface placeholder:text-text-muted focus-visible:ring-primary flex min-h-20 w-full border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error focus-visible:ring-error',
          className,
        )}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="text-error mt-1 text-sm">{error}</p>}
    </div>
  );
};
