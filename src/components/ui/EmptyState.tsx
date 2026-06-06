import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compactMode?: boolean;
  alignment?: 'center' | 'start';
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  compactMode = false,
  alignment = 'center',
  className,
}: EmptyStateProps) {
  const isStart = alignment === 'start';
  return (
    <div
      className={cn(
        "flex flex-col select-none",
        isStart ? "text-start items-start justify-start" : "text-center items-center justify-center",
        compactMode ? "py-6 px-4" : "py-16 px-6 max-w-lg mx-auto w-full",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "rounded-2xl bg-accent/5 flex items-center justify-center mb-4 text-accent/80 dark:bg-accent/10",
            compactMode ? "w-10 h-10" : "w-16 h-16"
          )}
        >
          <Icon className={cn(compactMode ? "w-5 h-5" : "w-8 h-8")} />
        </div>
      )}
      <h3 className={cn("font-black text-slate-800 dark:text-slate-100", compactMode ? "text-xs mb-1" : "text-base mb-1.5")}>
        {title}
      </h3>
      <p className={cn("text-muted-light dark:text-muted-dark font-medium leading-relaxed mb-5", isStart ? "" : "mx-auto", compactMode ? "text-[10px] max-w-xs" : "text-xs max-w-sm")}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size={compactMode ? "sm" : "md"}
          className="font-bold cursor-pointer"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
