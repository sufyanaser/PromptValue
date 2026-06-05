import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-xs font-bold opacity-70 pr-1">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "h-11 px-4 rounded-xl border transition-all outline-none text-sm font-medium",
            "bg-white dark:bg-surface2-dark border-border/40 focus:border-accent group-focus-within:border-accent",
            error && "border-danger",
            className
          )}
          {...props}
        />
        {error && <span className="text-[10px] text-danger font-bold pr-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, error?: string }>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-xs font-bold opacity-70 pr-1">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            "min-h-[120px] p-4 rounded-xl border transition-all outline-none text-sm font-medium resize-none",
            "bg-white dark:bg-surface2-dark border-border/40 focus:border-accent",
            error && "border-danger",
            className
          )}
          {...props}
        />
        {error && <span className="text-[10px] text-danger font-bold pr-1">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
